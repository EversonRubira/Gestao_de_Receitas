# 🎓 Tutorial Prático: Analisando Código Passo a Passo

## 📖 Como Usar Este Tutorial

Este é um guia **passo a passo** que você pode seguir para aprender a analisar qualquer projeto de código. Vamos usar o projeto "Gestão de Receitas" como exemplo, mas os mesmos passos aplicam-se a qualquer projeto.

---

## 🚀 PARTE 1: Começando a Análise

### Passo 1: Abrir o Projeto

```bash
# Entre na pasta do projeto
cd Gestao_de_Receitas

# Liste todos os ficheiros
ls -la
```

**O que você vê?** Deve ver algo como:
```
server.js          ← Ficheiro principal
package.json       ← Dependências do projeto
.env.example       ← Configurações
src/               ← Código-fonte
views/             ← Templates HTML
public/            ← CSS, JS, imagens
database/          ← Scripts SQL
```

**🤔 Pergunta para si mesmo:**
> "Qual é o ficheiro que inicia tudo?"

**✅ Resposta:** Normalmente é `server.js`, `app.js`, ou `index.js`. No nosso caso é `server.js`.

---

### Passo 2: Olhar para o package.json

```bash
cat package.json
```

**O que procurar:**

1. **Nome do projeto**:
   ```json
   "name": "gestao-receitas"
   ```

2. **Ponto de entrada**:
   ```json
   "main": "server.js"
   ```

3. **Dependências importantes**:
   ```json
   "dependencies": {
       "express": "^4.18.2",        ← Framework web
       "mysql2": "^3.6.5",          ← Base de dados
       "ejs": "^3.1.9",             ← Motor de templates
       "express-session": "^1.17.3", ← Sessões
       "jsonwebtoken": "^9.0.3"     ← JWT para API
   }
   ```

**💡 O que isto me diz?**
- É uma aplicação **Node.js com Express**
- Usa **MySQL** como base de dados
- Tem **templates EJS** (logo há páginas HTML dinâmicas)
- Tem **sessões** (para login)
- Tem **JWT** (para API)

**🎯 Conclusão Inicial:**
Este é um projeto web **full-stack** com:
- Frontend (templates EJS)
- Backend (Node.js/Express)
- Base de dados (MySQL)
- API REST (JWT)

---

### Passo 3: Explorar a Estrutura de Pastas

```bash
# Ver a estrutura em árvore
tree -L 2 -I 'node_modules'
```

**Estrutura encontrada:**
```
.
├── server.js              ← ENTRADA
├── src/
│   ├── routes/           ← ROTAS (URLs)
│   ├── models/           ← LÓGICA (Negócio)
│   ├── middleware/       ← SEGURANÇA
│   └── config/           ← CONFIGURAÇÕES
├── views/                ← TEMPLATES (HTML)
│   ├── backoffice/
│   └── frontoffice/
├── public/               ← ESTÁTICOS (CSS/JS)
└── database/             ← SCRIPTS SQL
```

**🔍 Análise da Estrutura:**

| Pasta | Camada | Responsabilidade |
|-------|--------|------------------|
| `views/` | **Apresentação** | O que o utilizador vê |
| `src/routes/` | **Controlo** | Como processar pedidos |
| `src/models/` | **Lógica** | Regras de negócio |
| `src/config/` | **Dados** | Conexão à BD |
| `src/middleware/` | **Segurança** | Autenticação |

**✅ Padrão Identificado:** Arquitetura em **Camadas** (Layered Architecture)

---

## 🔬 PARTE 2: Analisando o Ficheiro Principal

### Passo 4: Ler o server.js

```bash
cat server.js
```

**Vamos analisar secção por secção:**

#### 📦 Secção 1: Imports (linhas 1-11)
```javascript
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
// ...
```

**O que isto significa?**
- O projeto **importa módulos** externos
- Cada módulo tem uma função específica

**💡 Dica:** Os nomes dos módulos dizem o que fazem:
- `express` = framework web
- `session` = gerir sessões
- `body-parser` = processar formulários

---

#### ⚙️ Secção 2: Middlewares (linhas 26-57)
```javascript
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ ... }));
```

