// ========== SERVIDOR WEB - SISTEMA DE GESTÃO DE RECEITAS ==========

// Importar módulos necessários
const express = require('express');           // Framework web para Node.js
const session = require('express-session');   // Para gerir sessões de utilizadores
const bodyParser = require('body-parser');    // Para processar dados de formulários
const path = require('path');                 // Para trabalhar com caminhos de ficheiros
const fileUpload = require('express-fileupload'); // Para upload de ficheiros

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

// 2. Upload de ficheiros
app.use(fileUpload());

// 3. Servir ficheiros estáticos (CSS, JavaScript, imagens)
// Tudo na pasta 'public' fica acessível no browser
app.use(express.static(path.join(__dirname, 'public')));

// 4. Configurar sessões
// As sessões guardam informação do utilizador entre pedidos
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_change_in_production',
    resave: false,                    // Não regravar sessão se não houver alterações
    saveUninitialized: false,         // Não criar sessão vazia
    cookie: {
        secure: false,                // true só funciona com HTTPS
        maxAge: 1000 * 60 * 60 * 24  // Sessão expira em 24 horas
    }
}));

// 5. Disponibilizar dados do utilizador em todas as páginas
// Assim podemos usar 'utilizador' nas views EJS
app.use(function(req, res, next) {
    res.locals.utilizador = req.session.utilizador || null;
    next();
});

// ========== ROTAS ==========
// Importar ficheiros de rotas
const authRoutes = require('./src/routes/authRoutes');
const backofficeRoutes = require('./src/routes/backofficeRoutes');
const frontofficeRoutes = require('./src/routes/frontofficeRoutes');
const apiRoutes = require('./src/routes/apiRoutes');

// Registar as rotas na aplicação
app.use('/', authRoutes);               // Login, registo, logout
app.use('/backoffice', backofficeRoutes); // Área de administração
app.use('/', frontofficeRoutes);        // Páginas públicas
app.use('/api', apiRoutes);             // API REST

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
