var ensureAuth = function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        req.flash("info", "Anda belum login");
        res.redirect("/login");
    }
}

module.exports = {ensureAuthenticated: ensureAuth}