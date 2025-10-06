# verify-docker.ps1 (Adaptado para el proyecto ACTABD)
Write-Host "🐳 Script de Verificación Docker - ACTABD API" -ForegroundColor Cyan

# 1. Revisa que Docker esté funcionando
Write-Host "`n1. Comprobando el estado de Docker..." -ForegroundColor Yellow
docker --version
docker-compose --version

# 2. Revisa si hay contenedores activos
Write-Host "`n2. Comprobando contenedores en ejecución..." -ForegroundColor Yellow
docker ps

# 3. Prueba el entorno de producción local
Write-Host "`n3. Probando el entorno de producción local..." -ForegroundColor Yellow
Write-Host "Construyendo contenedores de producción (esto puede tardar un momento)..."
docker-compose build # Construye la imagen de producción desde tu Dockerfile

Write-Host "Iniciando contenedores de producción..."
docker-compose up -d # Inicia la API y la base de datos

# Espera a que los contenedores se inicien
Write-Host "Esperando que los contenedores se inicien (20 segundos)..."
Start-Sleep -Seconds 20

# Intenta contactar la API para ver si responde
Write-Host "Probando si la API de producción es accesible en http://localhost:3000..."
$maxRetries = 3
$retryCount = 0
$success = $false

while ($retryCount -lt $maxRetries -and -not $success) {
    try {
        # Usa el puerto 3000, que es el que tu API expone
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 15
        # La ruta raíz ("/") debe devolver un 200 OK con "Hello World!"
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ ¡La API de producción es accesible!" -ForegroundColor Green
            $success = $true
        } else {
            Write-Host "❌ La API de producción devolvió el estado: $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "⏳ Intento $retryCount fallido, reintentando en 5 segundos..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        } else {
            Write-Host "❌ La API de producción no es accesible después de $maxRetries intentos: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# 4. Detiene y limpia los contenedores
Write-Host "`nDeteniendo los contenedores de producción..."
docker-compose down

Write-Host "`n🎉 ¡Verificación de Docker completada!" -ForegroundColor Cyan