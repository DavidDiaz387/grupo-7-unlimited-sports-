function redirigirUsuario(req, res, next) {
    res.redirect('/users/login');
    next();
}

module.exports = redirigirUsuario;