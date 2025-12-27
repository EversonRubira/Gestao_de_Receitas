# Manual Tecnico

Sistema de Gestao de Receitas - Projeto PIS 2025/2026

## 1. Tecnologias

**Backend:**
- Node.js (v14+)
- Express.js (v4.18.2)
- MySQL (v5.7+)

**Autenticacao:**
- jsonwebtoken (JWT)
- bcryptjs (encriptacao de passwords)
- cookie-parser (gestao de cookies)

**Outros:**
- EJS (templates)
- body-parser
- express-fileupload (upload de ficheiros)
- axios (APIs externas)
- dotenv (variaveis de ambiente)
- mysql2 (driver MySQL)

## 2. Estrutura do Projeto

```
Projeto/
├── database/
│   ├── schema.sql
│   └── adicionar_imagens.sql
│
├── public/
│   ├── css/
│   ├── js/
│   └── uploads/
│
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── upload.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── Receita.js
│   │   ├── Utilizador.js
│   │   ├── Categoria.js
│   │   └── Ingrediente.js
│   │
│   └── routes/
│       ├── apiRoutes.js
│       ├── authRoutes.js
│       ├── backofficeRoutes.js
│       └── frontofficeRoutes.js
│
├── views/
│   ├── backoffice/
│   ├── frontoffice/
│   └── partials/
│
├── .env
├── package.json
└── server.js
```

## 3. Base de Dados

### Tabelas

1. **utilizadores** - Admin ou user normal
2. **receitas** - Informacao das receitas
3. **categorias** - Sopas, Sobremesas, etc
4. **dificuldades** - Facil, Medio, Dificil
5. **ingredientes** - Lista de ingredientes
6. **receita_ingredientes** - Liga receitas a ingredientes
7. **avaliacoes** - Classificacoes 1-5 estrelas

### Tabela receitas

```sql
CREATE TABLE receitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    descricao_preparacao TEXT NOT NULL,
    tempo_preparacao INT NOT NULL,
    custo DECIMAL(10, 2) NOT NULL,
    porcoes INT DEFAULT 1,
    imagem VARCHAR(255),
    categoria_id INT NOT NULL,
    dificuldade_id INT NOT NULL,
    utilizador_id INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. API REST

**URL base:** `http://localhost:3000/api`

### Autenticacao

```
POST /api/auth/login            Login (devolve token JWT)
```

**Exemplo:**
```json
POST /api/auth/login
Body: {
  "email": "admin@receitas.pt",
  "password": "admin123"
}

Resposta: {
  "success": true,
  "token": "eyJhbGc...",
  "utilizador": {...}
}
```

### Receitas

```
GET  /api/receitas              Listar (pode filtrar)
GET  /api/receitas/:id          Ver uma
POST /api/receitas              Criar (precisa token JWT)
PUT  /api/receitas/:id          Atualizar (precisa token JWT)
DELETE /api/receitas/:id        Apagar (precisa token JWT)
```

Exemplo criar receita:
```json
{
  "nome": "Arroz de Tomate",
  "autor": "Maria",
  "descricao_preparacao": "...",
  "tempo_preparacao": 30,
  "custo": 5.50,
  "porcoes": 4,
  "categoria_id": 3,
  "dificuldade_id": 1
}
```

### Outras

```
GET /api/categorias
GET /api/ingredientes
GET /api/external/random
GET /api/external/search/:termo
```

## 5. Autenticacao

Sistema usa **JWT (JSON Web Tokens)** para toda a autenticacao (Web e API).

### Como Funciona

O sistema usa JWT de forma unificada:
- **Web/Backoffice**: JWT guardado em cookie (httpOnly)
- **API REST**: JWT enviado no header Authorization

### Login Web

Quando o utilizador faz login no browser:

```javascript
// 1. Sistema gera token JWT
const token = gerarToken({
    id: utilizador.id,
    nome: utilizador.nome,
    email: utilizador.email,
    tipo: utilizador.tipo
});

// 2. Token e guardado em cookie
res.cookie('token', token, {
    httpOnly: true,              // Seguranca: nao acessivel via JavaScript
    maxAge: 24 * 60 * 60 * 1000  // Valido por 24 horas
});

// 3. Token tambem guardado em localStorage (para uso da API)
localStorage.setItem('token', token);
```