**O que são Middlewares?**
> **Middleware** = "Funções que processam pedidos antes de chegarem às rotas"

**Pense assim:**
```
Pedido HTTP → Middleware 1 → Middleware 2 → Rota → Resposta
```

**Analogia:** É como passar por segurança no aeroporto antes de entrar no avião.

**Middlewares encontrados:**
1. `body-parser` = Lê dados de formulários
2. `fileUpload` = Permite enviar ficheiros
3. `express.static` = Serve ficheiros CSS/JS
4. `session` = Guarda informação do utilizador

---

#### 🛣️ Secção 3: Rotas (linhas 59-70)
```javascript
const authRoutes = require('./src/routes/authRoutes');
const backofficeRoutes = require('./src/routes/backofficeRoutes');
const frontofficeRoutes = require('./src/routes/frontofficeRoutes');
const apiRoutes = require('./src/routes/apiRoutes');

app.use('/', authRoutes);
app.use('/backoffice', backofficeRoutes);
app.use('/', frontofficeRoutes);
app.use('/api', apiRoutes);
```

**🎯 AQUI ESTÃO OS SERVIÇOS!**

Esta é a parte **mais importante** para identificar os serviços:

| Código | Serviço | Prefixo URL | Descrição |
|--------|---------|-------------|-----------|
| `authRoutes` | **Autenticação** | `/` | Login/Registo |
| `backofficeRoutes` | **Backoffice** | `/backoffice` | Administração |
| `frontofficeRoutes` | **Frontoffice** | `/` | Área pública |
| `apiRoutes` | **API REST** | `/api` | API JSON |

**🔍 Como identificar serviços:**
1. Procure por `app.use()`
2. Veja o **prefixo** (primeiro parâmetro)
3. Veja o **nome do ficheiro** de rotas

**Exemplo prático:**
```javascript
app.use('/backoffice', backofficeRoutes);
//       ↑            ↑
//       Prefixo      Ficheiro de rotas
//
// Significa: Todos os URLs que começam com /backoffice
// vão para o ficheiro backofficeRoutes.js
```

---

## 🕵️ PARTE 3: Investigando Cada Serviço

### Passo 5: Analisar o Serviço Backoffice

```bash
cat src/routes/backofficeRoutes.js | head -50
```

**O que procurar:**

#### 1️⃣ **Imports** (início do ficheiro)
```javascript
const Receita = require('../models/Receita');
const Categoria = require('../models/Categoria');
const Ingrediente = require('../models/Ingrediente');
```

**Isto diz-me:**
- Este serviço **usa os Models** (camada de lógica)
- Gere **Receitas, Categorias e Ingredientes**

---

#### 2️⃣ **Proteção de Rotas**
```javascript
router.use(isAuthenticated);
router.use(isAdmin);
```

**Isto significa:**
- **TODAS** as rotas do backoffice exigem:
  1. Estar autenticado (ter feito login)
  2. Ser administrador

**💡 Isto faz sentido!** O backoffice é a área de administração.

---

#### 3️⃣ **Rotas Definidas**
```javascript
router.get('/', function(req, res) { ... });
router.get('/receitas', function(req, res) { ... });
router.get('/receitas/nova', function(req, res) { ... });
router.post('/receitas/nova', function(req, res) { ... });
```

**Tabela de Rotas do Backoffice:**

| Método | URL | Descrição |
|--------|-----|-----------|
| GET | `/backoffice/` | Dashboard |
| GET | `/backoffice/receitas` | Listar receitas |
| GET | `/backoffice/receitas/nova` | Formulário nova receita |
| POST | `/backoffice/receitas/nova` | Criar receita |
| GET | `/backoffice/receitas/editar/:id` | Formulário editar |
| POST | `/backoffice/receitas/editar/:id` | Atualizar receita |
| POST | `/backoffice/receitas/eliminar/:id` | Eliminar receita |
| GET | `/backoffice/categorias` | Gerir categorias |
| GET | `/backoffice/ingredientes` | Gerir ingredientes |

