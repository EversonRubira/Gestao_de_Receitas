// ========== MIDDLEWARE DE AUTENTICAÇÃO JWT ==========
// JWT = JSON Web Token
// Usado para proteger as rotas da API (/api/*)

const jwt = require('jsonwebtoken');

// Chave secreta para assinar os tokens
// Em produção, isto deve estar no ficheiro .env
const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_jwt_mudar_em_producao';

// Tempo de validade do token (24 horas)
const JWT_EXPIRES_IN = '24h';

// ========== FUNÇÃO: GERAR TOKEN JWT ==========
// Cria um token JWT para um utilizador
// O token contém os dados do utilizador (id, email, tipo)
function gerarToken(utilizador) {
    // Dados que vão dentro do token
    const payload = {
        id: utilizador.id,
        email: utilizador.email,
        tipo: utilizador.tipo
    };

    // Criar o token assinado com a chave secreta
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });

    return token;
}

// ========== FUNÇÃO: VERIFICAR TOKEN JWT ==========
// Verifica se um token é válido
// Callback: callback(erro, dados)
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

// ========== MIDDLEWARE: PROTEGER ROTAS DA API ==========
// Este middleware verifica se o pedido tem um token JWT válido
// Se sim, deixa passar. Se não, bloqueia com erro 401.
function protegerRotaAPI(req, res, next) {
    // O token deve vir no header "Authorization" assim:
    // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

    const authHeader = req.headers['authorization'];

    // Verificar se o header existe
    if (!authHeader) {
        return res.status(401).json({
            erro: 'Token não fornecido. Faça login na API primeiro.'
        });
    }

    // O formato é: "Bearer TOKEN"
    // Vamos separar e pegar só o TOKEN
    const partes = authHeader.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({
            erro: 'Formato de token inválido. Use: Bearer TOKEN'
        });
    }

    const token = partes[1];

    // Verificar se o token é válido
    verificarToken(token, function(erro, dados) {
        if (erro) {
            return res.status(401).json({
                erro: 'Token inválido ou expirado',
                detalhes: erro.message
            });
        }

        // Token válido! Guardar dados do utilizador no request
        req.utilizador = dados;

        // Deixar o pedido continuar
        next();
    });
}

// ========== MIDDLEWARE: VERIFICAR SE É ADMIN ==========
// Este middleware verifica se o utilizador autenticado é admin
// Deve ser usado DEPOIS do protegerRotaAPI
function verificarAdmin(req, res, next) {
    // O protegerRotaAPI já colocou os dados em req.utilizador
    if (!req.utilizador || req.utilizador.tipo !== 'admin') {
        return res.status(403).json({
            erro: 'Acesso negado. Apenas administradores podem fazer isto.'
        });
    }

    next();
}

// Exportar as funções para usar noutros ficheiros
module.exports = {
    gerarToken: gerarToken,
    verificarToken: verificarToken,
    protegerRotaAPI: protegerRotaAPI,
    verificarAdmin: verificarAdmin
};
