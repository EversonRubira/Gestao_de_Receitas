# 📚 LEIA-ME PRIMEIRO - Guia de Análise de Camadas

## 🎯 O Que Foi Criado Para Você

Criei **3 documentos educativos** completos para ajudá-lo a aprender como analisar as camadas de código:

### 📖 Documentos Criados:

1. **GUIA_ANALISE_CAMADAS.md** - Guia teórico completo
   - O que são camadas de software
   - Metodologia de análise passo a passo
   - Análise detalhada do projeto Gestão de Receitas
   - Diagramas ASCII da arquitetura
   - Exercícios práticos com respostas

2. **DIAGRAMAS_ARQUITETURA.md** - Diagramas visuais
   - 10 diagramas Mermaid profissionais
   - Arquitetura geral do sistema
   - Fluxos de dados
   - Modelo de dados (Entity Relationship)
   - Comparação entre serviços

3. **TUTORIAL_PRATICO_ANALISE.md** - Tutorial hands-on
   - Passo a passo prático
   - Comandos para executar
   - Exercícios com soluções
   - Checklist de análise
   - Dicas e boas práticas

---

## 🚀 Como Começar?

### Opção 1: Aprendizagem Rápida (30 minutos)
```
1. Ler: LEIA-ME_PRIMEIRO.md (este ficheiro) ✓
2. Ver: DIAGRAMAS_ARQUITETURA.md
3. Ler: Secção "Resumo" do GUIA_ANALISE_CAMADAS.md
```

### Opção 2: Aprendizagem Completa (2-3 horas)
```
1. Ler: LEIA-ME_PRIMEIRO.md (este ficheiro) ✓
2. Ler: GUIA_ANALISE_CAMADAS.md (do início ao fim)
3. Ler: TUTORIAL_PRATICO_ANALISE.md (fazer os exercícios)
4. Ver: DIAGRAMAS_ARQUITETURA.md
5. Praticar: Analisar outro projeto
```

### Opção 3: Consulta Rápida
```
Use os documentos como referência quando precisar:
- Esquecer como identificar camadas? → GUIA_ANALISE_CAMADAS.md
- Precisar de um diagrama? → DIAGRAMAS_ARQUITETURA.md
- Analisar projeto novo? → TUTORIAL_PRATICO_ANALISE.md (checklist)
```

---

## 🎓 O Que Você Vai Aprender

### Sobre Este Projeto Especificamente:

#### ✅ Os 2 Serviços Principais (você mencionou):
1. **BACKOFFICE** (`/backoffice/*`)
   - Área de administração
   - Acesso restrito a administradores
   - CRUD completo de receitas, categorias e ingredientes
   - Ficheiro: `src/routes/backofficeRoutes.js`

2. **FRONTOFFICE** (`/`)
   - Área pública
   - Qualquer pessoa pode aceder
   - Consulta e pesquisa de receitas
   - Ficheiro: `src/routes/frontofficeRoutes.js`

#### ✅ Serviços Adicionais:
3. **API REST** (`/api/*`)
   - Interface programática (JSON)
   - Usa autenticação JWT
   - Para integração com outras aplicações

4. **AUTENTICAÇÃO** (`/login`, `/registo`)
   - Gestão de utilizadores
   - Login e registo

---

### Sobre Análise de Código em Geral:

#### As 5 Camadas Típicas:
```
┌─────────────────────────────────┐
│  1. APRESENTAÇÃO (Views)        │  ← views/*.ejs
├─────────────────────────────────┤
│  2. ROTAS (Controllers)         │  ← src/routes/*.js
├─────────────────────────────────┤
│  3. MIDDLEWARE (Segurança)      │  ← src/middleware/*.js
├─────────────────────────────────┤
│  4. LÓGICA (Models)             │  ← src/models/*.js
├─────────────────────────────────┤
│  5. DADOS (Database)            │  ← src/config/database.js
└─────────────────────────────────┘
```

#### Como Identificar Serviços:
Procure no ficheiro principal (`server.js`) por:
```javascript
app.use('/prefixo', nomeDasRotas);
//       ↑          ↑
//       URL        Serviço
```

**Exemplo do nosso projeto:**
```javascript
app.use('/backoffice', backofficeRoutes); // Serviço 1
app.use('/', frontofficeRoutes);          // Serviço 2
app.use('/api', apiRoutes);               // Serviço 3
```

---

## 📊 Diagrama Simplificado do Projeto

