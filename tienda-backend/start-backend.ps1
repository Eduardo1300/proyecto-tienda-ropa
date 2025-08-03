# Script para iniciar el backend
Set-Location "C:\Users\User\3D Objects\proyecto_tienda_de_ropa\tienda-backend"
$env:PORT="3002"
$env:DB_HOST="localhost"
$env:DB_PORT="5432"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="postgres"
$env:DB_NAME="tienda_db"
$env:JWT_SECRET="clave_secreta_acceso"
$env:JWT_ACCESS_SECRET="claveacceso123"
$env:JWT_REFRESH_SECRET="claverefresh456"
$env:JWT_EXPIRES_IN="1h"

Write-Host "Iniciando backend en puerto 3002..."
node dist/main.js
