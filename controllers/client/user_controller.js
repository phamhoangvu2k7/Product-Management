const generateHelper = require("../../helpers/generate");
const User = require("../../models/user_model");
const ForgotPassword = require("../../models/forgot_password_model");
const md5 = require("md5");
const sendMailHelper = require("../../helpers/sendMail");

module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
    });
}

module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email
    });

    if (existEmail) {
        req.flash("error", "email đã tồn tại");
        res.redirect(req.get("referer"));
        return;
    }
    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}

module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập"
    });
}

module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect(req.get("referer"));
        return;
    }

    if (md5(password) !== user.password) {
        req.flash("error", "Mật khẩu sai");
        res.redirect(req.get("referer"));
        return;
    }

    if (user.status === "inactive") {
        req.flash("error", "Tài khoản đang bị khóa");
        res.redirect(req.get("referer"));
        return;
    }

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

module.exports.logout = (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}

module.exports.forgotPassword = (req, res) => {
    res.render("client/pages/user/forgot_password", {
        pageTitle: "Lấy lại mật khẩu"
    });
}

module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect(req.get("referer"));
        return;
    }

    // Save otp in database before send
    const otp = generateHelper.generateRandomNumber(7);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Send OTP to email    
    const subject = "Mã OTP xác minh";
    const html = `
        Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút
    `;

    sendMailHelper.sendMail(email, subject, html);
    console.log(`OTP: ${otp}`);
    res.redirect(`/user/password/otp?email=${email}`);
}

module.exports.otp = (req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/otp", {
        pageTitle: "Nhập mã OTP",
        email: email
    });
}

module.exports.otpPost = async (req, res) => {
    const { email, otp } = req.body;

    const account = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if (!account) {
        req.flash("error", "Mã otp sai");
        res.redirect(req.get("referer"));
        return;
    }

    const user = await User.findOne({
        email: email
    })

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");
}

module.exports.resetPassword = (req, res) => {
    res.render("client/pages/user/reset_password", {
        pageTitle: "Đổi mật khẩu"
    });
}

module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const confirm = req.body.confirmPassword;
    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser
    }); 

    if (password == confirm) {
        user.password = md5(password);
        await user.save();
    }

    res.redirect("/");
}