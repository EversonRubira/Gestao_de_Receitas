# 🧪 GUIA DE TESTES COM POSTMAN - Sistema de Gestão de Receitas

**Projeto PIS 2025/2026**
**Autenticação JWT implementada em 2 serviços: WEB (Cookies) + API (Bearer Token)**

---

## 📦 IMPORTAR A COLEÇÃO NO POSTMAN

### Passo 1: Abrir o Postman
1. Abra o aplicativo Postman
2. Se não tiver, baixe em: https://www.postman.com/downloads/

### Passo 2: Importar a Coleção
1. Clique em **"Import"** (canto superior esquerdo)
2. Clique em **"Upload Files"**
3. Navegue até: `docs/postman/Gestao_Receitas_API.postman_collection.json`
4. Clique em **"Import"**

### Passo 3: Configurar Ambiente (Opcional)
A coleção já vem com variáveis configuradas:
- `base_url`: http://localhost:3000
- `auth_token`: (será preenchido automaticamente após login)

---

## 🚀 INICIAR O SERVIDOR

Antes de testar, certifique-se que o servidor está rodando:

```bash
# No terminal, na pasta do projeto:
npm start
# ou
npm run dev
```

Verifique se aparece:
```
Servidor a correr em http://localhost:3000
Backoffice: http://localhost:3000/backoffice
API: http://localhost:3000/api
```

---

## 🧪 TESTES PASSO A PASSO

### ✅ TESTE 1: Login - Obter Token JWT

**O que testa:** Autenticação JWT (Serviço 1)
**Endpoint:** `POST /api/auth/login`
**Código fonte:** `src/routes/apiRoutes.js:27-96`

#### Passo a passo:
1. Na coleção, abra: **"1. Autenticação" → "Login - Obter Token JWT"**
2. Verifique o Body (já preenchido):
   ```json
   {
     "email": "admin@receitas.pt",
     "password": "admin123"
   }
   ```
3. Clique em **"Send"**

#### ✅ Resposta esperada (Status 200):
```json
{
  "success": true,
  "message": "Login efetuado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "utilizador": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@receitas.pt",
    "tipo": "admin"
  }
}
```

#### 🔍 O que acontece no código:
1. **Recebe credenciais** (apiRoutes.js:28-29)
2. **Busca utilizador na BD** (linha 40)
3. **Verifica password** com bcrypt (linha 58)
4. **Gera token JWT** usando `gerarToken()` (linha 76)
   - Código da função: `src/middleware/auth.js:17-30`
   - Usa `jwt.sign()` com payload e secret
5. **Retorna token** (linha 83-93)

#### 🎯 IMPORTANTE:
O token é salvo automaticamente na variável `{{auth_token}}` por um script de teste!

---

### ✅ TESTE 2: Listar Todas as Receitas (Público)

**O que testa:** Endpoint público (sem autenticação)
**Endpoint:** `GET /api/receitas`
**Código fonte:** `src/routes/apiRoutes.js:101-140`

#### Passo a passo:
1. Abra: **"2. Receitas (Público)" → "Listar Todas as Receitas"**
2. Clique em **"Send"**

#### ✅ Resposta esperada (Status 200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Bacalhau à Brás",
      "autor": "Chef João Silva",
      "descricao_preparacao": "Deliciosa receita tradicional portuguesa...",
      "tempo_preparacao": 45,
      "custo": 15.50,
      "porcoes": 4,
      "categoria_id": 1,
      "categoria_nome": "Pratos Principais",
      "dificuldade_id": 2,
      "dificuldade_nome": "Médio",
      "utilizador_id": 1,
      "imagem": "bacalhau_bras.jpg",
      "data_criacao": "2025-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

#### 🔍 O que acontece no código:
1. **Verifica se há filtros** (linha 102-107)
2. **Chama `Receita.listarTodasReceitas()`** (linha 124)
   - Código da função: `src/models/Receita.js`
   - Executa query SQL na base de dados
3. **Retorna JSON** com array de receitas (linha 133-137)

---

### ✅ TESTE 3: Obter Receita Específica

**O que testa:** Buscar por ID + buscar ingredientes relacionados
**Endpoint:** `GET /api/receitas/:id`
**Código fonte:** `src/routes/apiRoutes.js:143-180`