**🎯 Conclusão:**
O **Backoffice** é um **CRUD completo**:
- **C**reate (criar)
- **R**ead (ler)
- **U**pdate (atualizar)
- **D**elete (eliminar)

---

### Passo 6: Analisar o Serviço Frontoffice

```bash
cat src/routes/frontofficeRoutes.js
```

**Rotas encontradas:**

| Método | URL | Descrição |
|--------|-----|-----------|
| GET | `/` | Página inicial |
| GET | `/receita/:id` | Ver detalhes de uma receita |
| GET | `/categoria/:id` | Receitas de uma categoria |
| GET | `/pesquisa` | Pesquisar receitas |

**🎯 Diferença para o Backoffice:**
- **Não tem** POST/PUT/DELETE (não cria/edita/elimina)
- **Apenas leitura** (consulta)
- **Não precisa de login** (público)

**💡 Isto faz sentido!** O frontoffice é para visitantes verem receitas.

---

### Passo 7: Analisar o Serviço API

```bash
cat src/routes/apiRoutes.js | head -100
```

**Características da API:**

1. **Retorna JSON** (não HTML):
   ```javascript
   res.json({ success: true, data: receitas });
   ```

2. **Usa JWT** (não sessões):
   ```javascript
   router.post('/receitas', protegerRotaAPI, function(req, res) { ... });
   ```

3. **Endpoints REST**:
   - GET `/api/receitas` = Listar
   - GET `/api/receitas/:id` = Ver uma
   - POST `/api/receitas` = Criar
   - PUT `/api/receitas/:id` = Atualizar
   - DELETE `/api/receitas/:id` = Eliminar

**🔍 Comparação: Frontoffice vs Backoffice vs API**

| Aspeto | Frontoffice | Backoffice | API |
|--------|-------------|------------|-----|
| **Acesso** | Público | Admin | Misto |
| **Formato** | HTML | HTML | JSON |
| **Auth** | Não | Sessão | JWT |
| **Operações** | Ler | CRUD | CRUD |
| **Para quem** | Visitantes | Admins | Programadores |

---

## 🧠 PARTE 4: Entendendo a Camada de Lógica (Models)

### Passo 8: Analisar um Model

```bash
cat src/models/Receita.js | head -60
```

**Estrutura de um Model:**

```javascript
// 1. Importar conexão BD
const db = require('../config/database');

// 2. Funções que fazem queries
function listarTodasReceitas(callback) {
    const sql = `SELECT ... FROM receitas`;
    db.query(sql, function(erro, resultados) {
        callback(null, resultados);
    });
}

function criarReceita(dados, callback) {
    const sql = `INSERT INTO receitas VALUES (...)`;
    db.query(sql, valores, function(erro, resultado) {
        callback(null, resultado.insertId);
    });
}

// 3. Exportar funções
module.exports = {
    listarTodasReceitas: listarTodasReceitas,
    criarReceita: criarReceita,
    // ...
};
```

**🎯 Responsabilidade do Model:**
1. ✅ Fazer queries SQL
2. ✅ Validar dados
3. ✅ Aplicar regras de negócio
4. ❌ NÃO processa HTTP
5. ❌ NÃO renderiza HTML

**💡 Princípio da Separação:**
- **Rotas** = HTTP (receber/enviar)
- **Models** = Lógica (processar/gravar)

---

## 📊 PARTE 5: Criando o Seu Próprio Diagrama

### Passo 9: Desenhar à Mão

**Exercício Prático:**

1. Pegue numa folha de papel
2. Desenhe 3 colunas:
   - **Camada 1**: Apresentação
   - **Camada 2**: Rotas
   - **Camada 3**: Models
   - **Camada 4**: Base de Dados

3. Para cada ficheiro que encontrou, coloque-o na coluna certa

