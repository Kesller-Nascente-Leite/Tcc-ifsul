# ============================================================
# Script para executar o Backend TCC localmente
# ============================================================
# Uso: .\run.ps1 [opção]
# Opções:
#   dev     = Executa em modo desenvolvimento (padrão)
#   prod    = Executa em modo produção
#   build   = Faz build apenas
#   clean   = Limpa os arquivos gerados
#   test    = Executa os testes
# ============================================================

param(
    [string]$Mode = "dev"
)

# Cores para output
$Red = @{ Object = ""; ForegroundColor = "Red"; }
$Green = @{ Object = ""; ForegroundColor = "Green"; }
$Yellow = @{ Object = ""; ForegroundColor = "Yellow"; }
$Blue = @{ Object = ""; ForegroundColor = "Blue"; }

function Show-Banner {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════╗" @Blue
    Write-Host "║         Backend TCC - Script Executor             ║" @Blue
    Write-Host "║              IFSul - 2026                         ║" @Blue
    Write-Host "╚═══════════════════════════════════════════════════╝" @Blue
    Write-Host ""
}

function Check-Prerequisites {
    Write-Host "[*] Verificando pré-requisitos..." @Yellow

    # Verificar Java
    $javaVersion = java -version 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[✗] Java não encontrado! Por favor instale Java 21." @Red
        exit 1
    }
    Write-Host "[✓] Java encontrado" @Green

    # Verificar Maven Wrapper
    if (!(Test-Path ".\mvnw.cmd")) {
        Write-Host "[✗] Maven Wrapper não encontrado!" @Red
        exit 1
    }
    Write-Host "[✓] Maven Wrapper encontrado" @Green

    # Verificar PostgreSQL
    try {
        $pgIsql = Invoke-Expression "psql --version 2>&1" -ErrorAction SilentlyContinue
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[✓] PostgreSQL CLI encontrado" @Green
        } else {
            Write-Host "[⚠] PostgreSQL CLI não encontrado (opcional)" @Yellow
        }
    } catch {
        Write-Host "[⚠] PostgreSQL não verificado (opcional)" @Yellow
    }
}

function Build-Project {
    Write-Host ""
    Write-Host "[*] Compilando projeto..." @Yellow

    .\mvnw.cmd clean package -DskipTests -q

    if ($LASTEXITCODE -eq 0) {
        Write-Host "[✓] Build realizado com sucesso!" @Green
    } else {
        Write-Host "[✗] Erro durante o build!" @Red
        exit 1
    }
}

function Run-Dev {
    Write-Host ""
    Write-Host "[*] Iniciando Backend em modo DESENVOLVIMENTO..." @Yellow
    Write-Host "[*] Acesse: http://localhost:8080/api" @Blue
    Write-Host "[*] Healthcheck: http://localhost:8080/api/actuator/health" @Blue
    Write-Host "[*] Pressione CTRL+C para parar..." @Yellow
    Write-Host ""

    .\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--spring.profiles.active=dev"
}

function Run-Prod {
    Write-Host ""
    Write-Host "[*] Compilando projeto para PRODUÇÃO..." @Yellow
    Build-Project

    Write-Host ""
    Write-Host "[*] Iniciando Backend em modo PRODUÇÃO..." @Yellow
    Write-Host "[*] Acesse: http://localhost:8080/api" @Blue
    Write-Host ""

    java -Dspring.profiles.active=prod -jar target/back-end-0.0.1-SNAPSHOT.jar
}

function Run-Tests {
    Write-Host ""
    Write-Host "[*] Executando testes..." @Yellow

    .\mvnw.cmd test

    if ($LASTEXITCODE -eq 0) {
        Write-Host "[✓] Testes passaram com sucesso!" @Green
    } else {
        Write-Host "[✗] Alguns testes falharam!" @Red
        exit 1
    }
}

function Clean-Project {
    Write-Host ""
    Write-Host "[*] Limpando arquivos gerados..." @Yellow

    .\mvnw.cmd clean -q

    Write-Host "[✓] Projeto limpo!" @Green
}

# ============================================================
# Main Script
# ============================================================

Show-Banner

switch ($Mode.ToLower()) {
    "dev" {
        Check-Prerequisites
        Run-Dev
    }
    "prod" {
        Check-Prerequisites
        Run-Prod
    }
    "build" {
        Check-Prerequisites
        Build-Project
        Write-Host ""
        Write-Host "[✓] JAR gerado em: target/back-end-0.0.1-SNAPSHOT.jar" @Green
    }
    "clean" {
        Clean-Project
    }
    "test" {
        Check-Prerequisites
        Run-Tests
    }
    default {
        Write-Host "[✗] Modo desconhecido: $Mode" @Red
        Write-Host ""
        Write-Host "Uso: .\run.ps1 [opção]" @Yellow
        Write-Host "Opções disponíveis:" @Yellow
        Write-Host "  dev     = Desenvolvimento (padrão)"
        Write-Host "  prod    = Produção"
        Write-Host "  build   = Apenas compilar"
        Write-Host "  clean   = Limpar arquivos"
        Write-Host "  test    = Executar testes"
        exit 1
    }
}