#### Passo a passo:
1. Abra: **"2. Receitas (Público)" → "Obter Receita Específica"**
2. Verifique a URL: `http://localhost:3000/api/receitas/1`
3. Clique em **"Send"**

#### ✅ Resposta esperada (Status 200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Bacalhau à Brás",
    "autor": "Chef João Silva",
    "descricao_preparacao": "Deliciosa receita tradicional portuguesa...",
    "tempo_preparacao": 45,
    "custo": 15.50,
    "porcoes": 4,
    "ingredientes": [
      {
        "id": 1,
        "nome": "Bacalhau",
        "quantidade": "500g"
      },
      {
        "id": 2,
        "nome": "Batata",
        "quantidade": "1kg"
      }
    ]
  }
}
```

#### 🔍 O que acontece no código:
1. **Extrai ID dos parâmetros** (linha 144)
2. **Busca receita** com `Receita.buscarReceitaPorId()` (linha 146)
3. **Busca ingredientes** com `Receita.buscarIngredientesReceita()` (linha 163)
4. **Junta dados** e retorna (linha 172-177)

#### ❌ Teste de erro - ID inexistente:
- Mude a URL para: `http://localhost:3000/api/receitas/999`
- Resposta esperada (Status 404):
  ```json
  {
    "success": false,
    "message": "Receita não encontrada"
  }
  ```

---

### ✅ TESTE 4: Criar Nova Receita (PROTEGIDO - JWT)

**O que testa:** Autenticação JWT em endpoint protegido
**Endpoint:** `POST /api/receitas`
**Código fonte:** `src/routes/apiRoutes.js:183-204`
**Middleware:** `src/middleware/auth.js:131-163`

#### Passo a passo:
1. **IMPORTANTE:** Faça o Teste 1 primeiro para obter o token!
2. Abra: **"3. Receitas (Protegido - JWT)" → "Criar Nova Receita"**
3. Verifique a aba **"Authorization"**:
   - Type: **Bearer Token**
   - Token: `{{auth_token}}` (preenchido automaticamente)
4. Verifique o Body:
   ```json
   {
     "nome": "Arroz de Marisco",
     "autor": "Chef António",
     "descricao_preparacao": "Arroz cremoso com diversos mariscos frescos.",
     "tempo_preparacao": 60,
     "custo": 25.50,
     "porcoes": 4,
     "categoria_id": 1,
     "dificuldade_id": 3
   }
   ```
5. Clique em **"Send"**

#### ✅ Resposta esperada (Status 201):
```json
{
  "success": true,
  "message": "Receita criada com sucesso",
  "data": {
    "id": 5
  }
}
```

#### 🔍 O que acontece no código:

**1. Middleware `protegerRotaAPI` (auth.js:131-163):**
```javascript
// 1. Extrai header Authorization
const authHeader = req.headers['authorization'];

// 2. Valida formato "Bearer TOKEN"
const partes = authHeader.split(' ');
const token = partes[1];

// 3. Verifica token com jwt.verify()
verificarToken(token, function(erro, dados) {
    // 4. Se válido, adiciona dados ao request
    req.utilizador = dados;
    next(); // Continua para a rota
});
```

**2. Rota criar receita (apiRoutes.js:183-204):**
```javascript
// Middleware já verificou o token!
dadosReceita.utilizador_id = req.utilizador.id; // Pega ID do token

Receita.criarReceita(dadosReceita, function(erro, receitaId) {
    // Insere na BD e retorna ID
});
```

#### ❌ Teste de erro - Sem token:
1. Vá na aba **"Authorization"**
2. Mude Type para **"No Auth"**
3. Clique em **"Send"**
4. Resposta esperada (Status 401):
   ```json
   {
     "erro": "Token não fornecido. Faça login na API primeiro."
   }
   ```

#### ❌ Teste de erro - Token inválido:
1. Vá na aba **"Authorization"**
2. Mude o Token para: `token_invalido_teste`
3. Clique em **"Send"**
4. Resposta esperada (Status 401):
   ```json
   {
     "erro": "Token inválido ou expirado",
     "detalhes": "jwt malformed"
   }
   ```

---

### ✅ TESTE 5: Atualizar Receita (PROTEGIDO - JWT)

