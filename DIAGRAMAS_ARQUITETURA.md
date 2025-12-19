# 📊 Diagramas de Arquitetura - Gestão de Receitas

> **Como visualizar**: Este ficheiro contém diagramas em formato Mermaid. Pode visualizá-los em:
> - GitHub (renderiza automaticamente)
> - VS Code (com extensão Markdown Preview Mermaid)
> - [Mermaid Live Editor](https://mermaid.live/)

---

## 1. Arquitetura Geral do Sistema

```mermaid
graph TB
    subgraph Cliente["🖥️ CLIENTE"]
        Browser["Navegador Web"]
        MobileApp["Aplicação Mobile<br/>(futura)"]
    end

    subgraph Servidor["🖧 SERVIDOR - Node.js + Express"]
        Server["server.js<br/>(Ponto de Entrada)"]

        subgraph Servicos["SERVIÇOS"]
            Auth["🔐 Autenticação<br/>authRoutes"]
            Back["👨‍💼 Backoffice<br/>backofficeRoutes"]
            Front["👥 Frontoffice<br/>frontofficeRoutes"]
            API["🔌 API REST<br/>apiRoutes"]
        end

        subgraph Middleware["MIDDLEWARE"]
            AuthMid["Autenticação<br/>Sessão"]
            JWTMid["Autenticação<br/>JWT"]
            AdminMid["Verificação<br/>Admin"]
        end

        subgraph Models["MODELS (Lógica)"]
            ReceitaMod["Receita.js"]
            CategoriaMod["Categoria.js"]
            IngredienteMod["Ingrediente.js"]
            UtilizadorMod["Utilizador.js"]
        end

        subgraph Config["CONFIGURAÇÃO"]
            DB["database.js"]
            Upload["upload.js"]
        end
    end

    subgraph BancoDados["💾 BANCO DE DADOS"]
        MySQL[("MySQL<br/>Database")]
    end

    subgraph APIs["🌐 APIs EXTERNAS"]
        TheMealDB["TheMealDB API"]
    end

    Browser --> Server
    MobileApp -.-> API

    Server --> Auth
    Server --> Back
    Server --> Front
    Server --> API

    Auth --> AuthMid
    Back --> AuthMid
    Back --> AdminMid
    API --> JWTMid

    Auth --> UtilizadorMod
    Back --> ReceitaMod
    Back --> CategoriaMod
    Back --> IngredienteMod
    Front --> ReceitaMod
    Front --> CategoriaMod
    API --> ReceitaMod
    API --> CategoriaMod
    API --> IngredienteMod
    API --> UtilizadorMod

    ReceitaMod --> DB
    CategoriaMod --> DB
    IngredienteMod --> DB
    UtilizadorMod --> DB

    DB --> MySQL

    API --> TheMealDB

    style Cliente fill:#e1f5ff
    style Servidor fill:#fff4e1
    style BancoDados fill:#e1ffe1
    style APIs fill:#ffe1f5
```

---

## 2. Arquitetura em Camadas (Layered Architecture)

```mermaid
graph LR
    subgraph Camada1["CAMADA 1: APRESENTAÇÃO"]
        Views["📄 Views (EJS)<br/>views/backoffice/<br/>views/frontoffice/"]
        Static["📦 Ficheiros Estáticos<br/>public/css/<br/>public/js/"]
    end

    subgraph Camada2["CAMADA 2: ROTAS & CONTROLLERS"]
        Routes["🛣️ Rotas<br/>authRoutes.js<br/>backofficeRoutes.js<br/>frontofficeRoutes.js<br/>apiRoutes.js"]
    end

    subgraph Camada3["CAMADA 3: MIDDLEWARE"]
        MW["🛡️ Middleware<br/>Autenticação<br/>Autorização<br/>Validação"]
    end

    subgraph Camada4["CAMADA 4: LÓGICA DE NEGÓCIO"]
        Models["🧠 Models<br/>Receita.js<br/>Categoria.js<br/>Ingrediente.js<br/>Utilizador.js"]
    end

    subgraph Camada5["CAMADA 5: ACESSO A DADOS"]
        DataLayer["💾 Database Config<br/>database.js<br/>MySQL Connection"]
    end

    Camada1 <--> Camada2
    Camada2 --> Camada3
    Camada3 --> Camada4
    Camada4 --> Camada5

    style Camada1 fill:#ff9999
    style Camada2 fill:#ffcc99
    style Camada3 fill:#ffff99
    style Camada4 fill:#99ff99
    style Camada5 fill:#99ccff
```

---

## 3. Os Três Serviços Principais

```mermaid
graph TD
    User["👤 UTILIZADOR"]

    subgraph FrontOffice["🌐 FRONTOFFICE (Público)"]
        FHome["Página Inicial<br/>/"]
        FReceita["Detalhes Receita<br/>/receita/:id"]
        FCategoria["Receitas por Categoria<br/>/categoria/:id"]
        FPesquisa["Pesquisa<br/>/pesquisa"]
    end

    subgraph BackOffice["🔒 BACKOFFICE (Admin)"]
        BDash["Dashboard<br/>/backoffice"]
        BReceitas["Gestão Receitas<br/>/backoffice/receitas"]
        BCategorias["Gestão Categorias<br/>/backoffice/categorias"]
        BIngredientes["Gestão Ingredientes<br/>/backoffice/ingredientes"]
    end

    subgraph APIREST["🔌 API REST (Programático)"]
        ALogin["POST /api/auth/login<br/>(Autenticação JWT)"]
        AReceitas["GET /api/receitas<br/>(Listar)"]
        AReceitaID["GET /api/receitas/:id<br/>(Detalhes)"]
        AReceitaCreate["POST /api/receitas<br/>(Criar - JWT)"]
        AExternal["GET /api/external/*<br/>(TheMealDB)"]
    end

    User -->|Acesso Público| FrontOffice
    User -->|Login como Admin| BackOffice
    User -->|Token JWT| APIREST

    style FrontOffice fill:#b3e5fc
    style BackOffice fill:#ffccbc
    style APIREST fill:#c5e1a5
```

---

## 4. Fluxo de Dados: Exemplo Completo (Criar Receita)

```mermaid
sequenceDiagram
    actor Admin as 👨‍💼 Administrador
    participant Browser as 🌐 Browser
    participant Route as 🛣️ backofficeRoutes
    participant AuthMW as 🛡️ Middleware Auth
    participant Upload as 📤 Upload Config
    participant Model as 🧠 Model Receita
    participant DB as 💾 MySQL Database

    Admin->>Browser: Acede /backoffice/receitas/nova
    Browser->>Route: GET /backoffice/receitas/nova
    Route->>AuthMW: Verificar autenticação
    AuthMW-->>Route: ✅ Utilizador autenticado
    Route->>AuthMW: Verificar se é admin
    AuthMW-->>Route: ✅ É administrador
    Route->>Model: Categoria.listarTodasCategorias()
    Model->>DB: SELECT * FROM categorias
    DB-->>Model: [dados categorias]
    Model-->>Route: categorias
    Route->>Model: Ingrediente.listarTodosIngredientes()
    Model->>DB: SELECT * FROM ingredientes
    DB-->>Model: [dados ingredientes]
    Model-->>Route: ingredientes
    Route-->>Browser: render('form', {categorias, ingredientes})
    Browser-->>Admin: Mostra formulário

    Admin->>Browser: Preenche formulário + imagem
    Browser->>Route: POST /backoffice/receitas/nova
    Route->>AuthMW: Verificar autenticação
    AuthMW-->>Route: ✅ OK
    Route->>Upload: uploadImagem(ficheiro)
    Upload-->>Route: caminho_imagem.jpg
    Route->>Model: criarReceita(dados)
    Model->>DB: INSERT INTO receitas VALUES (...)
    DB-->>Model: receita_id = 42
    Model-->>Route: receitaId = 42
    Route->>Model: adicionarIngrediente(42, ing1, qtd)
    Model->>DB: INSERT INTO receita_ingredientes
    DB-->>Model: ✅ OK
    Route->>Model: adicionarIngrediente(42, ing2, qtd)
    Model->>DB: INSERT INTO receita_ingredientes
    DB-->>Model: ✅ OK
    Route-->>Browser: redirect('/backoffice/receitas')
    Browser-->>Admin: ✅ Receita criada com sucesso!
```

---

## 5. Modelo de Dados (Entity Relationship)

```mermaid
erDiagram
    UTILIZADORES ||--o{ RECEITAS : cria
    CATEGORIAS ||--o{ RECEITAS : classifica
    DIFICULDADES ||--o{ RECEITAS : define
    RECEITAS ||--o{ RECEITA_INGREDIENTES : contem
    INGREDIENTES ||--o{ RECEITA_INGREDIENTES : usado_em

    UTILIZADORES {
        int id PK
        string nome
        string email UK
        string password
        enum tipo
        datetime data_criacao
    }

    RECEITAS {
        int id PK
        string nome
        string autor
        text descricao_preparacao
        int tempo_preparacao
        decimal custo
        int porcoes
        string imagem
        int categoria_id FK
        int dificuldade_id FK
        int utilizador_id FK
        datetime data_criacao
    }

    CATEGORIAS {
        int id PK
        string nome UK
        text descricao
    }

    INGREDIENTES {
        int id PK
        string nome UK
    }

    DIFICULDADES {
        int id PK
        string nivel UK
        int ordem
    }

    RECEITA_INGREDIENTES {
        int receita_id FK
        int ingrediente_id FK
        string quantidade
    }
```

---

## 6. Fluxo de Autenticação

```mermaid
stateDiagram-v2
    [*] --> NaoAutenticado

    NaoAutenticado --> FormLogin : Aceder /login
    FormLogin --> Validacao : Submeter email/password

    Validacao --> NaoAutenticado : ❌ Credenciais inválidas
    Validacao --> Autenticado : ✅ Credenciais válidas

    Autenticado --> VerificarTipo : Verificar tipo utilizador

    VerificarTipo --> UtilizadorNormal : tipo = 'normal'
    VerificarTipo --> Administrador : tipo = 'admin'

    UtilizadorNormal --> AcessoFrontoffice : Pode aceder
    UtilizadorNormal --> AcessoBackoffice : ❌ Bloqueado

    Administrador --> AcessoFrontoffice : Pode aceder
    Administrador --> AcessoBackoffice : ✅ Pode aceder

    AcessoFrontoffice --> [*] : Logout
    AcessoBackoffice --> [*] : Logout

    note right of Validacao
        Middleware: isAuthenticated()
        Verifica req.session.utilizador
    end note

    note right of VerificarTipo
        Middleware: isAdmin()
        Verifica utilizador.tipo === 'admin'
    end note
```

---

## 7. Ciclo de Vida de um Pedido HTTP

```mermaid
graph TD
    Start([Pedido HTTP]) --> Server[server.js recebe]
    Server --> Session[Middleware: express-session]
    Session --> BodyParser[Middleware: body-parser]
    BodyParser --> Static{É ficheiro estático?}

    Static -->|Sim| ServeStatic[Servir de /public]
    ServeStatic --> End([Resposta HTTP])

    Static -->|Não| Router[Routing]
    Router --> Auth{Rota /login ou /registo?}
    Router --> BackO{Rota /backoffice/*?}
    Router --> FrontO{Rota / ou /receita/*?}
    Router --> ApiR{Rota /api/*?}

    Auth -->|Sim| AuthRoute[authRoutes.js]
    BackO -->|Sim| CheckAuth[Middleware: isAuthenticated]
    FrontO -->|Sim| FrontRoute[frontofficeRoutes.js]
    ApiR -->|Sim| ApiRoute[apiRoutes.js]

    CheckAuth --> CheckAdmin[Middleware: isAdmin]
    CheckAdmin -->|✅ Admin| BackRoute[backofficeRoutes.js]
    CheckAdmin -->|❌ Não Admin| Error403[403 Forbidden]

    AuthRoute --> ProcessAuth[Processar login/registo]
    BackRoute --> ProcessBack[Processar gestão]
    FrontRoute --> ProcessFront[Processar visualização]
    ApiRoute --> ProcessApi[Processar API]

    ProcessAuth --> CallModel[Chamar Model]
    ProcessBack --> CallModel
    ProcessFront --> CallModel
    ProcessApi --> CallModel

    CallModel --> QueryDB[Query MySQL]
    QueryDB --> RenderView{Renderizar View?}

    RenderView -->|Sim HTML| RenderEJS[Renderizar EJS]
    RenderView -->|Não JSON| ReturnJSON[Retornar JSON]

    RenderEJS --> End
    ReturnJSON --> End
    Error403 --> End

    style Start fill:#90ee90
    style End fill:#ffcccb
    style Error403 fill:#ff6b6b
```

---

## 8. Separação de Responsabilidades (MVC Pattern)

```mermaid
graph LR
    subgraph MVC["PADRÃO MVC"]
        direction TB

        subgraph View["VIEW (Apresentação)"]
            EJS["Templates EJS<br/>index.ejs<br/>receita.ejs<br/>dashboard.ejs"]
        end

        subgraph Controller["CONTROLLER (Rotas)"]
            Routes["Routes<br/>Recebe HTTP<br/>Coordena fluxo<br/>Envia resposta"]
        end

        subgraph Model["MODEL (Dados + Lógica)"]
            Business["Lógica de Negócio<br/>Validações<br/>Queries SQL"]
        end
    end

    User["👤 Utilizador"] -->|1. Pedido HTTP| Controller
    Controller -->|2. Pede dados| Model
    Model -->|3. Retorna dados| Controller
    Controller -->|4. Passa dados| View
    View -->|5. HTML| User

    style View fill:#ffe6e6
    style Controller fill:#e6f3ff
    style Model fill:#e6ffe6
```

---

## 9. Comparação: Backoffice vs Frontoffice vs API

```mermaid
graph TB
    subgraph Comparison["COMPARAÇÃO DOS SERVIÇOS"]

        subgraph Front["FRONTOFFICE"]
            F1["👥 Acesso: PÚBLICO"]
            F2["📄 Formato: HTML"]
            F3["🔓 Auth: NÃO necessária"]
            F4["🎯 Objetivo: Consultar<br/>receitas"]
            F5["🛣️ URLs: /, /receita/:id"]
        end

        subgraph Back["BACKOFFICE"]
            B1["👨‍💼 Acesso: ADMIN"]
            B2["📄 Formato: HTML"]
            B3["🔐 Auth: Sessão + Admin"]
            B4["🎯 Objetivo: Gerir<br/>sistema"]
            B5["🛣️ URLs: /backoffice/*"]
        end

        subgraph Api["API REST"]
            A1["🔌 Acesso: MISTO"]
            A2["📦 Formato: JSON"]
            A3["🔑 Auth: JWT Token"]
            A4["🎯 Objetivo: Integração<br/>programática"]
            A5["🛣️ URLs: /api/*"]
        end
    end

    style Front fill:#b3e5fc
    style Back fill:#ffccbc
    style Api fill:#c5e1a5
```

---

## 10. Diagrama de Deployment (Implantação)

```mermaid
graph TB
    subgraph Internet["🌐 INTERNET"]
        Client1["💻 Utilizador Web"]
        Client2["📱 App Mobile"]
        Client3["🔧 Cliente API"]
    end

    subgraph Server["🖥️ SERVIDOR"]
        subgraph NodeApp["Node.js Application"]
            Express["Express Server<br/>Porta 3000"]

            subgraph Routes["Routes"]
                Auth["Auth"]
                Back["Backoffice"]
                Front["Frontoffice"]
                API["API"]
            end

            subgraph Models["Models"]
                M1["Receita"]
                M2["Categoria"]
                M3["Ingrediente"]
                M4["Utilizador"]
            end
        end

        subgraph Storage["Armazenamento"]
            Files["📁 Ficheiros<br/>public/uploads/"]
        end
    end

    subgraph Database["🗄️ BASE DE DADOS"]
        MySQL[("MySQL Server<br/>Porta 3306")]
    end

    subgraph External["🌍 SERVIÇOS EXTERNOS"]
        MealDB["TheMealDB API"]
    end

    Client1 ---|HTTP/HTTPS| Express
    Client2 ---|HTTP/HTTPS| Express
    Client3 ---|HTTP/HTTPS| Express

    Express --> Routes
    Routes --> Models
    Models --> MySQL

    Express --> Files

    API --> MealDB

    style Internet fill:#e1f5ff
    style Server fill:#fff4e1
    style Database fill:#e1ffe1
    style External fill:#ffe1f5
```

---

## 📝 Notas de Utilização

### Como Ler os Diagramas:

1. **Cores**: Representam diferentes áreas do sistema
   - 🔵 Azul: Cliente/Interface
   - 🟡 Amarelo: Servidor/Lógica
   - 🟢 Verde: Base de Dados
   - 🔴 Rosa: Serviços Externos

2. **Setas**:
   - `-->`: Fluxo de dados/chamadas
   - `-.->`: Fluxo condicional/opcional
   - `==>`: Fluxo principal

3. **Símbolos**:
   - `[]`: Processos/Componentes
   - `()`: Início/Fim
   - `{}`: Decisões
   - `(())`: Base de Dados

### Ferramentas para Visualizar:

```bash
# Visual Studio Code
# Instalar extensão: Markdown Preview Mermaid Support

# Online
# https://mermaid.live/

# GitHub
# Renderiza automaticamente em ficheiros .md
```

---

*Diagramas criados para o projeto Gestão de Receitas - PIS 2025/2026*
