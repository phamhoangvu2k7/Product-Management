module.exports.loginPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error",`Vui lòng nhập email`);
        res.redirect(req.get("referer"));
        return;
    }
    next();
}

module.exports.password = (req, res, next) => {
    if (!req.body.password) {
        req.flash("error",`Vui lòng nhập mật khẩu`);
        res.redirect(req.get("referer"));
        return;
    }
    next();
}