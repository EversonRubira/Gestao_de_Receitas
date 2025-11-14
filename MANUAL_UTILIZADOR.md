# Manual de Utilizador - Sistema de Gestão de Receitas
## Projeto PIS 2025/2026

### 1. Introdução

Bem-vindo ao Sistema de Gestão de Receitas! Esta aplicação permite-lhe gerir, pesquisar e visualizar receitas de forma simples e intuitiva.

### 2. Acesso ao Sistema

#### 2.1 Página Inicial
Aceda ao sistema através do navegador: `http://localhost:3000`

#### 2.2 Registo de Utilizador
1. Clique em "Registe-se aqui" na página de login
2. Preencha os campos:
   - Nome completo
   - Email válido
   - Password (mínimo 6 caracteres)
   - Confirmação de password
3. Clique em "Registar"

#### 2.3 Login
1. Aceda a `http://localhost:3000/login`
2. Introduza o seu email e password
3. Clique em "Entrar"

**Nota**: Utilizadores admin têm acesso ao backoffice.

### 3. Frontoffice (Utilizadores)

#### 3.1 Página Principal
- Visualize as receitas mais recentes
- Explore categorias de receitas
- Utilize a barra de pesquisa

#### 3.2 Pesquisar Receitas
1. Na página inicial, utilize o campo de pesquisa
2. Pode filtrar por:
   - Termo de pesquisa (nome, autor, descrição)
   - Categoria
3. Clique em "Pesquisar"

#### 3.3 Ver Detalhes da Receita
1. Clique em "Ver Receita" num cartão de receita
2. Visualize:
   - Imagem da receita
   - Informações (categoria, dificuldade, tempo, custo)
   - Lista de ingredientes com quantidades
   - Modo de preparação passo a passo
   - Avaliação média (se disponível)

#### 3.4 Navegação por Categorias
1. Na página inicial, clique numa categoria
2. Visualize todas as receitas dessa categoria

### 4. Backoffice (Administradores)

Aceda ao backoffice em: `http://localhost:3000/backoffice`

#### 4.1 Dashboard
- Visualize estatísticas gerais:
  - Total de receitas
  - Total de utilizadores
  - Total de categorias
  - Total de ingredientes
- Aceda rapidamente às principais funcionalidades

#### 4.2 Gestão de Receitas

**Criar Nova Receita:**
1. Clique em "Receitas" no menu lateral
2. Clique em "➕ Nova Receita"
3. Preencha os campos obrigatórios:
   - Nome da receita
   - Autor
   - Categoria
   - Dificuldade
   - Tempo de preparação (minutos)
   - Custo (€)
   - Porções
   - Descrição da preparação
4. Opcionalmente, adicione URL de imagem
5. Clique em "Criar Receita"

**Editar Receita:**
1. Na lista de receitas, clique em "Editar"
2. Modifique os campos desejados
3. Clique em "Atualizar Receita"

**Eliminar Receita:**
1. Na lista de receitas, clique em "Eliminar"
2. Confirme a eliminação
3. A receita será removida permanentemente

**Ver Receita:**
1. Clique em "Ver" para visualizar a receita no frontoffice

#### 4.3 Gestão de Categorias

**Adicionar Categoria:**
1. Aceda a "Categorias" no menu lateral
2. Preencha o formulário:
   - Nome da categoria
   - Descrição (opcional)
3. Clique em "Adicionar Categoria"

**Visualizar Categorias:**
- Veja a lista completa com:
  - Nome
  - Descrição
  - Total de receitas por categoria

#### 4.4 Gestão de Ingredientes

**Adicionar Ingrediente:**
1. Aceda a "Ingredientes" no menu lateral
2. Digite o nome do ingrediente
3. Clique em "Adicionar Ingrediente"

**Visualizar Ingredientes:**
- Veja a lista completa de todos os ingredientes registados

### 5. Funcionalidades Especiais

#### 5.1 Integração com TheMealDB
O sistema integra a API TheMealDB para receitas externas:
- Aceda através da API: `/api/external/random`
- Pesquise receitas externas: `/api/external/search/termo`

#### 5.2 API REST
Para desenvolvedores, a API REST está disponível em:
- `GET /api/receitas` - Lista todas as receitas
- `GET /api/receitas/:id` - Detalhes de uma receita
- `POST /api/receitas` - Criar receita (requer autenticação)
- `PUT /api/receitas/:id` - Atualizar receita (requer autenticação)
- `DELETE /api/receitas/:id` - Eliminar receita (requer autenticação)

**Exemplo de uso:**
```javascript
// Obter todas as receitas
fetch('/api/receitas')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 6. Dicas de Utilização

- **Passwords Seguras**: Use passwords com pelo menos 6 caracteres
- **Imagens**: Utilize URLs diretas para imagens (ex: https://exemplo.com/imagem.jpg)
- **Pesquisa**: Utilize termos específicos para melhores resultados
- **Navegação**: Utilize o menu superior para navegar rapidamente

### 7. Resolução de Problemas

**Não consigo fazer login:**
- Verifique se o email e password estão corretos
- Certifique-se de que se registou primeiro

**Não vejo as receitas:**
- Verifique a conexão à base de dados
- Certifique-se de que existem receitas criadas

**Erro ao criar receita:**
- Preencha todos os campos obrigatórios (*)
- Verifique os formatos dos dados (números, decimais)

**Não consigo aceder ao backoffice:**
- Apenas utilizadores admin têm acesso
- Verifique com o administrador do sistema

### 8. Contactos e Suporte

Para suporte técnico ou dúvidas, contacte os desenvolvedores do projeto.

---

### 9. Autores

- **Everson Rubira** - Nº 202301089
- [Nome Aluno 2]

---

**Versão**: 1.0
**Data**: 2025/2026
**Projeto**: PIS - CTeSP TPSI
