# Sistema de Gestão de Receitas

Projeto desenvolvido para a disciplina de Programação e Integração de Serviços (PIS) - CTeSP TPSI 2025/2026

## Tecnologias Utilizadas

- Node.js
- Express.js
- MySQL
- EJS (Template Engine)
- REST API

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o ficheiro `.env` baseado no `.env.example`

4. Crie a base de dados:
```bash
mysql -u root -p < database/schema.sql
```

5. Inicie o servidor:
```bash
npm start
```
ou em modo de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

- `/src` - Código fonte da aplicação
  - `/controllers` - Controladores da aplicação
  - `/models` - Modelos de dados
  - `/routes` - Rotas da API
  - `/middleware` - Middleware personalizado
  - `/config` - Configurações
- `/public` - Ficheiros estáticos (CSS, JS, imagens)
- `/views` - Templates EJS
  - `/backoffice` - Interface de administração
  - `/frontoffice` - Interface pública
- `/database` - Scripts SQL

## Funcionalidades

- Gestão de receitas (CRUD)
- Autenticação de utilizadores
- Backoffice para administração
- Frontoffice para visualização
- Integração com API externa (TheMealDB)
- API REST

## Autores

- Everson Rubira (202301089)
- [Nome Aluno 2]
