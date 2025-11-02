/**
 * Controller de Autenticación Multi-Empresa con Roles
 * Sistema robusto de autenticación y autorización
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../utils/prisma');
const { successResponse } = require('../middleware/errorHandler');

/**
 * Generar token JWT con información de empresa y rol
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      empresa_id: user.empresa_id,
      rol_id: user.rol_id
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '24h',
      issuer: 'voonda-api',
      audience: 'voonda-client'
    }
  );
};

/**
 * Registrar un nuevo usuario (solo para administradores)
 */
exports.register = async function (req, res) {
  const { email, password, nombre, apellido, telefono, empresa_id, rol_id } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Usuario ya existe',
        message: 'Ya existe una cuenta con este email'
      });
    }

    // Verificar que el rol existe
    const rol = await prisma.rol.findUnique({
      where: { id: rol_id }
    });

    if (!rol) {
      return res.status(400).json({
        success: false,
        error: 'Rol inválido',
        message: 'El rol especificado no existe'
      });
    }

    // Verificar empresa si es necesario
    if (empresa_id) {
      const empresa = await prisma.empresa.findUnique({
        where: { id: empresa_id }
      });

      if (!empresa) {
        return res.status(400).json({
          success: false,
          error: 'Empresa inválida',
          message: 'La empresa especificada no existe'
        });
      }
    }

    // Hashear la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario usando Prisma
    const newUser = await prisma.usuario.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        nombre: nombre.trim(),
        apellido: apellido?.trim(),
        telefono: telefono?.trim(),
        empresa_id: empresa_id || null,
        rol_id: rol_id
      },
      include: {
        empresa: true,
        rol: true
      }
    });

    // Generar token JWT
    const token = generateToken(newUser);

    // Respuesta exitosa (sin incluir la contraseña)
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      nombre: newUser.nombre,
      apellido: newUser.apellido,
      telefono: newUser.telefono,
      empresa: newUser.empresa,
      rol: newUser.rol,
      created_at: newUser.created_at
    };

    return successResponse(res, {
      token,
      user: userResponse
    }, 'Usuario registrado exitosamente', 201);

  } catch (error) {
    throw error;
  }
};

/**
 * Iniciar sesión
 */
exports.login = async function (req, res) {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email usando Prisma con empresa y rol
    const user = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        empresa: true,
        rol: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    if (!user.activo) {
      return res.status(401).json({
        success: false,
        error: 'Usuario desactivado',
        message: 'Tu cuenta ha sido desactivada'
      });
    }

    // Verificar si está bloqueado
    if (user.bloqueado_hasta && new Date() < user.bloqueado_hasta) {
      return res.status(423).json({
        success: false,
        error: 'Usuario bloqueado',
        message: 'Tu cuenta está temporalmente bloqueada'
      });
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Incrementar intentos fallidos
      await prisma.usuario.update({
        where: { id: user.id },
        data: {
          intentos_fallidos: user.intentos_fallidos + 1,
          bloqueado_hasta: user.intentos_fallidos >= 4 ? 
            new Date(Date.now() + 15 * 60 * 1000) : // Bloquear 15 minutos después de 5 intentos
            undefined
        }
      });

      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Resetear intentos fallidos y actualizar último login
    await prisma.usuario.update({
      where: { id: user.id },
      data: {
        intentos_fallidos: 0,
        bloqueado_hasta: null,
        ultimo_login: new Date()
      }
    });

    // Generar token JWT
    const token = generateToken(user);

    // Respuesta exitosa (sin incluir la contraseña)
    const userResponse = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono,
      empresa: user.empresa,
      rol: user.rol,
      ultimo_login: user.ultimo_login,
      created_at: user.created_at
    };

    return successResponse(res, {
      token,
      user: userResponse
    }, 'Inicio de sesión exitoso');

  } catch (error) {
    throw error;
  }
};

/**
 * Cerrar sesión
 */
exports.logout = async function (req, res) {
  // En una implementación real, aquí agregarías el token a una blacklist
  // Por ahora, simplemente confirmamos el logout exitoso
  
  return successResponse(res, {}, 'Sesión cerrada exitosamente');
};

/**
 * Obtener información del usuario autenticado
 */
exports.me = async function (req, res) {
  try {
    // El usuario ya está disponible en req.user gracias al middleware
    // Pero vamos a obtenerlo fresco desde Prisma para asegurar datos actualizados
    const user = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      include: {
        empresa: true,
        rol: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
        message: 'El usuario no existe en la base de datos'
      });
    }

    // Respuesta sin contraseña
    const userResponse = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono,
      empresa: user.empresa,
      rol: user.rol,
      ultimo_login: user.ultimo_login,
      created_at: user.created_at
    };

    return successResponse(res, {
      user: userResponse
    }, 'Información del usuario obtenida exitosamente');

  } catch (error) {
    throw error;
  }
};