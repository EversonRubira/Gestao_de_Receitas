# Manual Tecnico

Sistema de Gestao de Receitas - Projeto PIS 2025/2026

## 1. Tecnologias

**Backend:**
- Node.js (v14+)
- Express.js (v4.18.2)
- MySQL (v5.7+)

**Autenticacao:**
- express-session
- bcryptjs

**Outros:**
- EJS (templates)
- body-parser
- express-fileupload (upload de ficheiros)
- axios (APIs externas)
- dotenv (variaveis de ambiente)

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

Sistema usa dois metodos:

### Sessions (Web e Backoffice)

Para utilizadores que navegam no browser.

Quando o user faz login:
```javascript
req.session.utilizador = {
    id: 1,
    nome: "Joao",
    email: "joao@exemplo.pt",
    tipo: "admin"
};
```

### Middlewares

**isAuthenticated** - Verifica se esta logado
```javascript
router.get('/perfil', isAuthenticated, function(req, res) {
    // codigo
});
```

**isAdmin** - Verifica se e admin
```javascript
router.use('/backoffice', isAdmin);
```

### JWT (API)

Para pedidos a API REST.

**protegerRotaAPI** - Verifica token JWT
```javascript
router.post('/api/receitas', protegerRotaAPI, function(req, res) {
    // req.utilizador tem os dados do token
});
```

**Como usar:**
1. Fazer login: POST /api/auth/login
2. Guardar o token recebido
3. Enviar em cada pedido: `Authorization: Bearer TOKEN`

**Exemplo:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expira em 24 horas.

Ver ficheiro TESTE_API_JWT.md para mais detalhes.

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
SESSION_SECRET=chave_secreta
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
- Pasta: `public/uploads/receitas/`
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
