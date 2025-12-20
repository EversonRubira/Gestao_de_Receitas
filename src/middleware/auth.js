// ========== MIDDLEWARE DE AUTENTICAÇÃO JWT ==========
// Este ficheiro contém todas as funções relacionadas com autenticação
// Usa JWT (JSON Web Tokens) para autenticar utilizadores

const jwt = require('jsonwebtoken');

// Chave secreta para assinar os tokens (vem do ficheiro .env)
const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_jwt_mudar_em_producao';

// Tempo de validade do token (24 horas)
const JWT_EXPIRES_IN = '24h';

// ========== FUNÇÕES JWT ==========

// Função para gerar um token JWT
// Recebe dados do utilizador e retorna um token assinado
function gerarToken(utilizador) {
    const payload = {
        id: utilizador.id,
        email: utilizador.email,
        tipo: utilizador.tipo,
        nome: utilizador.nome
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });

    return token;
}

// Função para verificar se um token é válido
// Recebe token e callback: callback(erro, dados)
function verificarToken(token, callback) {
    jwt.verify(token, JWT_SECRET, function(erro, decoded) {
        if (erro) {
            // Token inválido ou expirado
            return callback(erro, null);
        }
        // Token válido, devolver dados do utilizador
        callback(null, decoded);
    });
}

// Função auxiliar para extrair token do cookie ou header
function extrairToken(req) {
    // Tentar extrair do cookie primeiro (usado pelas páginas web)
    if (req.cookies && req.cookies.token) {
        return req.cookies.token;
    }

    // Tentar extrair do header Authorization (usado pela API)
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }

    return null;
}

// ========== MIDDLEWARES PARA PÁGINAS WEB ==========

// Middleware que verifica se o utilizador está autenticado
// Usado para proteger páginas que precisam de login
// Se não estiver autenticado, redireciona para /login
function isAuthenticated(req, res, next) {
    const token = extrairToken(req);

    if (!token) {
        return res.redirect('/login');
    }

    verificarToken(token, function(erro, dadosUtilizador) {
        if (erro) {
            return res.redirect('/login');
        }

        // Token válido! Guardar dados no request
        req.utilizador = dadosUtilizador;
        next();
    });
}

// Middleware que verifica se o utilizador é administrador
// Usado para proteger páginas do backoffice
// Se não for admin, redireciona para a página inicial
function isAdmin(req, res, next) {
    const token = extrairToken(req);

    if (!token) {
        return res.redirect('/login');
    }

    verificarToken(token, function(erro, dadosUtilizador) {
        if (erro) {
            return res.redirect('/login');
        }

        if (dadosUtilizador.tipo !== 'admin') {
            return res.redirect('/');
        }

        req.utilizador = dadosUtilizador;
        next();
    });
}

// Middleware que redireciona utilizadores já autenticados
// Usado nas páginas de login e registo
// Se já estiver autenticado, redireciona para a página inicial
function redirectIfAuthenticated(req, res, next) {
    const token = extrairToken(req);

    if (!token) {
        return next();
    }

    verificarToken(token, function(erro, dadosUtilizador) {
        if (erro) {
            return next();
        }
        res.redirect('/');
    });
}

// ========== MIDDLEWARES PARA API REST ==========

// Middleware para proteger rotas da API
// Verifica se o pedido tem um token JWT válido
// Se não tiver, retorna erro 401 (Unauthorized)
function protegerRotaAPI(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            erro: 'Token não fornecido. Faça login na API primeiro.'
        });
    }

    // O formato deve ser: "Bearer TOKEN"
    const partes = authHeader.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({
            erro: 'Formato de token inválido. Use: Bearer TOKEN'
        });
    }

    const token = partes[1];

    verificarToken(token, function(erro, dados) {
        if (erro) {
            return res.status(401).json({
                erro: 'Token inválido ou expirado',
                detalhes: erro.message
            });
        }

        // Token válido! Guardar dados no request
        req.utilizador = dados;
        next();
    });
}

// Middleware para verificar se o utilizador da API é admin
// Deve ser usado DEPOIS do protegerRotaAPI
function verificarAdmin(req, res, next) {
    if (!req.utilizador || req.utilizador.tipo !== 'admin') {
        return res.status(403).json({
            erro: 'Acesso negado. Apenas administradores podem fazer isto.'
        });
    }
    next();
}

// ========== EXPORTAR FUNÇÕES ==========

module.exports = {
    // Funções JWT
    gerarToken: gerarToken,
    verificarToken: verificarToken,

    // Middlewares para páginas web
    isAuthenticated: isAuthenticated,
    isAdmin: isAdmin,
    redirectIfAuthenticated: redirectIfAuthenticated,

    // Middlewares para API
    protegerRotaAPI: protegerRotaAPI,
    verificarAdmin: verificarAdmin
};
