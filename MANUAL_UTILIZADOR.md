# Manual do Utilizador

Sistema de Gestao de Receitas - Projeto PIS 2025/2026

## 1. Como Aceder

### Criar conta

1. Ir a `http://localhost:3000/registo`
2. Preencher:
   - Nome
   - Email
   - Password (minimo 6 caracteres)
   - Confirmar password
3. Clicar "Registar"

### Fazer login

1. Ir a `http://localhost:3000/login`
2. Escrever email e password
3. Clicar "Entrar"

**Contas pre-criadas:**

Admin:
- Email: admin@receitas.pt
- Password: admin123

User normal:
- Email: joao@exemplo.pt
- Password: password123

### Sair

Clicar "Sair" no menu.

## 2. Area Publica

### Pagina inicial

Aceder `http://localhost:3000` para ver:
- Lista de receitas
- Menu de categorias
- Barra de pesquisa

### Pesquisar

Pode pesquisar por:
- Nome, autor ou descricao (no campo de pesquisa)
- Categoria (no menu)
- Dificuldade (Facil, Medio, Dificil)

### Ver receita

Clicar "Ver Receita" para ver:
- Foto
- Informacoes (categoria, dificuldade, tempo, custo, porcoes)
- Ingredientes
- Modo de preparacao
- Avaliacoes

### Ver por categoria

Clicar numa categoria para ver so receitas dessa categoria.

## 3. Area de Administracao

So admin pode aceder.

### Entrar no backoffice

1. Fazer login com conta admin
2. Ir a `http://localhost:3000/backoffice`

### Dashboard

Mostra:
- Total de receitas
- Total de utilizadores
- Total de categorias
- Total de ingredientes

### Gerir receitas

**Listar:**
- Menu: "Receitas"
- Mostra tabela com todas

**Criar:**
1. Clicar "Nova Receita"
2. Preencher:
   - Nome
   - Autor
   - Categoria
   - Dificuldade
   - Tempo (minutos)
   - Custo (euros)
   - Porcoes
   - Modo de preparacao
   - Foto (opcional)
   - Ingredientes
3. Clicar "Guardar"

**Editar:**
1. Clicar "Editar"
2. Mudar o que quiser
3. Clicar "Atualizar"

**Apagar:**
1. Clicar "Eliminar"
2. Confirmar

### Gerir categorias

**Ver:**
- Menu: "Categorias"

**Criar:**
1. Clicar "Nova Categoria"
2. Escrever nome e descricao
3. Guardar

Nao pode apagar categorias com receitas.

### Gerir ingredientes

**Ver:**
- Menu: "Ingredientes"

**Adicionar:**
1. Clicar "Novo Ingrediente"
2. Escrever nome
3. Guardar

## 4. Problemas

### Nao consigo fazer login

- Verificar email e password
- Confirmar que conta foi criada

### Imagem nao aparece

- Verificar se ficheiro foi carregado
- So aceita JPG e PNG
- Max 5MB

### Erro ao criar receita

- Preencher todos os campos
- Escolher categoria e dificuldade
- Adicionar pelo menos um ingrediente