**Exemplo:**
```
┌─────────────┬─────────────────┬──────────────┬─────────────┐
│ Views       │ Routes          │ Models       │ Database    │
├─────────────┼─────────────────┼──────────────┼─────────────┤
│ index.ejs   │ frontoffice     │ Receita.js   │ database.js │
│ dashboard   │ .js             │ Categoria.js │             │
│ .ejs        │                 │ Ingrediente  │ MySQL       │
│             │ backoffice      │ .js          │             │
│ receita     │ Routes.js       │ Utilizador   │             │
│ .ejs        │                 │ .js          │             │
│             │ apiRoutes.js    │              │             │
│             │                 │              │             │
│             │ authRoutes.js   │              │             │
└─────────────┴─────────────────┴──────────────┴─────────────┘
```

---

### Passo 10: Traçar o Fluxo de Dados

**Exercício:** Quando o utilizador acede `/backoffice/receitas`, o que acontece?

**Resposta passo a passo:**

```
1. Browser
   ↓ GET /backoffice/receitas
2. server.js recebe o pedido
   ↓
3. Routing: vê que /backoffice → backofficeRoutes.js
   ↓
4. Middleware: isAuthenticated()
   ↓ (verifica se está logado)
5. Middleware: isAdmin()
   ↓ (verifica se é admin)
6. Rota: router.get('/receitas', ...)
   ↓
7. Chama: Receita.listarTodasReceitas()
   ↓
8. Model executa: SELECT * FROM receitas
   ↓
9. MySQL retorna os dados
   ↓
10. Model retorna para Rota
    ↓
11. Rota renderiza: views/backoffice/receitas/lista.ejs
    ↓
12. HTML é enviado ao Browser
    ↓
13. Utilizador vê a página
```

**💡 Agora você consegue traçar o caminho de QUALQUER pedido!**

---

## 🎓 PARTE 6: Exercícios para Consolidar

### Exercício 1: Identificar Camadas

**Para cada ficheiro, diga a que camada pertence:**

1. `views/frontoffice/index.ejs` → ?
2. `src/routes/authRoutes.js` → ?
3. `src/models/Categoria.js` → ?
4. `src/config/database.js` → ?
5. `public/css/style.css` → ?

<details>
<summary>Ver respostas</summary>

1. **Camada de Apresentação**
2. **Camada de Rotas/Controllers**
3. **Camada de Lógica de Negócio**
4. **Camada de Acesso a Dados**
5. **Camada de Apresentação** (ficheiros estáticos)

</details>

---

### Exercício 2: Corrigir Código Errado

**O que está errado neste código de rota?**

```javascript
router.get('/receitas', function(req, res) {
    // ❌ Query SQL diretamente na rota!
    const sql = 'SELECT * FROM receitas';
    db.query(sql, function(erro, receitas) {
        res.render('lista', { receitas: receitas });
    });
});
```

**Resposta:**
<details>
<summary>Ver solução</summary>

**Problema:** A rota está a fazer SQL diretamente. Viola a separação de responsabilidades!

**Correção:**
```javascript
router.get('/receitas', function(req, res) {
    // ✅ Usa o Model
    Receita.listarTodasReceitas(function(erro, receitas) {
        if (erro) {
            return res.status(500).send('Erro');
        }
        res.render('lista', { receitas: receitas });
    });
});
```

</details>

---

### Exercício 3: Criar um Novo Endpoint

**Tarefa:** Adicionar um endpoint para listar receitas por dificuldade.

**Passos:**
1. Identificar que ficheiro editar
2. Escrever a rota
3. Escrever a função no Model

<details>
<summary>Ver solução</summary>

**1. Ficheiro:** `src/routes/frontofficeRoutes.js`

**2. Adicionar rota:**
```javascript
router.get('/dificuldade/:id', function(req, res) {
    const dificuldadeId = req.params.id;

    Receita.buscarPorDificuldade(dificuldadeId, function(erro, receitas) {
        if (erro) {
            return res.status(500).send('Erro');
        }

        res.render('frontoffice/dificuldade', {
            title: 'Receitas por Dificuldade',
            receitas: receitas
        });
    });
});
```

**3. Ficheiro Model:** `src/models/Receita.js`