```
                    UTILIZADOR
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   FRONTOFFICE     BACKOFFICE      API REST
   (Consultar)     (Gerir)         (JSON)
        │               │               │
        └───────────────┼───────────────┘
                        │
                    ROTAS
                        │
                    MODELS
                        │
                    MySQL
```

---

## 🔍 Exemplo Prático: Fluxo de Dados

**Cenário:** Administrador cria uma receita nova

```
1. Admin acede: http://localhost:3000/backoffice/receitas/nova
   ↓
2. server.js → backofficeRoutes.js
   ↓
3. Middleware verifica: isAuthenticated() ✓
   ↓
4. Middleware verifica: isAdmin() ✓
   ↓
5. Rota GET '/receitas/nova' executa
   ↓
6. Busca dados: Categoria.listarTodasCategorias()
   ↓
7. Busca dados: Ingrediente.listarTodosIngredientes()
   ↓
8. Renderiza: views/backoffice/receitas/form.ejs
   ↓
9. Admin vê formulário e preenche
   ↓
10. Submit → POST /backoffice/receitas/nova
    ↓
11. Upload da imagem
    ↓
12. Receita.criarReceita(dados)
    ↓
13. SQL: INSERT INTO receitas ...
    ↓
14. Adiciona ingredientes
    ↓
15. Redirect para /backoffice/receitas
    ↓
16. ✅ Receita criada com sucesso!
```

---

## 💡 Conceitos-Chave Para Memorizar

### 1. Serviço vs Camada

**Serviço** = Módulo funcional
- Exemplo: Backoffice, Frontoffice, API

**Camada** = Nível arquitetural
- Exemplo: Views, Routes, Models

### 2. Separação de Responsabilidades

| Camada | Faz | NÃO Faz |
|--------|-----|---------|
| **Rotas** | Recebe HTTP, coordena | SQL direto, lógica complexa |
| **Models** | SQL, validação, lógica | Renderizar HTML, HTTP |
| **Views** | Mostrar dados | Processar dados, SQL |

### 3. Padrão MVC

```
MODEL      = Lógica + Dados    (src/models/)
VIEW       = Apresentação      (views/)
CONTROLLER = Coordenação       (src/routes/)
```

---

## 📚 Estrutura dos Documentos

### GUIA_ANALISE_CAMADAS.md
```
├── Introdução
├── O que são Camadas?
├── Metodologia de Análise (5 passos)
├── Análise do Projeto Gestão de Receitas
│   ├── Estrutura de pastas
│   ├── Serviços identificados
│   └── Camadas identificadas
├── Diagramas ASCII
│   ├── Visão geral
│   ├── Arquitetura em camadas
│   ├── Fluxo de dados
│   ├── Diferenças entre serviços
│   └── Separação de responsabilidades
├── Exercícios Práticos (5 exercícios)
└── Resumo e Conceitos-Chave
```

### DIAGRAMAS_ARQUITETURA.md
```
├── Como visualizar diagramas Mermaid
├── 10 Diagramas Profissionais:
│   1. Arquitetura Geral
│   2. Camadas (Layered)
│   3. Três Serviços
│   4. Fluxo: Criar Receita
│   5. Modelo de Dados (ER)
│   6. Fluxo de Autenticação
│   7. Ciclo de Vida HTTP
│   8. Padrão MVC
│   9. Comparação Serviços
│   └── 10. Deployment
└── Notas de Utilização
```

### TUTORIAL_PRATICO_ANALISE.md
```
├── Parte 1: Começando (Passos 1-3)
├── Parte 2: Ficheiro Principal (Passo 4)
├── Parte 3: Investigando Serviços (Passos 5-7)
├── Parte 4: Camada de Lógica (Passo 8)
├── Parte 5: Criando Diagramas (Passos 9-10)
├── Parte 6: Exercícios (3 exercícios)
├── Parte 7: Checklist de Análise
└── Resumo: 10 Passos da Análise
```

---

## 🎯 Objetivos de Aprendizagem

Após estudar estes documentos, você será capaz de:

✅ Identificar as camadas de qualquer projeto
✅ Reconhecer serviços e suas responsabilidades
✅ Criar diagramas de arquitetura
✅ Traçar fluxos de dados
✅ Entender a separação de responsabilidades
✅ Aplicar o padrão MVC
✅ Analisar código de forma sistemática
✅ Documentar arquitetura de software

---

## 🛠️ Ferramentas Úteis

### Para Visualizar Diagramas Mermaid:

1. **GitHub**: Faz render automático
2. **VS Code**: Instalar extensão "Markdown Preview Mermaid Support"
3. **Online**: https://mermaid.live/
4. **Obsidian**: Suporta Mermaid nativamente

