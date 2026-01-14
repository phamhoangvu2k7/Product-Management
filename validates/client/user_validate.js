module.exports.registerPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error",`Vui lòng nhập tên`);
        res.redirect(req.get("referer"));
        return;
    }

    if (!req.body.email) {
        req.flash("error",`Vui lòng nhập email`);
        res.redirect(req.get("referer"));
        return;
    }

    if (!req.body.password) {
        req.flash("error",`Vui lòng nhập mật khẩu`);
        res.redirect(req.get("referer"));
        return;
    }
    next();
}

module.exports.loginPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error",`Vui lòng nhập email`);
        res.redirect(req.get("referer"));
        return;
    }

    if (!req.body.password) {
        req.flash("error",`Vui lòng nhập mật khẩu`);
        res.redirect(req.get("referer"));
        return;
    }
    next();
}

module.exports.forgotPassword = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error",`Vui lòng nhập email`);
        res.redirect(req.get("referer"));
        return;
    }
    next();
}

module.exports.resetPassword = (req, res, next) => {
    const password = req.body.password;
    const confirm = req.body.confirmPassword;

    if (password != confirm || !password || !confirm) {
        req.flash("error",`Vui lòng nhập lại mật khẩu`);
        res.redirect(req.get("referer"));
        return;
    }

    next();
}