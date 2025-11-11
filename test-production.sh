#!/bin/bash

# 🔍 Script de Testing para API Voonda en Producción
# Dominio: https://api.fratelli.voonda.net

echo "🚀 Testing Voonda API en Producción"
echo "======================================"

BASE_URL="https://api.fratelli.voonda.net"

# Test 1: Health Check
echo "1️⃣  Testing Health Check..."
curl -s "$BASE_URL/health" | jq
echo ""

# Test 2: DB Health Check  
echo "2️⃣  Testing Database Health..."
curl -s "$BASE_URL/db-health" | jq
echo ""

# Test 3: Root endpoint
echo "3️⃣  Testing Root Endpoint..."
curl -s "$BASE_URL/" | jq
echo ""

# Test 4: Swagger Documentation
echo "4️⃣  Testing Swagger Documentation..."
SWAGGER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api-docs")
if [ "$SWAGGER_STATUS" = "200" ]; then
    echo "✅ Swagger UI está disponible en: $BASE_URL/api-docs"
else
    echo "❌ Swagger UI no está disponible (Status: $SWAGGER_STATUS)"
    echo "🔍 Testeando endpoint de documentación alternativo..."
    curl -s "$BASE_URL/api-docs" | jq
fi
echo ""

# Test 5: Frontend Documentation
echo "5️⃣  Testing Frontend Documentation..."
DOCS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/frontend-api-docs.md")
if [ "$DOCS_STATUS" = "200" ]; then
    echo "✅ Documentación Frontend disponible en: $BASE_URL/frontend-api-docs.md"
else
    echo "❌ Documentación Frontend no disponible (Status: $DOCS_STATUS)"
fi
echo ""

# Test 6: Login (datos de prueba)
echo "6️⃣  Testing Login Endpoint..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin.empresa@voonda.com","password":"admin123"}')

echo "$LOGIN_RESPONSE" | jq

# Extraer token si el login fue exitoso
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "✅ Login exitoso! Token obtenido."
    echo ""
    
    # Test 7: Obtener Estados con autorización
    echo "7️⃣  Testing Estados Endpoint (con auth)..."
    curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/estados" | jq
    echo ""
    
    # Test 8: Obtener Vehículos con autorización
    echo "8️⃣  Testing Vehículos Endpoint (con auth)..."
    curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/vehiculos?limit=3" | jq
    echo ""
else
    echo "❌ Login falló. No se pueden probar endpoints autenticados."
    echo ""
fi

echo "🏁 Testing completado!"
echo ""
echo "📖 Enlaces útiles:"
echo "   • API Base: $BASE_URL"
echo "   • Swagger UI: $BASE_URL/api-docs"
echo "   • Health Check: $BASE_URL/health"
echo "   • Frontend Docs: $BASE_URL/frontend-api-docs.md"