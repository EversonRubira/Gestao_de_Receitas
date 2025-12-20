// ========== SERVIDOR WEB - SISTEMA DE GESTÃO DE RECEITAS ==========

// Importar módulos necessários
const express = require('express');           // Framework web para Node.js
const bodyParser = require('body-parser');    // Para processar dados de formulários
const path = require('path');                 // Para trabalhar com caminhos de ficheiros
const fileUpload = require('express-fileupload'); // Para upload de ficheiros
const cookieParser = require('cookie-parser'); // Para ler cookies

// Carregar variáveis de ambiente do ficheiro .env
require('dotenv').config();

// Criar a aplicação Express
const app = express();

// Definir porta do servidor (3000 por defeito)
const PORT = process.env.PORT || 3000;

// ========== CONFIGURAÇÕES ==========

// Configurar motor de templates (EJS)
// EJS permite criar páginas HTML dinâmicas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ========== MIDDLEWARES ==========
// Middlewares são funções que processam pedidos HTTP

// 1. Body Parser - processar dados de formulários
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 2. Cookie Parser - processar cookies
app.use(cookieParser());

// 3. Upload de ficheiros
app.use(fileUpload());

// 4. Servir ficheiros estáticos (CSS, JavaScript, imagens)
// Tudo na pasta 'public' fica acessível no browser
app.use(express.static(path.join(__dirname, 'public')));

// 5. Middleware para disponibilizar dados do utilizador nas views
// Extrai o token do cookie e decodifica para usar nos templates EJS
const { verificarToken } = require('./src/middleware/auth');
app.use(function(req, res, next) {
    // Tentar extrair token do cookie
    const token = req.cookies.token;

    if (!token) {
        // Sem token, utilizador não está autenticado
        res.locals.utilizador = null;
        return next();
    }

    // Verificar e decodificar o token
    verificarToken(token, function(erro, dadosUtilizador) {
        if (erro) {
            // Token inválido, utilizador não está autenticado
            res.locals.utilizador = null;
        } else {
            // Token válido, disponibilizar dados nas views
            res.locals.utilizador = dadosUtilizador;
        }
        next();
    });
});

// ========== ROTAS ==========
// Importar ficheiros de rotas
const webAuthRoutes = require('./src/routes/webAuthRoutes');
const backofficeRoutes = require('./src/routes/backofficeRoutes');
const frontofficeRoutes = require('./src/routes/frontofficeRoutes');
const apiRoutes = require('./src/routes/apiRoutes');

// Registar as rotas na aplicação
app.use('/', webAuthRoutes);            // Autenticação WEB (login, registo, logout)
app.use('/backoffice', backofficeRoutes); // Área de administração
app.use('/', frontofficeRoutes);        // Páginas públicas
app.use('/api', apiRoutes);             // API REST (retorna JSON)

// ========== TRATAMENTO DE ERROS ==========

// Página 404 - quando a rota não existe
app.use(function(req, res) {
    res.status(404).render('404', {
        title: 'Página não encontrada'
    });
});

// Tratamento de erros gerais
app.use(function(erro, req, res, next) {
    console.error('Erro:', erro);
    res.status(500).send('Erro no servidor');
});

// ========== INICIAR SERVIDOR ==========
app.listen(PORT, function() {
    
    console.log('Servidor a correr em http://localhost:' + PORT);
    console.log('Backoffice: http://localhost:' + PORT + '/backoffice');
    console.log('API: http://localhost:' + PORT + '/api');
    
});

// Exportar a aplicação para poder ser usada noutros ficheiros
module.exports = app;
