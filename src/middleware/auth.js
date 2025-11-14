// Middleware de autenticação

// Verifica se o utilizador está logado
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.utilizador) {
        return next();
    }

    if (req.path.startsWith('/api/')) {
        return res.status(401).json({
            success: false,
            message: 'Não autenticado'
        });
    }

    res.redirect('/login');
};

// Verifica se é administrador
const isAdmin = (req, res, next) => {
    if (req.session && req.session.utilizador && req.session.utilizador.tipo === 'admin') {
        return next();
    }

    if (req.path.startsWith('/api/')) {
        return res.status(403).json({
            success: false,
            message: 'Acesso negado'
        });
    }

    res.redirect('/');
};


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
