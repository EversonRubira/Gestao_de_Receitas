const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
// Configurar body-parser com charset UTF-8
app.use(bodyParser.urlencoded({ extended: true, charset: 'utf-8' }));
app.use(bodyParser.json({ charset: 'utf-8' }));

// Configurar charset UTF-8 para todas as requisições
app.use((req, res, next) => {
    res.charset = 'utf-8';
    next();
});

// Middleware para arquivos estáticos com charset correto
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css; charset=utf-8');
        } else if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript; charset=utf-8');
        } else if (path.endsWith('.html')) {
            res.set('Content-Type', 'text/html; charset=utf-8');
        }
    }
}));

// Configurar charset UTF-8 para todas as respostas HTML
app.use((req, res, next) => {
    // Interceptar res.render para garantir UTF-8
    const originalRender = res.render;
    res.render = function(view, options, callback) {
        res.set('Content-Type', 'text/html; charset=utf-8');
        originalRender.call(this, view, options, callback);
    };
    next();
});

// Configuração de sessões
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_change_in_production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Mudar para true em produção com HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

// Middleware para disponibilizar dados do utilizador nas views
app.use((req, res, next) => {
    res.locals.utilizador = req.session.utilizador || null;
    next();
});

// Importar rotas
const authRoutes = require('./src/routes/authRoutes');
const backofficeRoutes = require('./src/routes/backofficeRoutes');
const frontofficeRoutes = require('./src/routes/frontofficeRoutes');
const apiRoutes = require('./src/routes/apiRoutes');

// Usar rotas
app.use('/', authRoutes);
app.use('/backoffice', backofficeRoutes);
app.use('/', frontofficeRoutes);
app.use('/api', apiRoutes);

// Rota 404
app.use((req, res) => {
    res.status(404).render('404', { title: 'Página não encontrada' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err.stack);
    res.status(500).render('error', {
        title: 'Erro',
        message: 'Ocorreu um erro no servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
    console.log(`Backoffice: http://localhost:${PORT}/backoffice`);
    console.log(`API: http://localhost:${PORT}/api`);
});

module.exports = app;