### Para Explorar o Código:

```bash
# Ver estrutura
tree -L 3 -I 'node_modules'

# Procurar texto
grep -r "router.get" src/routes/

# Contar linhas
find src -name "*.js" -exec wc -l {} +

# Ver imports
grep "require" src/routes/*.js
```

---

## 📝 Comandos Rápidos

### Iniciar o Servidor:
```bash
npm start
```

### Explorar os Serviços:

1. **Frontoffice**: http://localhost:3000/
2. **Backoffice**: http://localhost:3000/backoffice
3. **API**: http://localhost:3000/api/receitas

---

## 🤔 Perguntas Frequentes

### 1. Por que separar em camadas?
**R:** Para organizar o código, facilitar manutenção e permitir que cada parte tenha UMA responsabilidade.

### 2. Qual a diferença entre Backoffice e Frontoffice?
**R:**
- **Backoffice** = Área de administração (criar/editar/eliminar)
- **Frontoffice** = Área pública (apenas consultar)

### 3. O que é um Middleware?
**R:** Uma função que processa o pedido ANTES de chegar à rota. Exemplo: verificar se o utilizador está logado.

### 4. Por que usar Models?
**R:** Para não repetir código SQL nas rotas e centralizar a lógica de negócio num só lugar.

### 5. O que é REST API?
**R:** Uma interface que retorna JSON (em vez de HTML) para ser usada por outras aplicações.

---

## 🚀 Próximos Passos Sugeridos

### Nível 1 - Iniciante:
1. ✅ Ler este ficheiro
2. ✅ Ver os diagramas em DIAGRAMAS_ARQUITETURA.md
3. ✅ Ler a introdução do GUIA_ANALISE_CAMADAS.md
4. ⬜ Fazer os exercícios do Parte 6 em TUTORIAL_PRATICO_ANALISE.md

### Nível 2 - Intermédio:
1. ⬜ Ler GUIA_ANALISE_CAMADAS.md completo
2. ⬜ Seguir TUTORIAL_PRATICO_ANALISE.md passo a passo
3. ⬜ Analisar outro projeto do GitHub
4. ⬜ Criar diagramas de um projeto seu

### Nível 3 - Avançado:
1. ⬜ Estudar padrões de design (Strategy, Factory, etc.)
2. ⬜ Ler sobre Clean Architecture
3. ⬜ Implementar testes por camada
4. ⬜ Refatorar código existente

---

## 📞 Onde Encontrar Mais Informação

### Documentação Oficial:
- **Express.js**: https://expressjs.com/
- **EJS**: https://ejs.co/
- **MySQL**: https://dev.mysql.com/doc/

### Recursos de Aprendizagem:
- **Padrão MVC**: https://pt.wikipedia.org/wiki/MVC
- **REST API**: https://restfulapi.net/
- **Layered Architecture**: Procurar no Google "layered architecture pattern"

### Livros Recomendados:
- "Clean Architecture" - Robert C. Martin
- "Design Patterns" - Gang of Four
- "The Pragmatic Programmer" - Hunt & Thomas

---

## ✅ Checklist de Estudo

Marque conforme for estudando:

- [ ] Li o LEIA-ME_PRIMEIRO.md
- [ ] Vi os diagramas em DIAGRAMAS_ARQUITETURA.md
- [ ] Li o GUIA_ANALISE_CAMADAS.md
- [ ] Segui o TUTORIAL_PRATICO_ANALISE.md
- [ ] Fiz os exercícios
- [ ] Entendo os 2 serviços principais (Backoffice/Frontoffice)
- [ ] Sei identificar as 5 camadas
- [ ] Consigo traçar um fluxo de dados
- [ ] Desenhei diagramas à mão
- [ ] Analisei outro projeto para praticar

---

## 🎉 Mensagem Final

Parabéns por querer aprender sobre análise de código e arquitetura de software!

Estes documentos foram criados especificamente para si, usando o projeto "Gestão de Receitas" como exemplo prático.

**Dica importante:** Não tente decorar tudo. O objetivo é **entender a lógica** de como o código está organizado. Com prática, isto torna-se natural.

Comece devagar, faça os exercícios, e pratique com outros projetos. Em pouco tempo, você será capaz de analisar qualquer codebase!

**Boa sorte nos seus estudos! 🚀📚**

---

*Documentação criada para fins educativos - Projeto PIS 2025/2026*
*Última atualização: 2025-12-19*
