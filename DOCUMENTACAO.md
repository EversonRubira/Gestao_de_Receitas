# Sistema de Gestao de Receitas

Projeto PIS 2025/2026 - CTeSP TPSI

## Alunos

- Everson Rubira (202301089)
- Fabio Guerreiro

## Tecnologias Usadas

- Node.js + Express
- MySQL
- EJS (templates)
- bcryptjs (passwords)

## Funcionalidades

- Criar, ver, editar e apagar receitas
- Login e registo de utilizadores
- Area de administracao (backoffice)
- API REST
- Integracao com API externa (TheMealDB)

## Como Instalar

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar .env

Copiar o ficheiro `.env.example` para `.env` e preencher:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=gestao_receitas
PORT=3000
```

### 3. Criar base de dados

```bash
mysql -u root -p < database/schema.sql
```

### 4. Iniciar servidor

```bash
npm start
```

Abrir no browser: http://localhost:3000

## Credenciais Padrao

Admin:
- Email: admin@receitas.pt
- Password: admin123

User:
- Email: joao@exemplo.pt
- Password: password123

## Estrutura do Projeto

```
Projeto/
├── database/           Base de dados SQL
├── public/            CSS, JS, imagens
├── src/
│   ├── config/        Configuracao BD
│   ├── middleware/    Autenticacao
│   ├── models/        Receita, Utilizador, etc
│   └── routes/        Rotas do sistema
├── views/             Templates EJS
└── server.js          Ficheiro principal
```

## Base de Dados

Tabelas:
- utilizadores (admin/user)
- receitas
- categorias
- dificuldades
- ingredientes
- receita_ingredientes (ligacao)
- avaliacoes

## API REST

### Autenticacao (JWT)

```
POST /api/auth/login          Login (devolve token JWT)
```

### Receitas

```
GET    /api/receitas          Listar todas (publica)
GET    /api/receitas/:id      Ver uma (publica)
POST   /api/receitas          Criar nova (precisa JWT)
PUT    /api/receitas/:id      Atualizar (precisa JWT)
DELETE /api/receitas/:id      Apagar (precisa JWT)
```

### Outras

```
GET /api/categorias           Listar categorias
GET /api/ingredientes         Listar ingredientes
GET /api/external/random      Receita aleatoria externa
```

**Nota:** Rotas marcadas com "precisa JWT" exigem token de autenticacao.
Ver ficheiro TESTE_API_JWT.md para exemplos de uso.

## Seguranca

- Passwords encriptadas com bcrypt
- Prepared statements (SQL injection)
- Sessions para autenticacao (backoffice e web)
- JWT para autenticacao da API
- Middleware de autorizacao

## Problemas Conhecidos

### Porta 3000 ocupada

Windows:
```bash
netstat -ano | findstr :3000
taskkill //F //PID [numero]
```

Linux/Mac:
```bash
lsof -ti:3000 | xargs kill -9
```

### MySQL nao conecta

- Verificar se MySQL esta a correr
- Confirmar dados no .env
- Testar: `mysql -u root -p`