**O que testa:** Autenticação JWT + atualização na BD
**Endpoint:** `PUT /api/receitas/:id`
**Código fonte:** `src/routes/apiRoutes.js:207-232`

#### Passo a passo:
1. Abra: **"3. Receitas (Protegido - JWT)" → "Atualizar Receita"**
2. Certifique-se que tem o token (Teste 1)
3. Altere o Body conforme necessário
4. Clique em **"Send"**

#### ✅ Resposta esperada (Status 200):
```json
{
  "success": true,
  "message": "Receita atualizada com sucesso"
}
```

---

### ✅ TESTE 6: Eliminar Receita (PROTEGIDO - JWT)

**O que testa:** Autenticação JWT + DELETE na BD
**Endpoint:** `DELETE /api/receitas/:id`
**Código fonte:** `src/routes/apiRoutes.js:235-259`

#### Passo a passo:
1. Abra: **"3. Receitas (Protegido - JWT)" → "Eliminar Receita"**
2. **CUIDADO:** Isto vai apagar uma receita!
3. Altere o ID na URL para uma receita de teste
4. Clique em **"Send"**

#### ✅ Resposta esperada (Status 200):
```json
{
  "success": true,
  "message": "Receita eliminada com sucesso"
}
```

---

### ✅ TESTE 7: API Externa - Receita Aleatória

**O que testa:** Chamada a serviço externo com Axios
**Endpoint:** `GET /api/external/random`
**Código fonte:** `src/routes/apiRoutes.js:304-319`

#### Passo a passo:
1. Abra: **"6. API Externa (TheMealDB)" → "Obter Receita Aleatória Externa"**
2. Clique em **"Send"**

#### ✅ Resposta esperada (Status 200):
```json
{
  "success": true,
  "data": {
    "idMeal": "52772",
    "strMeal": "Teriyaki Chicken Casserole",
    "strCategory": "Chicken",
    "strArea": "Japanese",
    "strInstructions": "Preheat oven to 350° F...",
    "strMealThumb": "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    "strIngredient1": "soy sauce",
    "strIngredient2": "water",
    "strMeasure1": "3/4 cup",
    "strMeasure2": "1/2 cup"
  }
}
```

#### 🔍 O que acontece no código:
```javascript
// Linha 305-318
axios.get('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(function(response) {
        // Sucesso: retorna dados da API externa
        res.json({
            success: true,
            data: response.data.meals[0]
        });
    })
    .catch(function(erro) {
        // Erro: retorna mensagem de erro
        res.status(500).json({
            success: false,
            message: 'Erro ao obter receita externa'
        });
    });
```

**Pontos importantes para a apresentação:**
- ✅ Usa **Axios** para fazer requisição HTTP
- ✅ URL externa: `https://www.themealdb.com/api/json/v1/1/random.php`
- ✅ `.then()` para processar resposta
- ✅ `.catch()` para tratar erros
- ✅ Retorna dados externos formatados em JSON

---

### ✅ TESTE 8: Pesquisar na API Externa

**O que testa:** Chamada a serviço externo com parâmetros
**Endpoint:** `GET /api/external/search/:term`
**Código fonte:** `src/routes/apiRoutes.js:322-340`

#### Passo a passo:
1. Abra: **"6. API Externa (TheMealDB)" → "Pesquisar Receita Externa"**
2. URL já vem com: `http://localhost:3000/api/external/search/chicken`
3. Pode mudar "chicken" para outro termo (ex: "pasta", "beef")
4. Clique em **"Send"**

#### ✅ Resposta esperada (Status 200):
```json
{
  "success": true,
  "data": [
    {
      "idMeal": "52940",
      "strMeal": "Brown Stew Chicken",
      "strCategory": "Chicken",
      "strArea": "Jamaican",
      "strInstructions": "...",
      "strMealThumb": "https://www.themealdb.com/images/media/meals/..."
    }
  ]
}
```

#### 🔍 O que acontece no código:
```javascript
// Linha 323-324
const termo = req.params.term; // Extrai "chicken" da URL
const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + termo;

// Linha 326
axios.get(url) // Faz chamada com termo de pesquisa
```

---

### ✅ TESTE 9: Listar Categorias

**O que testa:** Endpoint simples de listagem
**Endpoint:** `GET /api/categorias`
**Código fonte:** `src/routes/apiRoutes.js:264-279`

