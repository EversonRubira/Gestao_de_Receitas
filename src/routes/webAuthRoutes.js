// ========== ROTAS DE AUTENTICAÇÃO WEB ==========
// Este ficheiro contém as rotas de autenticação para o website (HTML)
// Para autenticação da API (JSON), ver apiRoutes.js

// Importar módulos necessários
const express = require('express');
const router = express.Router();

// Importar funções do model
const Utilizador = require('../models/Utilizador');

// Importar middleware e funções JWT
const { redirectIfAuthenticated, gerarToken } = require('../middleware/auth');

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

            // Login com sucesso! Gerar token JWT
            const token = gerarToken({
                id: utilizador.id,
                email: utilizador.email,
                tipo: utilizador.tipo,
                nome: utilizador.nome
            });

            console.log('Login bem sucedido:', utilizador.nome);

            // Determinar para onde redirecionar
            const redirecionarPara = utilizador.tipo === 'admin' ? '/backoffice' : '/';

            // Definir cookie com o token (válido por 24 horas)
            res.cookie('token', token, {
                httpOnly: true,      // Não acessível via JavaScript (mais seguro)
                maxAge: 24 * 60 * 60 * 1000  // 24 horas em milissegundos
            });

            // Enviar página HTML que armazena o token e redireciona
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Login - Redirecionando...</title>
                </head>
                <body>
                    <p>Login bem-sucedido! Redirecionando...</p>
                    <script>
                        // Guardar token no localStorage (para uso da API)
                        localStorage.setItem('token', '${token}');

                        // Guardar dados do utilizador
                        localStorage.setItem('utilizador', JSON.stringify({
                            id: ${utilizador.id},
                            nome: '${utilizador.nome}',
                            email: '${utilizador.email}',
                            tipo: '${utilizador.tipo}'
                        }));

                        // Redirecionar
                        window.location.href = '${redirecionarPara}';
                    </script>
                </body>
                </html>
            `);
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

            // Registo com sucesso! Gerar token JWT
            const token = gerarToken({
                id: utilizadorId,
                email: email,
                tipo: 'user',
                nome: nome
            });

            // Definir cookie com o token (válido por 24 horas)
            res.cookie('token', token, {
                httpOnly: true,      // Não acessível via JavaScript (mais seguro)
                maxAge: 24 * 60 * 60 * 1000  // 24 horas em milissegundos
            });

            // Enviar página HTML que armazena o token e redireciona
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Registo - Redirecionando...</title>
                </head>
                <body>
                    <p>Registo bem-sucedido! Redirecionando...</p>
                    <script>
                        // Guardar token no localStorage (para uso da API)
                        localStorage.setItem('token', '${token}');

                        // Guardar dados do utilizador
                        localStorage.setItem('utilizador', JSON.stringify({
                            id: ${utilizadorId},
                            nome: '${nome}',
                            email: '${email}',
                            tipo: 'user'
                        }));

                        // Redirecionar para a página inicial
                        window.location.href = '/';
                    </script>
                </body>
                </html>
            `);
        });
    });
});

// ========== LOGOUT ==========
router.get('/logout', function(req, res) {
    // Limpar o cookie do token
    res.clearCookie('token');

    // Enviar página HTML que limpa o localStorage e redireciona
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Logout - Redirecionando...</title>
        </head>
        <body>
            <p>A terminar sessão...</p>
            <script>
                // Limpar token e dados do utilizador do localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('utilizador');

                // Redirecionar para a página de login
                window.location.href = '/login';
            </script>
        </body>
        </html>
    `);
});

// Exportar as rotas para serem usadas no servidor principal
module.exports = router;