### Middlewares para Paginas Web

**isAuthenticated** - Verifica se o utilizador esta logado
```javascript
router.get('/perfil', isAuthenticated, function(req, res) {
    // req.utilizador contem dados do token JWT
    // {id, nome, email, tipo}
});
```

**isAdmin** - Verifica se o utilizador e administrador
```javascript
router.use('/backoffice', isAdmin, function(req, res) {
    // Apenas admins podem aceder
});
```

### JWT para API REST

**protegerRotaAPI** - Verifica token JWT em pedidos API
```javascript
router.post('/api/receitas', protegerRotaAPI, function(req, res) {
    // req.utilizador tem os dados do token decodificado
});
```

**Como usar a API:**

1. Fazer login para obter token:
```bash
POST /api/auth/login
Body: {
  "email": "user@exemplo.pt",
  "password": "password123"
}

Resposta: {
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "utilizador": {...}
}
```

2. Guardar o token recebido

3. Enviar token em cada pedido:
```bash
GET /api/receitas
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token expira em 24 horas.**

### Vantagens do JWT

- **Stateless**: Servidor nao precisa guardar sessoes em memoria
- **Escalavel**: Funciona bem com multiplos servidores
- **Seguro**: Cookie com httpOnly previne ataques XSS
- **Flexivel**: Mesmo sistema para web e API

### Passwords

Passwords sao encriptadas com bcrypt:

```javascript
// Encriptar
bcrypt.hash(password, 10, function(erro, hash) {
    // guardar hash
});

// Verificar
bcrypt.compare(password, hash, function(erro, correto) {
    // correto = true ou false
});
```

## 6. Models

### Receita.js

Funcoes principais:
- `listarTodasReceitas(callback)`
- `buscarReceitaPorId(id, callback)`
- `criarReceita(dados, callback)`
- `atualizarReceita(id, dados, callback)`
- `eliminarReceita(id, callback)`
- `buscarIngredientesReceita(id, callback)`

### Utilizador.js

- `buscarUtilizadorPorEmail(email, callback)`
- `criarUtilizador(dados, callback)`
- `verificarPassword(password, hash, callback)`

## 7. Rotas

### Login/Registo (authRoutes.js)

```
GET  /login
POST /login
GET  /registo
POST /registo
GET  /logout
```

### Publicas (frontofficeRoutes.js)

```
GET /
GET /receita/:id
GET /categoria/:id
GET /pesquisa
```

### Admin (backofficeRoutes.js)

Todas precisam de login admin:

```
GET  /backoffice
GET  /backoffice/receitas
GET  /backoffice/receitas/nova
POST /backoffice/receitas/nova
GET  /backoffice/receitas/editar/:id
POST /backoffice/receitas/editar/:id
POST /backoffice/receitas/eliminar/:id
```

## 8. Configuracao

### .env

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=gestao_receitas
DB_PORT=3306
JWT_SECRET=chave_secreta_jwt_mudar_em_producao
```

### database.js

Usa conexao simples ao MySQL:

```javascript
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});
```

### upload.js

Upload de imagens:
- Pasta: `public/uploads/imagens/`
- Tamanho max: 5MB
- Tipos: JPG, PNG, GIF

## 9. Como Instalar

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar .env

Copiar `.env.example` para `.env` e preencher.

### 3. Criar base de dados

```bash
mysql -u root -p < database/schema.sql
```

### 4. Iniciar servidor

```bash
npm start
```

Ou com auto-reload:
```bash
npm run dev
```

### 5. Testar

Abrir: `http://localhost:3000`

## 10. Problemas Comuns

### Porta 3000 ocupada

Windows:
```bash
netstat -ano | findstr :3000
taskkill //F //PID <numero>
```

Linux/Mac:
```bash
lsof -ti:3000 | xargs kill -9
```

### Erro MySQL

- Verificar se MySQL esta a correr
- Confirmar dados no .env
- Testar: `mysql -u root -p`

### Modulos em falta

```bash
npm install
```

## 11. Backup

Criar backup:
```bash
mysqldump -u root -p gestao_receitas > backup.sql
```

Restaurar:
```bash
mysql -u root -p gestao_receitas < backup.sql
```
