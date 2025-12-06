# Manual Técnico
Sistema de Gestão de Receitas - Projeto PIS 2025/2026

---

## 1. Tecnologias Usadas

**Backend:**
- Node.js (v14+)
- Express.js (v4.18.2)
- MySQL (v5.7+)

**Autenticação:**
- express-session
- bcryptjs (para encriptar passwords)

**Outros:**
- EJS (templates)
- body-parser
- multer (upload de ficheiros)
- axios (para chamar APIs externas)
- dotenv (variáveis de ambiente)

---

## 2. Estrutura do Projeto

```
Projeto/
├── database/
│   ├── schema.sql              # Base de dados
│   └── adicionar_imagens.sql
│
├── public/                     # Ficheiros públicos (CSS, JS, imagens)
│   ├── css/
│   ├── js/
│   └── uploads/
│
├── src/
│   ├── config/
│   │   ├── database.js         # Ligação ao MySQL
│   │   └── multer.js           # Configuração de uploads
│   │
│   ├── middleware/
│   │   └── auth.js             # Verificar se está logado
│   │
│   ├── models/                 # Modelos (ligam ao MySQL)
│   │   ├── Receita.js
│   │   ├── Utilizador.js
│   │   ├── Categoria.js
│   │   └── Ingrediente.js
│   │
│   └── routes/                 # Rotas da aplicação
│       ├── apiRoutes.js
│       ├── authRoutes.js
│       ├── backofficeRoutes.js
│       └── frontofficeRoutes.js
│
├── views/                      # Templates EJS
│   ├── backoffice/
│   ├── frontoffice/
│   └── partials/
│
├── .env                        # Configurações (não meter no git!)
├── package.json
└── server.js                   # Ficheiro principal
```

---

## 3. Base de Dados

### Tabelas

O sistema tem 7 tabelas:

1. **utilizadores** - Dados dos users (admin ou user normal)
2. **receitas** - Informação das receitas
3. **categorias** - Ex: Sopas, Sobremesas, etc.
4. **dificuldades** - Fácil, Médio, Difícil
5. **ingredientes** - Lista de ingredientes
6. **receita_ingredientes** - Liga receitas a ingredientes
7. **avaliacoes** - Classificações (1-5 estrelas)

### Tabela receitas (principal)

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
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Relações:**
- `categoria_id` liga à tabela categorias
- `dificuldade_id` liga à tabela dificuldades
- `utilizador_id` liga à tabela utilizadores

### Configuração da BD

- **Charset:** UTF-8 (utf8mb4_unicode_ci) para aceitar acentos
- **Engine:** InnoDB (suporta foreign keys)

---

## 4. API REST

**URL base:** `http://localhost:3000/api`

### Endpoints de Receitas

**Listar receitas:**
```
GET /api/receitas
```
Pode filtrar com: `?termo=frango&categoria=3`

**Ver receita:**
```
GET /api/receitas/:id
```

**Criar receita:**
```
POST /api/receitas
Body (JSON):
{
  "nome": "...",
  "autor": "...",
  "descricao_preparacao": "...",
  "tempo_preparacao": 30,
  "custo": 10.50,
  "categoria_id": 3,
  "dificuldade_id": 1
}
```
⚠️ Precisa de estar logado!

**Atualizar receita:**
```
PUT /api/receitas/:id
```

**Apagar receita:**
```
DELETE /api/receitas/:id
```

### Outros Endpoints

```
GET /api/categorias      # Listar categorias
GET /api/ingredientes    # Listar ingredientes
```

### API Externa (TheMealDB)

```
GET /api/external/random           # Receita aleatória
GET /api/external/search/:termo    # Pesquisar receitas
```

**Exemplo:**
```
http://localhost:3000/api/external/search/chicken
```

---

## 5. Autenticação

### Como funciona

O sistema usa **sessions** para guardar o login do utilizador.

Quando alguém faz login, os dados ficam guardados na sessão:
```javascript
req.session.utilizador = {
    id: 1,
    nome: "João",
    email: "joao@exemplo.pt",
    tipo: "admin"
};
```

### Middlewares

**isAuthenticated** - Verifica se está logado
```javascript
router.get('/perfil', isAuthenticated, (req, res) => {
    // Só entra se estiver logado
});
```

**isAdmin** - Verifica se é admin
```javascript
router.use('/backoffice', isAdmin);
```

### Passwords

As passwords são encriptadas com **bcrypt** antes de guardar na BD.

