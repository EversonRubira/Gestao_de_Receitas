// Ficheiro com funções de autenticação
// Estas funções verificam se o utilizador tem permissão para aceder a certas páginas

// Função que verifica se o utilizador está logado
function isAuthenticated(req, res, next) {
    // Verifica se existe uma sessão e se tem dados do utilizador
    if (req.session && req.session.utilizador) {
        // Se estiver logado, permite continuar
        next();
    } else {
        // Se não estiver logado, redireciona para a página de login
        res.redirect('/login');
    }
}

// Função que verifica se o utilizador é administrador
function isAdmin(req, res, next) {
    // Verifica se está logado E se é admin
    if (req.session && req.session.utilizador && req.session.utilizador.tipo === 'admin') {
        // Se for admin, permite continuar
        next();
    } else {
        // Se não for admin, redireciona para a página inicial
        res.redirect('/');
    }
}

// Função que redireciona utilizadores já autenticados
// Útil para páginas de login/registo
function redirectIfAuthenticated(req, res, next) {
    // Se já estiver logado
    if (req.session && req.session.utilizador) {
        // Redireciona para a página inicial
        res.redirect('/');
    } else {
        // Se não estiver logado, permite continuar (mostrar login)
        next();
    }
}

// Exportar as funções para serem usadas nas rotas
module.exports = {
    isAuthenticated: isAuthenticated,
    isAdmin: isAdmin,
    redirectIfAuthenticated: redirectIfAuthenticated
};
