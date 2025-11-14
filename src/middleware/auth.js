// Middleware de autenticação
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.utilizador) {
        return next();
    }

    // Se for uma chamada API, retorna JSON
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({
            success: false,
            message: 'Não autenticado. Por favor, faça login.'
        });
    }

    // Se for uma página, redireciona para login
    res.redirect('/login');
};

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
    if (req.session && req.session.utilizador && req.session.utilizador.tipo === 'admin') {
        return next();
    }

    if (req.path.startsWith('/api/')) {
        return res.status(403).json({
            success: false,
            message: 'Acesso negado. Permissões de administrador necessárias.'
        });
    }

    res.redirect('/');
};

// Middleware para verificar se já está autenticado
const redirectIfAuthenticated = (req, res, next) => {
    if (req.session && req.session.utilizador) {
        return res.redirect('/');
    }
    next();
};

module.exports = {
    isAuthenticated,
    isAdmin,
    redirectIfAuthenticated
};
