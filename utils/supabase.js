const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

// Cliente Supabase con rol de servicio para operaciones del backend
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Funciones utilitarias para manejo de la base de datos
const dbHelpers = {
  // Obtener vehículos con filtros y paginación
  async getVehiculos(filters = {}) {
    const {
      page = 1,
      limit = 12,
      marca = '',
      estado = '',
      yearFrom = '',
      yearTo = '',
      priceFrom = '',
      priceTo = '',
      search = '',
      orderBy = 'created_at',
      order = 'desc'
    } = filters;

    let query = supabase
      .from('vehiculos')
      .select(`
        *,
        modelo_autos (
          marca,
          modelo,
          año,
          combustible,
          caja
        )
      `, { count: 'exact' });

    // Aplicar filtros
    if (marca) {
      query = query.eq('marca', marca);
    }
    
    if (estado) {
      query = query.eq('estado', estado);
    }

    if (yearFrom) {
      query = query.gte('vehiculo_ano', parseInt(yearFrom));
    }

    if (yearTo) {
      query = query.lte('vehiculo_ano', parseInt(yearTo));
    }

    if (priceFrom) {
      query = query.gte('valor', parseFloat(priceFrom));
    }

    if (priceTo) {
      query = query.lte('valor', parseFloat(priceTo));
    }

    if (search) {
      query = query.or(`marca.ilike.%${search}%,modelo.ilike.%${search}%,descripcion.ilike.%${search}%`);
    }

    // Ordenamiento
    query = query.order(orderBy, { ascending: order === 'asc' });

    // Paginación
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return {
      vehiculos: data,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    };
  },

  // Obtener un vehículo por ID
  async getVehiculoById(id) {
    const { data, error } = await supabase
      .from('vehiculos')
      .select(`
        *,
        modelo_autos (
          marca,
          modelo,
          año,
          combustible,
          caja
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Crear un nuevo vehículo
  async createVehiculo(vehiculoData) {
    const { data, error } = await supabase
      .from('vehiculos')
      .insert([vehiculoData])
      .select(`
        *,
        modelo_autos (
          marca,
          modelo,
          año,
          combustible,
          caja
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Actualizar un vehículo
  async updateVehiculo(id, vehiculoData) {
    const { data, error } = await supabase
      .from('vehiculos')
      .update(vehiculoData)
      .eq('id', id)
      .select(`
        *,
        modelo_autos (
          marca,
          modelo,
          año,
          combustible,
          caja
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Eliminar un vehículo
  async deleteVehiculo(id) {
    const { error } = await supabase
      .from('vehiculos')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  },

  // Funciones para autenticación de usuarios
  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // No rows found
      throw error;
    }

    return data;
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([userData])
      .select('id, email, name, created_at')
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async getUserById(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, name, created_at')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Función para obtener datos de muestra de las tablas
  async getSampleData(tableName, limit = 5) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(limit);

      if (error) {
        console.error(`Error obteniendo datos de muestra de ${tableName}:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`Error obteniendo datos de muestra de ${tableName}:`, error);
      return null;
    }
  },

  // Inferir tipo de dato desde el valor
  inferDataType(value) {
    if (value === null || value === undefined) return 'unknown';
    if (typeof value === 'string') {
      if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) return 'timestamp';
      if (value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) return 'uuid';
      return 'text';
    }
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'integer' : 'numeric';
    }
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'object') return 'json';
    return 'unknown';
  },

  // Función para generar modelos basados en la estructura
  async generateModels() {
    try {
      // Obtener tablas conocidas y sus datos de muestra
      const knownTables = ['usuarios', 'vehiculos', 'modelo_autos'];
      const models = {};

      for (const tableName of knownTables) {
        try {
          const sampleData = await this.getSampleData(tableName, 3);
          
          if (sampleData && sampleData.length > 0) {
            const modelName = tableName.charAt(0).toUpperCase() + tableName.slice(1);
            
            models[modelName] = {
              tableName: tableName,
              fields: {},
              sampleData: sampleData
            };

            // Generar campos basados en la muestra
            Object.keys(sampleData[0]).forEach(fieldName => {
              const sampleValue = sampleData[0][fieldName];
              models[modelName].fields[fieldName] = {
                type: this.mapDataType(this.inferDataType(sampleValue)),
                originalType: this.inferDataType(sampleValue),
                sampleValue: sampleValue
              };
            });
          }
        } catch (error) {
          console.warn(`No se pudo analizar la tabla ${tableName}:`, error.message);
        }
      }

      return models;
    } catch (error) {
      console.error('Error generando modelos:', error);
      throw error;
    }
  },

  // Mapear tipos de PostgreSQL a tipos más legibles
  mapDataType(pgType) {
    const typeMap = {
      'uuid': 'UUID',
      'character varying': 'String',
      'varchar': 'String',
      'text': 'Text',
      'integer': 'Integer',
      'bigint': 'BigInteger',
      'decimal': 'Decimal',
      'numeric': 'Numeric',
      'real': 'Float',
      'double precision': 'Double',
      'boolean': 'Boolean',
      'timestamp with time zone': 'DateTime',
      'timestamp without time zone': 'DateTime',
      'timestamp': 'DateTime',
      'date': 'Date',
      'time': 'Time',
      'json': 'JSON',
      'jsonb': 'JSONB',
      'unknown': 'Any'
    };

    return typeMap[pgType] || pgType;
  }
};

module.exports = {
  supabase,
  dbHelpers
};