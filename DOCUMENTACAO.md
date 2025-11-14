# Sistema de Gestao de Receitas - Documentacao Completa
**Projeto PIS 2025/2026 - CTeSP TPSI**

---

## Indice

1. [Sobre o Projeto](#1-sobre-o-projeto)
2. [Instalacao e Configuracao](#2-instalacao-e-configuracao)
3. [Como Iniciar o Servidor](#3-como-iniciar-o-servidor)
4. [Manual do Utilizador](#4-manual-do-utilizador)
5. [Manual Tecnico](#5-manual-tecnico)
6. [Guia de Apresentacao](#6-guia-de-apresentacao)
7. [Historico de Alteracoes](#7-historico-de-alteracoes)

---

## 1. Sobre o Projeto

Sistema de gestao de receitas desenvolvido para a disciplina de Programacao e Integracao de Servicos (PIS).

### Tecnologias Utilizadas

- **Backend**: Node.js + Express.js
- **Base de Dados**: MySQL
- **Template Engine**: EJS
- **API**: REST (JSON)
- **Autenticacao**: Sessions com bcryptjs

### Funcionalidades

- Gestao de receitas (CRUD completo)
- Sistema de autenticacao (Admin/User)
- Backoffice para administracao
- Frontoffice para visualizacao publica
- API REST completa
- Integracao com API externa (TheMealDB)
- Sistema de categorias e ingredientes
- Niveis de dificuldade
- Avaliacoes e comentarios

### Autores

- Everson Rubira (202301089)
- [Nome Aluno 2]

---

## 2. Instalacao e Configuracao

### Requisitos

- Node.js (versao 14 ou superior)
- MySQL (versao 5.7 ou superior)
- npm (incluido com Node.js)

### Passo 1: Clonar o repositorio

```bash
git clone [URL_DO_REPOSITORIO]
cd Projeto
```

### Passo 2: Instalar dependencias

```bash
npm install
```

### Passo 3: Configurar variaveis de ambiente

Crie um ficheiro `.env` baseado no `.env.example`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=gestao_receitas
DB_PORT=3306

# Sessoes
SESSION_SECRET=change_this_in_production
```

### Passo 4: Criar base de dados

```bash
# Criar estrutura da base de dados
mysql -u root -p < database/schema.sql

# Adicionar imagens as receitas (opcional)
mysql -u root -p < database/adicionar_imagens.sql
```

### Passo 5: Iniciar servidor

```bash
# Modo normal
npm start

# Modo desenvolvimento (com auto-reload)
npm run dev
```

### Passo 6: Aceder ao sistema

- **Frontoffice**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Backoffice**: http://localhost:3000/backoffice
- **API**: http://localhost:3000/api/receitas

### Credenciais padrao

**Admin:**
- Email: admin@receitas.pt
- Password: admin123

**Utilizador normal:**
- Email: joao@exemplo.pt
- Password: password123

---

## 3. Como Iniciar o Servidor

### Metodo correto

**Passo 1: Verificar MySQL**
```bash
mysql -u root -p
# Sair com: exit
```

**Passo 2: Iniciar servidor**
```bash
npm start
```

**Passo 3: Verificar no navegador**
- Abrir: http://localhost:3000

### Resolver erro "EADDRINUSE: address already in use"

**Windows:**
```bash
# 1. Encontrar o PID do processo na porta 3000
netstat -ano | findstr :3000

# 2. Matar o processo (substituir PID pelo numero que apareceu)
taskkill //F //PID [PID]

# OU matar todos os processos Node
taskkill //F //IM node.exe
```

**Linux/Mac:**
```bash
# Encontrar e matar o processo
lsof -ti:3000 | xargs kill -9
```

### Parar o servidor

- Pressionar **Ctrl + C** no terminal

### Verificar se esta a correr

```bash
# Verificar porta
netstat -ano | findstr :3000

# OU aceder no navegador
http://localhost:3000
```

---

## 4. Manual do Utilizador

### 4.1 Acesso ao Sistema

#### Registar nova conta
1. Aceder a http://localhost:3000/registo
2. Preencher:
   - Nome completo
   - Email valido
   - Password (minimo 6 caracteres)
   - Confirmar password
3. Clicar em "Registar"

#### Fazer login
1. Aceder a http://localhost:3000/login
2. Introduzir email e password
3. Clicar em "Entrar"

### 4.2 Frontoffice (Utilizadores)

#### Pagina inicial
- Visualizar receitas recentes
- Explorar categorias
- Utilizar barra de pesquisa

#### Pesquisar receitas
1. Usar campo de pesquisa na pagina inicial
2. Filtrar por:
   - Termo (nome, autor, descricao)
   - Categoria
3. Clicar em "Pesquisar"

#### Ver detalhes da receita
1. Clicar em "Ver Receita"
2. Visualizar:
   - Imagem
   - Informacoes (categoria, dificuldade, tempo, custo)
   - Ingredientes com quantidades
   - Modo de preparacao
   - Avaliacoes

#### Explorar por categoria
1. Clicar numa categoria na pagina inicial
2. Ver todas as receitas dessa categoria

### 4.3 Backoffice (Administradores)

#### Aceder ao backoffice
1. Fazer login com conta admin
2. Aceder a http://localhost:3000/backoffice

#### Gerir receitas
- **Listar**: Ver todas as receitas
- **Criar**: Clicar em "Nova Receita"
- **Editar**: Clicar em "Editar" numa receita
- **Eliminar**: Clicar em "Eliminar"

#### Gerir categorias
1. Menu lateral: "Categorias"
2. Adicionar, editar ou eliminar categorias

#### Gerir ingredientes
1. Menu lateral: "Ingredientes"
2. Adicionar, editar ou eliminar ingredientes

---

## 5. Manual Tecnico

### 5.1 Estrutura do Projeto

```
Projeto/
├── database/
│   ├── schema.sql                  # Estrutura da BD
│   └── adicionar_imagens.sql       # Script de imagens
├── public/
│   ├── css/
│   │   ├── style.css              # Estilos frontoffice
│   │   └── backoffice.css         # Estilos backoffice
│   ├── js/
│   │   └── main.js                # JavaScript cliente
│   └── images/                    # Imagens estaticas
├── src/
│   ├── config/
│   │   └── database.js            # Configuracao MySQL
│   ├── middleware/
│   │   └── auth.js                # Middleware autenticacao
│   ├── models/
│   │   ├── Receita.js             # Model Receitas
│   │   ├── Utilizador.js          # Model Utilizadores
│   │   ├── Categoria.js           # Model Categorias
│   │   └── Ingrediente.js         # Model Ingredientes
│   └── routes/
│       ├── apiRoutes.js           # Rotas API REST
│       ├── authRoutes.js          # Rotas autenticacao
│       ├── backofficeRoutes.js    # Rotas backoffice
│       └── frontofficeRoutes.js   # Rotas frontoffice
├── views/
│   ├── backoffice/                # Views administracao
│   ├── frontoffice/               # Views publicas
│   └── partials/                  # Componentes reutilizaveis
├── .env                           # Configuracoes (nao versionar!)
├── package.json
└── server.js                      # Servidor principal
```

### 5.2 Base de Dados

#### Tabelas principais

1. **utilizadores** - Gestao de users (admin/user)
2. **receitas** - Informacao das receitas
3. **categorias** - Ex: Sopas, Sobremesas
4. **dificuldades** - Facil, Medio, Dificil
5. **ingredientes** - Lista de ingredientes
6. **receita_ingredientes** - Relacao N:N
7. **avaliacoes** - Classificacoes 1-5 estrelas

#### Caracteristicas
- **Charset**: UTF-8 (utf8mb4_unicode_ci)
- **Foreign Keys**: Integridade referencial
- **Indices**: Otimizacao de queries
- **Timestamps**: Auditoria de alteracoes

### 5.3 API REST

#### Endpoints Receitas

**Listar todas as receitas**
```
GET /api/receitas
Query params: termo, categoria, dificuldade
```

**Obter receita por ID**
```
GET /api/receitas/:id
```

**Criar receita**
```
POST /api/receitas
Body: { nome, autor, descricao_preparacao, tempo_preparacao, custo, porcoes, categoria_id, dificuldade_id, ingredientes }
```

**Atualizar receita**
```
PUT /api/receitas/:id
Body: campos a atualizar
```

**Eliminar receita**
```
DELETE /api/receitas/:id
```

#### Endpoints Categorias

```
GET /api/categorias           # Listar todas
GET /api/categorias/:id       # Obter por ID
POST /api/categorias          # Criar
PUT /api/categorias/:id       # Atualizar
DELETE /api/categorias/:id    # Eliminar
```

#### Endpoints Ingredientes

```
GET /api/ingredientes         # Listar todos
GET /api/ingredientes/:id     # Obter por ID
POST /api/ingredientes        # Criar
PUT /api/ingredientes/:id     # Atualizar
DELETE /api/ingredientes/:id  # Eliminar
```

#### Integracao Externa

**TheMealDB - Pesquisar receitas externas**
```
GET /api/externo/pesquisar?termo=chicken
```

**Obter receita externa por ID**
```
GET /api/externo/receita/:id
```

### 5.4 Autenticacao

#### Middleware disponivel

**isAuthenticated** - Verifica se user esta logado
```javascript
router.get('/perfil', isAuthenticated, (req, res) => {
  // Codigo protegido
});
```

**isAdmin** - Verifica se user e admin
```javascript
router.get('/backoffice', isAdmin, (req, res) => {
  // So admins podem aceder
});
```

**redirectIfAuthenticated** - Redireciona se ja logado
```javascript
router.get('/login', redirectIfAuthenticated, (req, res) => {
  // Mostra login so se nao estiver logado
});
```

### 5.5 Seguranca

**Implementado:**
- Passwords hasheadas com bcryptjs
- Prepared statements (protecao SQL injection)
- Sessions seguras
- Validacao de dados
- UTF-8 encoding

**Sugestoes futuras:**
- CSRF protection
- Rate limiting
- Helmet.js (security headers)
- Input sanitization

---

## 6. Guia de Apresentacao

### Roteiro Sugerido (15-20 min)

#### 1. Introducao (2 min)
- Apresentar o projeto
- Mencionar tecnologias utilizadas
- Mostrar estrutura de pastas (arquitetura MVC)

#### 2. Base de Dados (3 min)
- Abrir `database/schema.sql`
- Explicar as 7 tabelas principais
- Destacar: UTF-8, foreign keys, dados de exemplo

#### 3. Servidor (5 min)
- Abrir `server.js`
- Explicar:
  - Importacoes (linha 1-13)
  - Configuracao de sessoes (linha 84-92)
  - Rotas (linha 102-124)
  - Iniciar servidor (linha 154-158)

#### 4. Autenticacao (3 min)
- Abrir `src/middleware/auth.js`
- Explicar as 3 funcoes:
  - `isAuthenticated` - Verifica se esta logado
  - `isAdmin` - Verifica se e admin
  - `redirectIfAuthenticated` - Redireciona se ja logado

#### 5. Model Receita (4 min)
- Abrir `src/models/Receita.js`
- Explicar metodos:
  - `findAll` - Listar receitas
  - `findById` - Buscar por ID
  - `create` - Criar receita
  - `delete` - Eliminar receita

#### 6. API REST (5 min)
- Abrir `src/routes/apiRoutes.js`
- Demonstrar endpoints
- Mostrar integracao com TheMealDB

#### 7. Demonstracao Pratica (10 min)
1. Iniciar servidor: `npm start`
2. Mostrar frontoffice
3. Fazer login como admin
4. Mostrar backoffice
5. Criar/editar uma receita
6. Testar API no browser ou Postman

### URLs Importantes

- Frontoffice: http://localhost:3000
- Login: http://localhost:3000/login
- Backoffice: http://localhost:3000/backoffice
- API: http://localhost:3000/api/receitas

### Checklist Pre-Apresentacao

- [ ] MySQL a correr
- [ ] Base de dados criada
- [ ] Dependencias instaladas
- [ ] .env configurado
- [ ] Porta 3000 livre
- [ ] Servidor inicia sem erros
- [ ] Login funciona
- [ ] Imagens aparecem nas receitas

### Possiveis Perguntas

**P: Porque usaram sessions e nao JWT?**
R: Sessions sao mais simples para este projeto. JWT seria melhor para APIs stateless ou mobile apps.

**P: Como protegem contra SQL injection?**
R: Usamos prepared statements (placeholders `?`) em todas as queries.

**P: Como funciona o pool de conexoes?**
R: O pool reutiliza conexoes ao inves de abrir/fechar em cada pedido, melhorando a performance.

**P: Porque UTF-8?**
R: Para suportar acentuacao portuguesa e caracteres especiais.

---

## 7. Historico de Alteracoes

### Versao 1.2 - 14 Janeiro 2025

#### Imagens adicionadas
- Criado `database/adicionar_imagens.sql`
- URLs gratuitas do Unsplash para 4 receitas:
  - Arroz de Tomate
  - Frango Assado com Batatas
  - Mousse de Chocolate
  - Sopa de Legumes

#### Comentarios adicionados
Ficheiros comentados com estilo junior/didatico:
- `server.js` - Servidor principal
- `src/models/Receita.js` - Model de receitas
- `src/middleware/auth.js` - Autenticacao
- `src/config/database.js` - Configuracao MySQL
- `src/routes/apiRoutes.js` - API REST

#### Documentacao criada
- README.md
- MANUAL_TECNICO.md
- MANUAL_UTILIZADOR.md
- GUIA_APRESENTACAO.md
- ALTERACOES_FEITAS.md
- COMO_INICIAR_SERVIDOR.md

#### Correcoes
- Configuracao UTF-8 melhorada
- TypeCast adicionado para campos de texto
- Imagem da sobremesa substituida

### Versao 1.1 - Janeiro 2025

#### Funcionalidades iniciais
- Sistema de autenticacao completo
- CRUD de receitas
- Gestao de categorias e ingredientes
- API REST funcional
- Integracao TheMealDB
- Backoffice e frontoffice

### Versao 1.0 - Dezembro 2024

- Commit inicial
- Estrutura basica do projeto
- Base de dados criada

---

## Suporte e Contacto

Para questoes ou problemas:
1. Verificar esta documentacao
2. Consultar os comentarios no codigo
3. Contactar os autores do projeto

---

**Projeto PIS 2025/2026 - CTeSP TPSI**
**Sistema de Gestao de Receitas**