```javascript
function buscarPorDificuldade(dificuldadeId, callback) {
    const sql = `
        SELECT r.*, c.nome as categoria_nome, d.nivel as dificuldade_nivel
        FROM receitas r
        JOIN categorias c ON r.categoria_id = c.id
        JOIN dificuldades d ON r.dificuldade_id = d.id
        WHERE r.dificuldade_id = ?
        ORDER BY r.data_criacao DESC
    `;

    db.query(sql, [dificuldadeId], function(erro, resultados) {
        if (erro) return callback(erro, null);
        callback(null, resultados);
    });
}

// Não esquecer de exportar!
module.exports = {
    // ... outras funções
    buscarPorDificuldade: buscarPorDificuldade
};
```

</details>

---

## 📝 PARTE 7: Checklist de Análise

Use esta checklist quando analisar um projeto novo:

```markdown
## Análise de Projeto

### 1. Informação Geral
- [ ] Nome do projeto: _____________
- [ ] Linguagem/Framework: _____________
- [ ] Tipo (Web/Mobile/API/Desktop): _____________

### 2. Estrutura
- [ ] Ficheiro de entrada identificado: _____________
- [ ] Pastas principais mapeadas:
  - [ ] Views/Templates: _____________
  - [ ] Routes/Controllers: _____________
  - [ ] Models/Services: _____________
  - [ ] Config: _____________

### 3. Dependências
- [ ] Framework web: _____________
- [ ] Base de dados: _____________
- [ ] Autenticação: _____________
- [ ] Outras: _____________

### 4. Serviços Identificados
- [ ] Serviço 1: _____________ (URLs: ______)
- [ ] Serviço 2: _____________ (URLs: ______)
- [ ] Serviço 3: _____________ (URLs: ______)

### 5. Camadas
- [ ] Camada de Apresentação: _____________
- [ ] Camada de Rotas: _____________
- [ ] Camada de Lógica: _____________
- [ ] Camada de Dados: _____________
- [ ] Camada de Middleware: _____________

### 6. Padrões Arquiteturais
- [ ] MVC
- [ ] Layered Architecture
- [ ] REST API
- [ ] Microservices
- [ ] Outro: _____________

### 7. Segurança
- [ ] Método de autenticação: _____________
- [ ] Autorização: _____________
- [ ] Proteção de rotas: _____________

### 8. Diagrama
- [ ] Diagrama de camadas desenhado
- [ ] Fluxo de dados documentado
- [ ] Relações entre componentes mapeadas
```

---

## 🎯 Resumo: Os 10 Passos da Análise

1. **Abrir o projeto** e ver ficheiros principais
2. **Ler package.json** para entender tecnologias
3. **Explorar estrutura de pastas** para identificar camadas
4. **Ler ficheiro principal** (server.js) para ver configuração
5. **Identificar serviços** pelas rotas (app.use)
6. **Analisar cada serviço** (ler ficheiros de rotas)
7. **Entender Models** (lógica de negócio)
8. **Mapear camadas** (apresentação, rotas, lógica, dados)
9. **Desenhar diagramas** visuais
10. **Traçar fluxos de dados** de exemplos práticos

---

## 💪 Próximos Passos

Agora que domina a análise de código:

1. **Pratique com outros projetos:**
   - Procure projetos no GitHub
   - Analise usando os 10 passos
   - Desenhe diagramas

2. **Aprofunde conceitos:**
   - Estude padrões de design
   - Aprenda sobre Clean Architecture
   - Leia sobre SOLID principles

3. **Aplique ao seu código:**
   - Organize projetos em camadas
   - Separe responsabilidades
   - Documente a arquitetura

---

## 🤝 Dicas Finais

✅ **FAÇA:**
- Comece sempre pelo ficheiro principal
- Siga o fluxo de dados
- Desenhe diagramas à mão primeiro
- Faça perguntas: "Para que serve isto?"
- Procure padrões repetidos

❌ **NÃO FAÇA:**
- Tentar entender tudo de uma vez
- Ignorar a estrutura de pastas
- Pular a leitura do package.json
- Decorar código sem entender

---

**🎉 Parabéns!**

Agora você sabe como analisar as camadas e serviços de qualquer projeto de código!

Continue praticando e boa sorte na sua jornada de programação! 🚀

---

*Tutorial criado para o projeto Gestão de Receitas - PIS 2025/2026*