#### Passo a passo:
1. Abra: **"4. Categorias" → "Listar Todas as Categorias"**
2. Clique em **"Send"**

#### ✅ Resposta esperada (Status 200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Pratos Principais"
    },
    {
      "id": 2,
      "nome": "Sobremesas"
    }
  ]
}
```

---

### ✅ TESTE 10: Listar Ingredientes

**O que testa:** Endpoint simples de listagem
**Endpoint:** `GET /api/ingredientes`
**Código fonte:** `src/routes/apiRoutes.js:284-299`

#### Passo a passo:
1. Abra: **"5. Ingredientes" → "Listar Todos os Ingredientes"**
2. Clique em **"Send"**

#### ✅ Resposta esperada (Status 200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Bacalhau"
    },
    {
      "id": 2,
      "nome": "Batata"
    }
  ]
}
```

---

## 📊 RESUMO DOS TESTES

| # | Teste | Método | Requer JWT? | Status |
|---|-------|--------|-------------|--------|
| 1 | Login | POST | ❌ | 200 |
| 2 | Listar Receitas | GET | ❌ | 200 |
| 3 | Obter Receita | GET | ❌ | 200 |
| 4 | Criar Receita | POST | ✅ | 201 |
| 5 | Atualizar Receita | PUT | ✅ | 200 |
| 6 | Eliminar Receita | DELETE | ✅ | 200 |
| 7 | API Externa - Random | GET | ❌ | 200 |
| 8 | API Externa - Search | GET | ❌ | 200 |
| 9 | Listar Categorias | GET | ❌ | 200 |
| 10 | Listar Ingredientes | GET | ❌ | 200 |

---

## 🎯 DEMONSTRAÇÃO PARA O PROFESSOR

### Cenário 1: "Mostre uma chamada a um serviço"
1. Execute o **Teste 7** (API Externa - Random)
2. Mostre o código em `src/routes/apiRoutes.js:305`
3. Explique: "Aqui usamos Axios para chamar a API TheMealDB"
4. Mostre a resposta no Postman

### Cenário 2: "Como funciona a autenticação?"
1. Execute o **Teste 1** (Login)
2. Mostre o token retornado
3. Abra `src/middleware/auth.js:17-30` - função `gerarToken()`
4. Explique: "Criamos um JWT com jwt.sign() usando uma secret"
5. Execute o **Teste 4** (Criar Receita)
6. Mostre o header Authorization no Postman
7. Abra `src/middleware/auth.js:131-163` - middleware `protegerRotaAPI()`
8. Explique: "Antes de executar a rota, verificamos o token"

### Cenário 3: "Mostre um CRUD completo"
1. **Create:** Teste 4 - Criar receita
2. **Read:** Teste 3 - Obter receita criada
3. **Update:** Teste 5 - Atualizar receita
4. **Delete:** Teste 6 - Eliminar receita

---

## 🐛 RESOLUÇÃO DE PROBLEMAS

### Erro: "connect ECONNREFUSED ::1:3000"
**Solução:** O servidor não está rodando. Execute `npm start`

### Erro: "Token não fornecido"
**Solução:** Faça o Teste 1 (Login) primeiro para obter o token

### Erro: "Receita não encontrada"
**Solução:** Verifique se o ID existe na base de dados

### Erro: "Cannot POST /api/receitas"
**Solução:** Verifique se selecionou o método correto (POST, não GET)

---

## 📝 NOTAS IMPORTANTES

1. **Token expira em 24h** (configurado em `src/middleware/auth.js:11`)
2. **Scripts de teste automáticos** salvam o token após login
3. **Variável `{{auth_token}}`** é usada automaticamente nos endpoints protegidos
4. **Base de dados** deve ter dados iniciais para testar listagens

---

## 🎓 DICAS PARA A APRESENTAÇÃO

✅ **Tenha o Postman aberto** durante a apresentação
✅ **Teste TUDO antes** da apresentação
✅ **Mostre o código-fonte** junto com os testes
✅ **Explique o fluxo:** Request → Middleware → Controller → Model → BD → Response
✅ **Destaque o JWT:** Geração no login, verificação nos endpoints protegidos
✅ **Mostre a chamada externa:** Axios + then/catch

**Boa sorte na apresentação! 🚀**
