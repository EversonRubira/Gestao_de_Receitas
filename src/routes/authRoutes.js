// Importar módulos necessários
const express = require('express');
const router = express.Router();

// Importar funções do model
const Utilizador = require('../models/Utilizador');

// Importar middleware
const { redirectIfAuthenticated } = require('../middleware/auth');

// ========== PÁGINA DE LOGIN ==========
// Mostrar formulário de login (só se não estiver logado)
router.get('/login', redirectIfAuthenticated, function(req, res) {
    res.render('login', {
        title: 'Login',
        error: null
    });
});

// Processar formulário de login
router.post('/login', function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    console.log('Tentativa de login:', email);

    // Validar se os campos foram preenchidos
    if (!email || !password) {
        return res.render('login', {
            title: 'Login',
            error: 'Por favor, preencha todos os campos'
        });
    }

    // Buscar utilizador na base de dados
    Utilizador.buscarUtilizadorPorEmail(email, function(erro, utilizador) {
        if (erro) {
            console.error('Erro ao buscar utilizador:', erro);
            return res.render('login', {
                title: 'Login',
                error: 'Erro ao processar login. Tente novamente.'
            });
        }

        // Verificar se o utilizador existe
        if (!utilizador) {
            console.log('Utilizador não encontrado');
            return res.render('login', {
                title: 'Login',
                error: 'Email ou password incorretos'
            });
        }

        // Verificar se a password está correta
        Utilizador.verificarPassword(password, utilizador.password_hash, function(erro, passwordValida) {
            if (erro) {
                console.error('Erro ao verificar password:', erro);
                return res.render('login', {
                    title: 'Login',
                    error: 'Erro ao processar login. Tente novamente.'
                });
            }

            if (!passwordValida) {
                console.log('Password inválida');
                return res.render('login', {
                    title: 'Login',
                    error: 'Email ou password incorretos'
                });
            }

            // Login com sucesso! Criar sessão
            req.session.utilizador = {
                id: utilizador.id,
                nome: utilizador.nome,
                email: utilizador.email,
                tipo: utilizador.tipo
            };

            console.log('Login bem sucedido:', utilizador.nome);

            // Redirecionar conforme o tipo de utilizador
            if (utilizador.tipo === 'admin') {
                res.redirect('/backoffice');
            } else {
                res.redirect('/');
            }
        });
    });
});

// ========== PÁGINA DE REGISTO ==========
// Mostrar formulário de registo (só se não estiver logado)
router.get('/registo', redirectIfAuthenticated, function(req, res) {
    res.render('registo', {
        title: 'Registo',
        error: null
    });
});

// Processar formulário de registo
router.post('/registo', function(req, res) {
    const nome = req.body.nome;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.password_confirm;

    // Validar se todos os campos foram preenchidos
    if (!nome || !email || !password || !passwordConfirm) {
        return res.render('registo', {
            title: 'Registo',
            error: 'Por favor, preencha todos os campos'
        });
    }

    // Verificar se as passwords coincidem
    if (password !== passwordConfirm) {
        return res.render('registo', {
            title: 'Registo',
            error: 'As passwords não coincidem'
        });
    }

    // Verificar se a password tem comprimento mínimo
    if (password.length < 6) {
        return res.render('registo', {
            title: 'Registo',
            error: 'A password deve ter pelo menos 6 caracteres'
        });
    }

    // Verificar se o email já existe
    Utilizador.buscarUtilizadorPorEmail(email, function(erro, utilizadorExiste) {
        if (erro) {
            console.error('Erro ao verificar email:', erro);
            return res.render('registo', {
                title: 'Registo',
                error: 'Erro ao processar registo. Tente novamente.'
            });
        }

        if (utilizadorExiste) {
            return res.render('registo', {
                title: 'Registo',
                error: 'Este email já está registado'
            });
        }

        // Criar o novo utilizador
        const dadosUtilizador = {
            nome: nome,
            email: email,
            password: password,
            tipo: 'user'
        };

        Utilizador.criarUtilizador(dadosUtilizador, function(erro, utilizadorId) {
            if (erro) {
                console.error('Erro ao criar utilizador:', erro);
                return res.render('registo', {
                    title: 'Registo',
                    error: 'Erro ao processar registo. Tente novamente.'
                });
            }

            // Registo com sucesso! Criar sessão
            req.session.utilizador = {
                id: utilizadorId,
                nome: nome,
                email: email,
                tipo: 'user'
            };

            // Redirecionar para a página inicial
            res.redirect('/');
        });
    });
});

// ========== LOGOUT ==========
router.get('/logout', function(req, res) {
    // Destruir a sessão
    req.session.destroy(function(erro) {
        if (erro) {
            console.error('Erro ao fazer logout:', erro);
        }
        res.redirect('/login');
    });
});

// Exportar as rotas para serem usadas no servidor principal
module.exports = router;
