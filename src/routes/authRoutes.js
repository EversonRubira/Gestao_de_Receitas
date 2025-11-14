const express = require('express');
const router = express.Router();
const Utilizador = require('../models/Utilizador');
const { redirectIfAuthenticated } = require('../middleware/auth');

// Página de login
router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('login', {
        title: 'Login',
        error: null
    });
});

// Processar login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Tentativa de login:', email);

        if (!email || !password) {
            return res.render('login', {
                title: 'Login',
                error: 'Por favor, preencha todos os campos'
            });
        }

        const utilizador = await Utilizador.findByEmail(email);

        if (!utilizador) {
            console.log('Utilizador não encontrado');
            return res.render('login', {
                title: 'Login',
                error: 'Email ou password incorretos'
            });
        }

        const passwordValida = await Utilizador.verificarPassword(password, utilizador.password_hash);

        if (!passwordValida) {
            console.log('Password inválida');
            return res.render('login', {
                title: 'Login',
                error: 'Email ou password incorretos'
            });
        }

        req.session.utilizador = {
            id: utilizador.id,
            nome: utilizador.nome,
            email: utilizador.email,
            tipo: utilizador.tipo
        };

        console.log('Login bem sucedido:', utilizador.nome);

        if (utilizador.tipo === 'admin') {
            res.redirect('/backoffice');
        } else {
            res.redirect('/');
        }

    } catch (error) {
        console.error('Erro no login:', error);
        res.render('login', {
            title: 'Login',
            error: 'Erro ao processar login. Tente novamente.'
        });
    }
});

// Página de registo
router.get('/registo', redirectIfAuthenticated, (req, res) => {
    res.render('registo', {
        title: 'Registo',
        error: null
    });
});

// Processar registo
router.post('/registo', async (req, res) => {
    try {
        const { nome, email, password, password_confirm } = req.body;

        // Validar campos
        if (!nome || !email || !password || !password_confirm) {
            return res.render('registo', {
                title: 'Registo',
                error: 'Por favor, preencha todos os campos'
            });
        }

        if (password !== password_confirm) {
            return res.render('registo', {
                title: 'Registo',
                error: 'As passwords não coincidem'
            });
        }

        if (password.length < 6) {
            return res.render('registo', {
                title: 'Registo',
                error: 'A password deve ter pelo menos 6 caracteres'
            });
        }

        // Verificar se o email já existe
        const existe = await Utilizador.findByEmail(email);
        if (existe) {
            return res.render('registo', {
                title: 'Registo',
                error: 'Este email já está registado'
            });
        }

        // Criar utilizador
        const utilizadorId = await Utilizador.create({
            nome,
            email,
            password,
            tipo: 'user'
        });

        // Criar sessão
        req.session.utilizador = {
            id: utilizadorId,
            nome,
            email,
            tipo: 'user'
        };

        res.redirect('/');

    } catch (error) {
        console.error('Erro no registo:', error);
        res.render('registo', {
            title: 'Registo',
            error: 'Erro ao processar registo. Tente novamente.'
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
        }
        res.redirect('/login');
    });
});

module.exports = router;