```javascript
// Encriptar
const hash = await bcrypt.hash(password, 10);

// Verificar
const valida = await bcrypt.compare(password, hash);
```

### Segurança

✅ Passwords encriptadas
✅ Queries com prepared statements (previne SQL injection)
✅ Sessions com secret key
✅ Validação de dados

---

## 6. Models

Os models fazem a ponte entre o código e a base de dados.

### Model Receita

**Ficheiro:** `src/models/Receita.js`

Principais funções:
- `findAll()` - Listar todas
- `findById(id)` - Buscar por ID
- `search(termo, categoria, dificuldade)` - Pesquisar
- `create(dados)` - Criar nova
- `update(id, dados)` - Atualizar
- `delete(id)` - Apagar
- `getIngredientes(receitaId)` - Ver ingredientes

### Model Utilizador

**Ficheiro:** `src/models/Utilizador.js`

- `findByEmail(email)` - Buscar por email
- `create(dados)` - Criar user (encripta password automaticamente)
- `verificarPassword(password, hash)` - Verificar password

---

## 7. Rotas

### Rotas de Login/Registo

**Ficheiro:** `src/routes/authRoutes.js`

```
GET  /login       # Página de login
POST /login       # Processar login
GET  /registo     # Página de registo
POST /registo     # Criar conta
GET  /logout      # Sair
```

### Rotas Públicas (Frontoffice)

**Ficheiro:** `src/routes/frontofficeRoutes.js`

```
GET /                  # Página inicial
GET /receita/:id       # Ver receita
GET /categoria/:id     # Ver categoria
GET /pesquisa          # Pesquisar
```

### Rotas Admin (Backoffice)

**Ficheiro:** `src/routes/backofficeRoutes.js`

Todas precisam de login de admin!

```
GET  /backoffice                      # Dashboard
GET  /backoffice/receitas             # Listar
GET  /backoffice/receitas/nova        # Criar
POST /backoffice/receitas/nova        # Guardar
GET  /backoffice/receitas/editar/:id  # Editar
POST /backoffice/receitas/editar/:id  # Atualizar
POST /backoffice/receitas/eliminar/:id # Apagar
```

---

## 8. Configuração

### Variáveis de Ambiente (.env)

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=gestao_receitas
DB_PORT=3306

SESSION_SECRET=minha_chave_secreta
```

### Ligação ao MySQL

**Ficheiro:** `src/config/database.js`

Usa um **pool de conexões** para reutilizar ligações ao MySQL:

```javascript
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    charset: 'utf8mb4'
});
```

### Upload de Ficheiros

**Ficheiro:** `src/config/multer.js`

Configuração para upload de imagens:
- Pasta: `public/uploads/receitas/`
- Tamanho máximo: 5MB
- Formatos aceites: JPG, PNG, GIF

---

## 9. Como Instalar

### Passo 1: Instalar dependências

```bash
npm install
```

### Passo 2: Configurar .env

Copiar `.env.example` para `.env` e preencher os dados.

### Passo 3: Criar base de dados

```bash
mysql -u root -p < database/schema.sql
```

### Passo 4: Iniciar servidor

```bash
npm start
```

Para desenvolvimento (auto-reload):
```bash
npm run dev
```

### Passo 5: Testar

Abrir no browser: `http://localhost:3000`

---

## 10. Testar a API

### Com cURL

**Listar receitas:**
```bash
curl http://localhost:3000/api/receitas
```

**Ver receita específica:**
```bash
curl http://localhost:3000/api/receitas/1
```

**Pesquisar:**
```bash
curl http://localhost:3000/api/receitas?termo=frango
```

### Com Postman

Importar os endpoints e testar.

---

## 11. Problemas Comuns

### Porta 3000 já está em uso

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /F /PID <numero_que_apareceu>
```

**Linux/Mac:**
```bash
lsof -ti:3000 | xargs kill -9
```

### Erro ao ligar ao MySQL

- Verificar se o MySQL está a correr
- Confirmar dados no `.env`
- Testar: `mysql -u root -p`

### Módulos em falta

```bash
npm install
```

---

## 12. Backup da Base de Dados

**Criar backup:**
```bash
mysqldump -u root -p gestao_receitas > backup.sql
```

**Restaurar:**
```bash
mysql -u root -p gestao_receitas < backup.sql
```

---

**Projeto PIS 2025/2026 - CTeSP TPSI**
