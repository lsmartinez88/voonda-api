const { processPendientesPreparacion } = require('../utils/vehiculoHelpers');

// Test cases para validar el procesamiento de pendientes_preparacion
console.log('🧪 Testing processPendientesPreparacion function...\n');

const testCases = [
  {
    name: 'Array de strings',
    input: ['Revisión mecánica', 'Limpieza', 'Documentos'],
    expected: ['Revisión mecánica', 'Limpieza', 'Documentos']
  },
  {
    name: 'String con saltos de línea',
    input: 'Revisión mecánica\nLimpieza completa\nDocumentos al día',
    expected: ['Revisión mecánica', 'Limpieza completa', 'Documentos al día']
  },
  {
    name: 'String simple',
    input: 'Revisión mecánica',
    expected: ['Revisión mecánica']
  },
  {
    name: 'String vacío',
    input: '',
    expected: []
  },
  {
    name: 'null',
    input: null,
    expected: []
  },
  {
    name: 'undefined',
    input: undefined,
    expected: []
  },
  {
    name: 'String con saltos de línea y líneas vacías',
    input: 'Item 1\n\nItem 2\n   \nItem 3',
    expected: ['Item 1', 'Item 2', 'Item 3']
  },
  {
    name: 'Array con elementos vacíos',
    input: ['Item 1', '', 'Item 2', null, 'Item 3'],
    expected: ['Item 1', 'Item 2', 'Item 3']
  },
  {
    name: 'String con espacios',
    input: '  Revisión mecánica  \n  Limpieza  ',
    expected: ['Revisión mecánica', 'Limpieza']
  }
];

testCases.forEach((testCase, index) => {
  console.log(`📋 Test ${index + 1}: ${testCase.name}`);
  console.log(`📥 Input:`, testCase.input);
  
  const result = processPendientesPreparacion(testCase.input);
  
  console.log(`📤 Output:`, result);
  console.log(`✅ Expected:`, testCase.expected);
  
  const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
  console.log(passed ? '🎉 PASSED' : '❌ FAILED');
  console.log('---\n');
});

console.log('🚀 Testing validación Joi...');

// Test de validación con diferentes formatos
const Joi = require('joi');

const pendientesValidation = Joi.alternatives().try(
  Joi.array().items(Joi.string().max(500).trim()),  // Arrays de strings
  Joi.string().max(2000),                           // Strings (incluye \n)
  Joi.valid(null, '')                               // Solo null y string vacío
).optional().messages({
  'array.base': 'pendientes_preparacion debe ser un array de strings o un string',
  'string.max': 'Cada pendiente no puede tener más de 500 caracteres',
  'alternatives.match': 'pendientes_preparacion debe ser un array de strings, un string, o estar vacío'
});

const validationTests = [
  { input: ['Item 1', 'Item 2'], shouldPass: true },
  { input: 'String simple', shouldPass: true },
  { input: 'String\ncon\nsaltos', shouldPass: true },
  { input: '', shouldPass: true },
  { input: null, shouldPass: true },
  { input: 123, shouldPass: false },  // Números no permitidos
  { input: 'x'.repeat(2001), shouldPass: false }  // String demasiado largo
];

validationTests.forEach((test, index) => {
  const { error } = pendientesValidation.validate(test.input);
  const passed = test.shouldPass ? !error : !!error;
  
  console.log(`🔍 Validation Test ${index + 1}:`);
  console.log(`📥 Input:`, test.input);
  console.log(`✅ Should pass: ${test.shouldPass}`);
  console.log(`📊 Result: ${passed ? 'PASSED' : 'FAILED'}`);
  if (error) console.log(`❌ Error: ${error.message}`);
  console.log('---');
});

console.log('✅ All tests completed!');