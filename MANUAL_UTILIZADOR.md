# Manual do Utilizador
Sistema de Gestão de Receitas - Projeto PIS 2025/2026

---

## 1. Como Aceder ao Sistema

### Criar uma conta nova

1. Ir a `http://localhost:3000/registo`
2. Preencher os dados:
   - Nome
   - Email
   - Password (no mínimo 6 caracteres)
   - Confirmar password
3. Clicar em "Registar"

Depois de registar, já fica automaticamente com login feito.

### Fazer Login

1. Ir a `http://localhost:3000/login`
2. Meter o email e password
3. Clicar em "Entrar"

**Contas que já existem:**

Administrador:
- Email: admin@receitas.pt
- Password: admin123

Utilizador normal:
- Email: joao@exemplo.pt
- Password: password123

### Sair

Clicar no botão "Sair" no menu.

---

## 2. Área Pública (Frontoffice)

### Página Inicial

Quando se abre `http://localhost:3000` aparece:
- Lista com todas as receitas
- Menu com as categorias
- Barra de pesquisa
- Filtros

### Pesquisar Receitas

Pode pesquisar de várias formas:
- Escrever no campo de pesquisa (pesquisa por nome, autor ou descrição)
- Escolher uma categoria no menu
- Filtrar por dificuldade (Fácil, Médio, Difícil)

### Ver uma Receita

Clicar em "Ver Receita" para ver os detalhes:
- Foto da receita
- Categoria, dificuldade, tempo e custo
- Lista de ingredientes
- Como preparar (passo a passo)
- Avaliações

### Ver Receitas por Categoria

Clicar numa categoria (por exemplo "Sobremesas") para ver só as receitas dessa categoria.

---

## 3. Área de Administração (Backoffice)

**Atenção:** Só quem tiver conta de administrador pode aceder!

### Entrar no Backoffice

1. Fazer login com conta admin
2. Ir a `http://localhost:3000/backoffice`
3. Ou clicar em "Backoffice" no menu

### Dashboard

Mostra estatísticas:
- Quantas receitas existem
- Quantos utilizadores
- Quantas categorias
- Quantos ingredientes

### Gerir Receitas

**Listar receitas:**
- Menu lateral → "Receitas"
- Aparece uma tabela com todas as receitas
- Pode ver, editar ou apagar

**Criar receita nova:**
1. Clicar em "Nova Receita"
2. Preencher o formulário:
   - Nome da receita
   - Autor
   - Categoria
   - Dificuldade
   - Tempo (em minutos)
   - Custo (em euros)
   - Porções
   - Modo de preparação
   - Foto (opcional)
   - Ingredientes
3. Clicar em "Guardar"

**Editar receita:**
1. Clicar em "Editar" na receita que quer mudar
2. Alterar o que quiser
3. Clicar em "Atualizar"

**Apagar receita:**
1. Clicar em "Eliminar"
2. Confirmar

⚠️ Atenção: Quando se apaga uma receita, não dá para recuperar!

### Gerir Categorias

**Ver categorias:**
- Menu lateral → "Categorias"

**Criar categoria:**
1. Clicar em "Nova Categoria"
2. Escrever o nome e descrição
3. Guardar

**Importante:** Não se pode apagar categorias que tenham receitas.

### Gerir Ingredientes

**Ver ingredientes:**
- Menu lateral → "Ingredientes"

**Adicionar ingrediente:**
1. Clicar em "Novo Ingrediente"
2. Escrever o nome
3. Guardar

---

## 4. Problemas Comuns

### Não consigo fazer login
- Verificar se o email e password estão corretos
- Confirmar que a conta foi criada

### A imagem não aparece
- Verificar se o ficheiro foi carregado
- Só aceita JPG e PNG
- Tamanho máximo: 5MB

### Erro ao criar receita
- Preencher todos os campos obrigatórios
- Verificar se escolheu a categoria e dificuldade
- Confirmar que adicionou ingredientes

---

**Projeto PIS 2025/2026 - CTeSP TPSI**
