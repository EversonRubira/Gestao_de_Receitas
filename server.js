const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_change_in_production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use((req, res, next) => {
    res.locals.utilizador = req.session.utilizador || null;
    next();
});

// Rotas
const authRoutes = require('./src/routes/authRoutes');
const backofficeRoutes = require('./src/routes/backofficeRoutes');
const frontofficeRoutes = require('./src/routes/frontofficeRoutes');
const apiRoutes = require('./src/routes/apiRoutes');

app.use('/', authRoutes);
app.use('/backoffice', backofficeRoutes);
app.use('/', frontofficeRoutes);
app.use('/api', apiRoutes);

// 404
app.use((req, res) => {
    res.status(404).render('404', { title: 'Página não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).send('Erro no servidor');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
    console.log(`Backoffice: http://localhost:${PORT}/backoffice`);
    console.log(`API: http://localhost:${PORT}/api`);
});

module.exports = app;
