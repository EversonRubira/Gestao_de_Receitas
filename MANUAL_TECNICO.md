# Manual Técnico - Sistema de Gestão de Receitas
## Projeto PIS 2025/2026

### 1. Arquitetura do Sistema

O sistema foi desenvolvido utilizando uma arquitetura MVC (Model-View-Controller) com as seguintes tecnologias:

- **Backend**: Node.js com Express.js
- **Base de Dados**: MySQL
- **Template Engine**: EJS
- **API**: REST (JSON)
- **Autenticação**: Sessions com bcryptjs

### 2. Estrutura do Projeto

```
Projeto/
├── database/
│   └── schema.sql              # Script de criação da BD
├── public/
│   ├── css/
│   │   ├── style.css          # Estilos frontoffice
│   │   └── backoffice.css     # Estilos backoffice
│   ├── js/
│   │   └── main.js            # JavaScript cliente
│   └── images/                # Imagens estáticas
├── src/
│   ├── config/
│   │   └── database.js        # Configuração MySQL
│   ├── controllers/           # Controladores (futuro)
│   ├── middleware/
│   │   └── auth.js            # Middleware autenticação
│   ├── models/
│   │   ├── Receita.js         # Model Receitas
│   │   ├── Utilizador.js      # Model Utilizadores
│   │   ├── Categoria.js       # Model Categorias
│   │   └── Ingrediente.js     # Model Ingredientes
│   └── routes/
│       ├── apiRoutes.js       # Rotas API REST
│       ├── authRoutes.js      # Rotas autenticação
│       ├── backofficeRoutes.js # Rotas backoffice
│       └── frontofficeRoutes.js # Rotas frontoffice
├── views/
│   ├── backoffice/            # Views administração
│   ├── frontoffice/           # Views públicas
│   └── partials/              # Componentes reutilizáveis
├── .env                       # Configurações ambiente
├── .gitignore
├── package.json
├── server.js                  # Servidor principal
└── README.md

```

### 3. Base de Dados

#### Tabelas Principais:

1. **utilizadores** - Gestão de utilizadores do sistema
2. **receitas** - Armazena informações das receitas
3. **categorias** - Categorias das receitas
4. **dificuldades** - Níveis de dificuldade
5. **ingredientes** - Lista de ingredientes
6. **receita_ingredientes** - Relação many-to-many
7. **avaliacoes** - Avaliações das receitas

#### Diagrama Relacional:
```
utilizadores (1) ----< (N) receitas (N) >---- (M) ingredientes
                            |
                            |
                         categorias
                         dificuldades
```

### 4. API REST

#### Endpoints Principais:

**Receitas:**
- `GET /api/receitas` - Listar todas as receitas
- `GET /api/receitas/:id` - Obter receita específica
- `POST /api/receitas` - Criar nova receita (autenticado)
- `PUT /api/receitas/:id` - Atualizar receita (autenticado)
- `DELETE /api/receitas/:id` - Eliminar receita (autenticado)

**Categorias:**
- `GET /api/categorias` - Listar categorias

**Ingredientes:**
- `GET /api/ingredientes` - Listar ingredientes

**Serviços Externos:**
- `GET /api/external/random` - Receita aleatória TheMealDB
- `GET /api/external/search/:term` - Pesquisar no TheMealDB

### 5. Autenticação

O sistema utiliza sessions do Express para autenticação:
- Passwords encriptadas com bcryptjs (10 rounds)
- Middleware de proteção de rotas
- Dois níveis de acesso: `admin` e `user`

#### Credenciais Padrão:
- **Admin**: admin@receitas.pt / admin123
- **User**: joao@exemplo.pt / admin123

### 6. Instalação e Configuração

#### Requisitos:
- Node.js v14 ou superior
- MySQL 5.7 ou superior
- npm ou yarn

#### Passos de Instalação:

```bash
# 1. Instalar dependências
npm install

# 2. Configurar base de dados
mysql -u root -p < database/schema.sql

# 3. Configurar variáveis de ambiente
# Editar o ficheiro .env conforme necessário

# 4. Iniciar o servidor
npm start

# Ou em modo desenvolvimento:
npm run dev
```

### 7. Serviços Implementados

#### Serviços Elementares:
- CRUD completo de receitas
- CRUD de categorias
- CRUD de ingredientes
- Autenticação de utilizadores

#### Serviços Compostos:
- Pesquisa de receitas com filtros múltiplos
- Listagem de receitas com média de avaliações
- Gestão de ingredientes de receitas
- Integração com API externa (TheMealDB)

### 8. Segurança

- Validação de inputs no servidor
- Proteção contra SQL injection (prepared statements)
- Passwords encriptadas
- Sessions seguras
- Middleware de autenticação em rotas protegidas

### 9. Tecnologias e Dependências

```json
{
  "express": "Frameworkweb",
  "mysql2": "Driver MySQL com Promises",
  "dotenv": "Gestão de variáveis de ambiente",
  "express-session": "Gestão de sessões",
  "bcryptjs": "Encriptação de passwords",
  "ejs": "Template engine",
  "body-parser": "Parser de requisições",
  "axios": "Cliente HTTP para APIs externas"
}
```

### 10. Melhorias Futuras

- Upload de imagens
- Sistema de avaliações funcional
- Pesquisa avançada com Elasticsearch
- Cache com Redis
- Testes automatizados
- API de autenticação com JWT
- Integração OAuth (Google)
- Sistema de favoritos
- Exportação de receitas em PDF

### 11. Autores

- **Everson Rubira** - Nº 202301089
- [Nome Aluno 2]

### 12. Contacto

Para questões técnicas, consultar a documentação do Express.js e MySQL.
