# 🎓 GUIA: Como Analisar as Camadas de um Código

## 📋 Índice
1. [Introdução](#introdução)
2. [O que são Camadas de Software?](#o-que-são-camadas-de-software)
3. [Metodologia de Análise](#metodologia-de-análise)
4. [Análise do Projeto Gestão de Receitas](#análise-do-projeto-gestão-de-receitas)
5. [Diagramas da Arquitetura](#diagramas-da-arquitetura)
6. [Exercícios Práticos](#exercícios-práticos)

---

## 🎯 Introdução

Este guia ensina-lhe a **analisar e identificar as camadas** de um projeto de software, usando o projeto "Gestão de Receitas" como exemplo prático.

### Objetivos de Aprendizagem:
- ✅ Identificar camadas arquiteturais em código
- ✅ Reconhecer serviços e suas responsabilidades
- ✅ Criar diagramas de arquitetura
- ✅ Compreender a separação de responsabilidades

---

## 🏗️ O que são Camadas de Software?

### Definição
**Camadas** (layers) são divisões lógicas do código que separam responsabilidades diferentes. Cada camada tem um propósito específico e comunica com outras camadas de forma organizada.

### Vantagens da Arquitetura em Camadas:
1. **Organização**: Código mais fácil de encontrar e entender
2. **Manutenção**: Mudanças numa camada não afetam outras
3. **Reutilização**: Código pode ser reaproveitado
4. **Testabilidade**: Cada camada pode ser testada separadamente

### Camadas Típicas em Aplicações Web:

```
┌─────────────────────────────────────┐
│   CAMADA DE APRESENTAÇÃO (Views)    │  ← O que o utilizador vê
├─────────────────────────────────────┤
│   CAMADA DE ROTAS (Routes)          │  ← Rotas/Controladores HTTP
├─────────────────────────────────────┤
│   CAMADA DE LÓGICA (Models)         │  ← Regras de negócio
├─────────────────────────────────────┤
│   CAMADA DE DADOS (Database)        │  ← Acesso à base de dados
└─────────────────────────────────────┘
```

---

## 🔍 Metodologia de Análise

### PASSO 1: Explorar a Estrutura de Pastas

**Como fazer:**
```bash
# Listar a estrutura do projeto
ls -R

# Ou usar tree (se disponível)
tree -L 2 -I 'node_modules'
```

**O que procurar:**
- 📁 Pastas com nomes sugestivos: `routes`, `models`, `views`, `controllers`, `services`
- 📄 Ficheiros principais: `server.js`, `app.js`, `index.js`
- ⚙️ Ficheiros de configuração: `package.json`, `.env`

### PASSO 2: Ler o Ficheiro Principal

**Começar pelo ficheiro de entrada** (normalmente `server.js` ou `app.js`)

**O que procurar:**
1. **Imports/Requires**: Ver que módulos são importados
2. **Middlewares**: Funções que processam pedidos
3. **Rotas**: Como os URLs são organizados
4. **Configurações**: Porta, base de dados, etc.

### PASSO 3: Identificar os Serviços

**Serviços** são módulos ou conjuntos de funcionalidades com propósitos específicos.

**Como identificar:**
- Procurar por **pastas de rotas** separadas
- Ver se há **prefixos diferentes** nos URLs
- Identificar **áreas funcionais distintas**

**Exemplo:**
```javascript
app.use('/', authRoutes);               // Serviço de Autenticação
app.use('/backoffice', backofficeRoutes); // Serviço de Administração
app.use('/', frontofficeRoutes);        // Serviço Público
app.use('/api', apiRoutes);             // Serviço API REST
```

### PASSO 4: Mapear as Camadas

**Para cada serviço identificado, mapear:**

| Camada | Ficheiros | Responsabilidade |
|--------|-----------|------------------|
| **Apresentação** | `views/*.ejs` | Templates HTML |
| **Rotas** | `routes/*.js` | Definir endpoints |
| **Lógica** | `models/*.js` | Regras de negócio |
| **Dados** | `config/database.js` | Conexão BD |
| **Middleware** | `middleware/*.js` | Autenticação, validação |

### PASSO 5: Desenhar Diagramas

Criar representações visuais da arquitetura (ver secção abaixo).

---

## 🔬 Análise do Projeto Gestão de Receitas

Vamos aplicar a metodologia ao nosso projeto!

### 1️⃣ Estrutura de Pastas Encontrada

```
Gestao_de_Receitas/
├── server.js              ← Ponto de entrada
├── package.json           ← Dependências
├── database/              ← Scripts SQL
├── src/
│   ├── routes/           ← CAMADA DE ROTAS
│   │   ├── authRoutes.js
│   │   ├── backofficeRoutes.js
│   │   ├── frontofficeRoutes.js
│   │   └── apiRoutes.js
│   ├── models/           ← CAMADA DE LÓGICA
│   │   ├── Receita.js
│   │   ├── Categoria.js
│   │   ├── Ingrediente.js
│   │   └── Utilizador.js
│   ├── middleware/       ← CAMADA DE SEGURANÇA
│   │   ├── auth.js
│   │   └── jwtAuth.js
│   └── config/           ← CAMADA DE CONFIGURAÇÃO
│       ├── database.js
│       └── upload.js
├── views/                ← CAMADA DE APRESENTAÇÃO
│   ├── backoffice/
│   ├── frontoffice/
│   └── partials/
└── public/               ← FICHEIROS ESTÁTICOS
    ├── css/
    ├── js/
    └── uploads/
```

### 2️⃣ Serviços Identificados

#### 🔐 **Serviço 1: Autenticação** (`authRoutes.js`)
- **Propósito**: Gerir login, registo e logout de utilizadores
- **URLs**: `/login`, `/registo`, `/logout`
- **Acesso**: Público (não autenticado)

#### 👨‍💼 **Serviço 2: Backoffice** (`backofficeRoutes.js`)
- **Propósito**: Administração do sistema (área restrita)
- **URLs**: `/backoffice/*`
- **Acesso**: Apenas administradores
- **Funcionalidades**:
  - Gestão de receitas (criar, editar, eliminar)
  - Gestão de categorias
  - Gestão de ingredientes
  - Dashboard com estatísticas

#### 👥 **Serviço 3: Frontoffice** (`frontofficeRoutes.js`)
- **Propósito**: Área pública do site
- **URLs**: `/`, `/receita/:id`, `/categoria/:id`, `/pesquisa`
- **Acesso**: Público
- **Funcionalidades**:
  - Listar receitas
  - Ver detalhes de receitas
  - Filtrar por categoria
  - Pesquisar receitas

#### 🔌 **Serviço 4: API REST** (`apiRoutes.js`)
- **Propósito**: Interface programática (JSON)
- **URLs**: `/api/*`
- **Acesso**: Misto (alguns endpoints públicos, outros com JWT)
- **Funcionalidades**:
  - CRUD de receitas
  - Listar categorias e ingredientes
  - Autenticação JWT
  - Integração com API externa (TheMealDB)

### 3️⃣ Camadas Identificadas

#### 📊 **Camada 1: Apresentação (Views)**
- **Localização**: `views/`
- **Tecnologia**: EJS (templates HTML)
- **Responsabilidade**: Renderizar HTML para o browser

**Exemplo de ficheiros:**
```
views/
├── backoffice/
│   ├── dashboard.ejs
│   ├── receitas/
│   │   ├── lista.ejs
│   │   └── form.ejs
│   ├── categorias/
│   └── ingredientes/
└── frontoffice/
    ├── index.ejs
    ├── receita.ejs
    ├── categoria.ejs
    └── pesquisa.ejs
```

#### 🛣️ **Camada 2: Rotas (Controllers)**
- **Localização**: `src/routes/`
- **Responsabilidade**:
  - Receber pedidos HTTP
  - Validar inputs
  - Chamar models
  - Devolver respostas

**Exemplo (`backofficeRoutes.js:52-66`):**
```javascript
router.get('/receitas', function(req, res) {
    Receita.listarTodasReceitas(function(erro, receitas) {
        if (erro) {
            return res.status(500).send('Erro ao listar receitas');
        }
        res.render('backoffice/receitas/lista', {
            title: 'Gestão de Receitas',
            receitas: receitas
        });
    });
});
```

#### 🧠 **Camada 3: Lógica de Negócio (Models)**
- **Localização**: `src/models/`
- **Responsabilidade**:
  - Definir operações sobre dados
  - Executar queries SQL
  - Aplicar regras de negócio

**Exemplo (`Receita.js:7-22`):**
```javascript
function listarTodasReceitas(callback) {
    const sql = `
        SELECT r.*, c.nome as categoria_nome, d.nivel as dificuldade_nivel
        FROM receitas r
        JOIN categorias c ON r.categoria_id = c.id
        JOIN dificuldades d ON r.dificuldade_id = d.id
        ORDER BY r.data_criacao DESC
    `;

    db.query(sql, function(erro, resultados) {
        if (erro) return callback(erro, null);
        callback(null, resultados);
    });
}
```

#### 💾 **Camada 4: Dados (Database)**
- **Localização**: `src/config/database.js`
- **Responsabilidade**: Conexão com MySQL

#### 🛡️ **Camada 5: Middleware (Segurança)**
- **Localização**: `src/middleware/`
- **Responsabilidade**:
  - Autenticação de sessões (`auth.js`)
  - Autenticação JWT (`jwtAuth.js`)
  - Verificação de permissões

**Exemplo (`auth.js`):**
```javascript
function isAuthenticated(req, res, next) {
    if (req.session.utilizador) {
        return next(); // Utilizador autenticado, continuar
    }
    res.redirect('/login'); // Redirecionar para login
}
```

---

## 📊 Diagramas da Arquitetura

### Diagrama 1: Visão Geral do Sistema

```
                    ┌─────────────────────┐
                    │   UTILIZADORES      │
                    │  (Browser/Cliente)  │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
    ┌───────────────┐  ┌──────────────┐  ┌──────────────┐
    │  FRONTOFFICE  │  │  BACKOFFICE  │  │   API REST   │
    │   (Público)   │  │   (Admin)    │  │    (JSON)    │
    └───────┬───────┘  └──────┬───────┘  └──────┬───────┘
            │                  │                  │
            └──────────────────┼──────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   CAMADA ROTAS      │
                    │  (Controllers)      │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  CAMADA MODELS      │
                    │ (Lógica Negócio)    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  BASE DE DADOS      │
                    │     (MySQL)         │
                    └─────────────────────┘
```

### Diagrama 2: Arquitetura em Camadas Detalhada

```
┌────────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                      │
│  views/backoffice/*.ejs  |  views/frontoffice/*.ejs            │
│  public/css/  |  public/js/                                    │
└────────────────────────────────────────────────────────────────┘
                              ▲
                              │ res.render()
                              │
┌────────────────────────────────────────────────────────────────┐
│                      CAMADA DE ROTAS                           │
│  authRoutes.js  |  backofficeRoutes.js  |  frontofficeRoutes   │
│  apiRoutes.js                                                  │
└────────────────────────────────────────────────────────────────┘
                              ▲
                              │ router.get/post
                              │
┌────────────────────────────────────────────────────────────────┐
│                    CAMADA DE MIDDLEWARE                        │
│  auth.js (isAuthenticated, isAdmin)                           │
│  jwtAuth.js (protegerRotaAPI, verificarAdmin)                 │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Model.método()
┌────────────────────────────────────────────────────────────────┐
│                  CAMADA DE LÓGICA DE NEGÓCIO                   │
│  Receita.js  |  Categoria.js  |  Ingrediente.js               │
│  Utilizador.js                                                 │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼ db.query()
┌────────────────────────────────────────────────────────────────┐
│                     CAMADA DE DADOS                            │
│  database.js (conexão MySQL)                                   │
│  MySQL Database                                                │
└────────────────────────────────────────────────────────────────┘
```

### Diagrama 3: Fluxo de Dados (Exemplo: Listar Receitas)

```
UTILIZADOR                                    SISTEMA
    │
    │  1. GET /backoffice/receitas
    ├──────────────────────────────────────────────────┐
    │                                                   │
    │                              ┌────────────────────▼────────────────┐
    │                              │  ROTA: backofficeRoutes.js          │
    │                              │  router.get('/receitas', ...)       │
    │                              └────────────────────┬────────────────┘
    │                                                   │
    │                              ┌────────────────────▼────────────────┐
    │                              │  MIDDLEWARE: isAuthenticated()      │
    │                              │  Verifica se está logado            │
    │                              └────────────────────┬────────────────┘
    │                                                   │
    │                              ┌────────────────────▼────────────────┐
    │                              │  MIDDLEWARE: isAdmin()              │
    │                              │  Verifica se é administrador        │
    │                              └────────────────────┬────────────────┘
    │                                                   │
    │                              ┌────────────────────▼────────────────┐
    │                              │  MODEL: Receita.listarTodas()       │
    │                              │  Executa query SQL                  │
    │                              └────────────────────┬────────────────┘
    │                                                   │
    │                              ┌────────────────────▼────────────────┐
    │                              │  DATABASE: MySQL                    │
    │                              │  SELECT * FROM receitas ...         │
    │                              └────────────────────┬────────────────┘
    │                                                   │
    │                              ┌────────────────────▼────────────────┐
    │                              │  VIEW: receitas/lista.ejs           │
    │                              │  Renderiza HTML com dados           │
    │                              └────────────────────┬────────────────┘
    │                                                   │
    │  2. HTML Response                                 │
    │◄──────────────────────────────────────────────────┘
    │
```

### Diagrama 4: Diferenças entre os 3 Serviços Principais

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTOFFICE                             │
├─────────────────────────────────────────────────────────────────┤
│ URLs: /, /receita/:id, /categoria/:id, /pesquisa               │
│ Acesso: PÚBLICO (qualquer pessoa)                              │
│ Formato: HTML (páginas web)                                    │
│ Funcionalidade: Consultar e pesquisar receitas                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         BACKOFFICE                              │
├─────────────────────────────────────────────────────────────────┤
│ URLs: /backoffice/*                                            │
│ Acesso: PRIVADO (apenas administradores)                       │
│ Formato: HTML (páginas web)                                    │
│ Funcionalidade: Gerir receitas, categorias, ingredientes       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          API REST                               │
├─────────────────────────────────────────────────────────────────┤
│ URLs: /api/*                                                   │
│ Acesso: MISTO (alguns públicos, outros com JWT)                │
│ Formato: JSON (dados estruturados)                             │
│ Funcionalidade: CRUD programático, integração com outras apps  │
└─────────────────────────────────────────────────────────────────┘
```

### Diagrama 5: Separação de Responsabilidades

```
┌──────────────────────────────────────────────────────────────┐
│                           ROTAS                              │
│                                                              │
│  Responsabilidades:                                          │
│  ✓ Receber pedidos HTTP                                     │
│  ✓ Validar inputs básicos                                   │
│  ✓ Chamar models                                            │
│  ✓ Enviar respostas                                         │
│                                                              │
│  NÃO faz:                                                   │
│  ✗ Queries SQL diretas (usa models)                         │
│  ✗ Lógica de negócio complexa                               │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼ chama
┌──────────────────────────────────────────────────────────────┐
│                          MODELS                              │
│                                                              │
│  Responsabilidades:                                          │
│  ✓ Executar queries SQL                                     │
│  ✓ Aplicar regras de negócio                                │
│  ✓ Validações de dados                                      │
│  ✓ Transformar dados                                        │
│                                                              │
│  NÃO faz:                                                   │
│  ✗ Renderizar HTML                                          │
│  ✗ Processar pedidos HTTP                                   │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼ usa
┌──────────────────────────────────────────────────────────────┐
│                        DATABASE                              │
│                                                              │
│  Responsabilidades:                                          │
│  ✓ Fornecer conexão                                         │
│  ✓ Executar SQL                                             │
│  ✓ Gerir transações                                         │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 Exercícios Práticos

### Exercício 1: Identificar Camadas
**Objetivo**: Dado um ficheiro, identificar a que camada pertence.

**Questões:**
1. O ficheiro `views/frontoffice/index.ejs` pertence a que camada?
   - **Resposta**: Camada de Apresentação

2. O ficheiro `src/models/Categoria.js` pertence a que camada?
   - **Resposta**: Camada de Lógica de Negócio

3. O ficheiro `src/routes/apiRoutes.js` pertence a que camada?
   - **Resposta**: Camada de Rotas (Controllers)

### Exercício 2: Traçar o Fluxo de Dados
**Cenário**: Um utilizador acede a `http://localhost:3000/receita/5`

**Tarefa**: Descrever o caminho que o pedido percorre.

**Resposta:**
1. Browser faz GET /receita/5
2. `server.js` recebe o pedido
3. Router encaminha para `frontofficeRoutes.js`
4. Rota `router.get('/receita/:id')` é executada
5. Chama `Receita.buscarReceitaPorId(5)`
6. Model executa query SQL
7. Chama `Receita.buscarIngredientesReceita(5)`
8. Model executa outra query SQL
9. Rota renderiza `views/frontoffice/receita.ejs`
10. HTML é enviado ao browser

### Exercício 3: Identificar Responsabilidades
**Questão**: O que está **errado** neste código?

```javascript
// Em backofficeRoutes.js
router.get('/receitas', function(req, res) {
    const sql = 'SELECT * FROM receitas';  // ❌ ERRADO!
    db.query(sql, function(erro, receitas) {
        res.render('backoffice/receitas/lista', {
            receitas: receitas
        });
    });
});
```

**Resposta**:
A rota está a fazer uma query SQL diretamente. Isto viola a separação de responsabilidades! A query deveria estar no Model (`Receita.js`), e a rota deveria apenas chamar `Receita.listarTodasReceitas()`.

**Código Correto:**
```javascript
router.get('/receitas', function(req, res) {
    Receita.listarTodasReceitas(function(erro, receitas) {
        if (erro) return res.status(500).send('Erro');
        res.render('backoffice/receitas/lista', {
            receitas: receitas
        });
    });
});
```

### Exercício 4: Criar um Diagrama
**Tarefa**: Desenhar um diagrama que mostre a diferença entre **Backoffice** e **Frontoffice**.

**Dica**: Pensar em:
- Quem pode aceder?
- Que funcionalidades tem?
- Que URLs usa?

*(Veja o Diagrama 4 acima para uma resposta)*

### Exercício 5: Análise de Código Real
**Tarefa**: Abrir o ficheiro `src/routes/apiRoutes.js` e responder:

1. Quantos endpoints (rotas) existem?
2. Quais precisam de autenticação JWT?
3. Qual é o endpoint para pesquisar receitas?
4. Que Model é mais usado neste ficheiro?

**Respostas:**
1. Pelo menos 10 endpoints
2. POST /api/receitas, PUT /api/receitas/:id, DELETE /api/receitas/:id
3. GET /api/receitas?termo=...&categoria=...&dificuldade=...
4. Model `Receita`

---

## 📚 Resumo e Conceitos-Chave

### ✅ Checklist de Análise

Quando analisar um projeto novo, siga estes passos:

- [ ] 1. Explorar a estrutura de pastas
- [ ] 2. Ler o ficheiro principal (server.js)
- [ ] 3. Identificar os serviços (grupos de rotas)
- [ ] 4. Mapear as camadas (views, routes, models, database)
- [ ] 5. Verificar middlewares (autenticação, validação)
- [ ] 6. Desenhar diagramas
- [ ] 7. Traçar fluxos de dados de exemplos

### 🎓 Conceitos Aprendidos

| Conceito | Descrição | Exemplo neste Projeto |
|----------|-----------|----------------------|
| **Serviço** | Módulo funcional independente | Backoffice, Frontoffice, API |
| **Camada** | Separação de responsabilidades | Routes, Models, Views |
| **Rota** | Endpoint HTTP | `GET /backoffice/receitas` |
| **Controller** | Lógica de coordenação | Função dentro de `routes/` |
| **Model** | Lógica de negócio e dados | `Receita.js`, `Categoria.js` |
| **View** | Template de apresentação | `*.ejs` files |
| **Middleware** | Função intermediária | `isAuthenticated`, `isAdmin` |

### 🔑 Princípios SOLID Aplicados

1. **Single Responsibility**: Cada camada tem UMA responsabilidade
   - Routes: processar HTTP
   - Models: lógica de negócio
   - Views: apresentação

2. **Separation of Concerns**: Preocupações separadas
   - SQL está nos Models, não nas Routes
   - HTML está nas Views, não nas Routes

3. **Don't Repeat Yourself (DRY)**: Não repetir código
   - Funções reutilizáveis nos Models
   - Middlewares reutilizáveis

---

## 🚀 Próximos Passos

### Para Praticar Mais:
1. **Analisar outros projetos** open-source no GitHub
2. **Refatorar código** para seguir arquitetura em camadas
3. **Criar diagramas** de projetos que conheça
4. **Implementar novos serviços** seguindo a mesma estrutura

### Recursos Adicionais:
- 📖 Livro: "Clean Architecture" - Robert C. Martin
- 📖 Padrão MVC (Model-View-Controller)
- 📖 REST API Design Best Practices
- 📖 Microservices Architecture

---

## 💡 Dicas Finais

1. **Sempre comece pela estrutura de pastas** - ela conta uma história
2. **Siga o fluxo de dados** - do pedido à resposta
3. **Identifique padrões** - código bem estruturado repete padrões
4. **Use diagramas** - uma imagem vale mais que mil palavras
5. **Questione responsabilidades** - "Este código está no sítio certo?"

---

**📧 Dúvidas?**
Este é um documento vivo. Pode adicionar notas, fazer anotações e adaptá-lo às suas necessidades de aprendizagem!

---

*Documento criado para fins educativos - Projeto Gestão de Receitas PIS 2025/2026*
