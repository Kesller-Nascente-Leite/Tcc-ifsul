# Script para configurar JAVA_HOME e compilar o projeto

# Verificar possíveis localizações de Java
$javaPaths = @(
    "C:\Program Files\Java\jdk-21",
    "C:\Program Files\Java\jdk-21.0.0",
    "C:\Program Files\Java\jdk21",
    "C:\Program Files\jdk-21",
    "C:\Program Files (x86)\Java\jdk-21"
)

$javaFound = $false
foreach ($path in $javaPaths) {
    if (Test-Path "$path\bin\java.exe") {
        Write-Host "[✓] Java encontrado em: $path" -ForegroundColor Green
        [Environment]::SetEnvironmentVariable("JAVA_HOME", $path, "User")
        $env:JAVA_HOME = $path
        $javaFound = $true
        break
    }
}

if (-not $javaFound) {
    Write-Host "[✗] Java 21 não foi encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale Java 21 de https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Yellow
    exit 1
}

# Verificar
Write-Host ""
Write-Host "Verificando Java..." -ForegroundColor Blue
java -version

# Compilar projeto
Write-Host ""
Write-Host "Compilando projeto..." -ForegroundColor Blue
cd "C:\IFSul\TCC\Tcc-ifsul\back-end"
.\mvnw.cmd clean compile -q

if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Compilação bem-sucedida!" -ForegroundColor Green
} else {
    Write-Host "[✗] Erro na compilação!" -ForegroundColor Red
}

