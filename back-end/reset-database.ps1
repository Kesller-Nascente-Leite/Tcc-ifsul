# Script para resetar banco de dados e aplicar migrações

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Resetando Banco de Dados              ║" -ForegroundColor Cyan
Write-Host "║  (Deletar e Recriar)                   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar conexão
Write-Host "[*] Verificando conexão com PostgreSQL..." -ForegroundColor Yellow
$conn = psql -U postgres -h localhost -c "SELECT version();" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "[✗] Erro: Não conseguiu conectar ao PostgreSQL" -ForegroundColor Red
    Write-Host "Verifique se o serviço está rodando e a senha está correta" -ForegroundColor Red
    exit 1
}

Write-Host "[✓] PostgreSQL conectado com sucesso" -ForegroundColor Green
Write-Host ""

# 2. Deletar banco antigo
Write-Host "[*] Deletando banco de dados 'tcc' antigo..." -ForegroundColor Yellow
psql -U postgres -h localhost -c "DROP DATABASE IF EXISTS tcc WITH (FORCE);" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Banco deletado com sucesso" -ForegroundColor Green
} else {
    Write-Host "[⚠] Aviso ao deletar banco (pode não existir)" -ForegroundColor Yellow
}

Write-Host ""

# 3. Aguardar um pouco
Start-Sleep -Seconds 1

# 4. Criar novo banco
Write-Host "[*] Criando novo banco de dados 'tcc'..." -ForegroundColor Yellow
psql -U postgres -h localhost -c "CREATE DATABASE tcc WITH ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8';" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Banco criado com sucesso" -ForegroundColor Green
} else {
    Write-Host "[✗] Erro ao criar banco" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 5. Aguardar um pouco para o banco estar pronto
Start-Sleep -Seconds 2

# 6. Verificar tabelas (deve estar vazio)
Write-Host "[*] Verificando tabelas do novo banco..." -ForegroundColor Yellow
psql -U postgres -h localhost -d tcc -c "\dt" 2>&1

Write-Host "[✓] Banco limpo e pronto para migrations" -ForegroundColor Green
Write-Host ""

# 7. Mensagem final
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✓ Banco Reset Concluído!             ║" -ForegroundColor Green
Write-Host "║                                        ║" -ForegroundColor Green
Write-Host "║  Próximo passo:                        ║" -ForegroundColor Green
Write-Host "║  Execute: .\run.ps1 dev               ║" -ForegroundColor Green
Write-Host "║                                        ║" -ForegroundColor Green
Write-Host "║  Flyway aplicará as migrations        ║" -ForegroundColor Green
Write-Host "║  automaticamente ao iniciar            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

