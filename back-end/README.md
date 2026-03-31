# 🚀 GUIA RÁPIDO - TCC Backend

## ⚡ Início Rápido (2 minutos)

### 1. Pré-requisitos
- [x] Java 21+ instalado
- [x] PostgreSQL instalado e rodando
- [x] Este projeto clonado/aberto

### 2. Criar Banco de Dados
Execute no **pgAdmin** ou **Command Prompt** (como admin):

```sql
CREATE DATABASE tcc WITH ENCODING 'UTF8';
```

### 3. Iniciar a Aplicação

**No PowerShell (do diretório do projeto):**

```powershell
# Modo desenvolvimento (recomendado)
.\run.ps1 dev

# Ou manualmente:
.\mvnw.cmd spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

### 4. Verificar se está rodando

Abra no navegador:
- **API**: http://localhost:8080/api
- **Health**: http://localhost:8080/api/actuator/health

Resposta esperada:
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    }
  }
}
```

---

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `application.properties` | Configuração padrão |
| `application-dev.properties` | Configuração desenvolvimento (DEBUG) |
| `application-prod.properties` | Configuração produção |
| `run.ps1` | Script de execução rápida |
| `CONFIGURACAO_LOCAL.md` | Guia detalhado de configuração |
| `TROUBLESHOOTING.md` | Resolução de problemas |
| `db/migration/` | Scripts SQL (Flyway) |

---

## 🔐 Credenciais Padrão (Desenvolvimento)

```
Username: admin
Password: admin123
```

> ⚠️ **NUNCA use essas credenciais em produção!**

---

## 📊 Opções do Script `run.ps1`

```powershell
.\run.ps1 dev      # Desenvolvimento (padrão)
.\run.ps1 prod     # Produção
.\run.ps1 build    # Apenas compilar
.\run.ps1 test     # Executar testes
.\run.ps1 clean    # Limpar arquivos gerados
```

---

## 🐘 PostgreSQL - Conexão Rápida

```powershell
# Terminal/CMD (como admin):
psql -U postgres -h localhost

# Dentro do psql:
\c tcc              # Conectar ao banco
\dt                 # Listar tabelas
SELECT * FROM tb_users;
\q                  # Sair
```

---

## 🐛 Erros Comuns

### "Connection refused"
- Verificar se PostgreSQL está rodando
- Windows: Services (services.msc) > postgresql > Status: Running

### Porta 8080 em uso
- Edite `application-dev.properties` e altere `server.port=8081`

### Banco não existe
- Execute no pgAdmin:
  ```sql
  CREATE DATABASE tcc WITH ENCODING 'UTF8';
  ```

Mais detalhes: Ver `TROUBLESHOOTING.md`

---

## 📚 Estrutura do Projeto

```
back-end/
├── src/main/
│   ├── java/
│   │   └── com/meutcc/backend/
│   │       ├── auth/          # Autenticação
│   │       ├── user/          # Usuários
│   │       ├── student/       # Alunos
│   │       ├── teacher/       # Professores
│   │       ├── content/       # Conteúdo (cursos, aulas, etc)
│   │       └── common/        # Configurações comuns
│   └── resources/
│       ├── application.properties      # Config padrão
│       ├── application-dev.properties  # Config dev
│       └── db/migration/               # Scripts SQL
├── pom.xml                    # Dependências Maven
├── run.ps1                    # Script de execução
└── CONFIGURACAO_LOCAL.md      # Documentação detalhada
```

---

## 🔗 Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/actuator/health` | Verificar saúde da aplicação |
| GET | `/api/actuator/metrics` | Métricas do sistema |
| POST | `/api/auth/login` | Autenticação |
| GET | `/api/users` | Listar usuários (requer autenticação) |

---

## 🛠️ Ferramentas Recomendadas

- **IDE**: JetBrains IntelliJ IDEA Community/Ultimate
- **REST Client**: Postman, Insomnia ou VS Code REST Client
- **DB Client**: pgAdmin, DBeaver ou SQL Workbench
- **GIT**: GitHub Desktop ou Git Bash

---

## 💾 Banco de Dados

### Tabelas Principais:
- `tb_roles` - Papéis (Admin, Professor, Aluno)
- `tb_users` - Usuários
- `tb_students` - Alunos
- `tb_teachers` - Professores
- `tb_courses` - Cursos/Disciplinas
- `tb_modules` - Módulos de um curso
- `tb_lessons` - Aulas
- `tb_exercises` - Exercícios
- `tb_attempts` - Tentativas de exercícios
- `tb_study_sessions` - Sessões de estudo

---

## 🚢 Deploy em Produção

```powershell
# 1. Build
.\run.ps1 build

# 2. Gerar JAR
# Arquivo gerado: target/back-end-0.0.1-SNAPSHOT.jar

# 3. Executar em produção
java -Dspring.profiles.active=prod `
     -Dspring.datasource.url=jdbc:postgresql://seu-host:5432/tcc `
     -Dspring.datasource.username=seu_usuario `
     -Dspring.datasource.password=sua_senha `
     -jar target/back-end-0.0.1-SNAPSHOT.jar
```

---

## 📖 Documentação Completa

- **Configuração Detalhada**: `CONFIGURACAO_LOCAL.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`
- **Spring Boot**: https://spring.io/projects/spring-boot
- **PostgreSQL**: https://www.postgresql.org/docs/

---

## ✅ Checklist de Primeira Execução

1. [ ] Java 21 instalado: `java -version`
2. [ ] PostgreSQL rodando e database 'tcc' criado
3. [ ] Clone/abra o projeto
4. [ ] Execute `.\run.ps1 dev`
5. [ ] Acesse http://localhost:8080/api/actuator/health
6. [ ] Deve responder com `"status":"UP"`

---

## 🆘 Precisa de Ajuda?

1. Consulte `TROUBLESHOOTING.md` para erros comuns
2. Verifique `CONFIGURACAO_LOCAL.md` para configurações detalhadas
3. Stack Overflow: tag com `spring-boot` e `postgresql`
4. Documentação oficial Spring Boot

---

**Versão**: 1.0  
**Data**: 31/03/2026  
**Status**: ✅ Pronto para desenvolvimento


