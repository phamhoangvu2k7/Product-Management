const Account = require("../../models/account_model");
const Role = require("../../models/role_model");
const systemConfig = require("../../config/system");
const md5 = require("md5");

// [GET] /admin/account
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await Account.find(find).select("-password -token");

    for (const record of records) {
        const role = await Role.findOne({
            deleted: false,
            _id: record.role_id
        });
        record.role = role;
    }

    res.render("admin/pages/account/index", {
        pageTitle: "Trang tổng quan",
        record: records
    });
}

// [GET] /admin/account/create
module.exports.create = async (req, res) => {
    const role = await Role.find({
        deleted: false
    });

    res.render("admin/pages/account/create", {
        pageTitle: "Thêm mới tài khoản",
        role: role
    });
}

// [POST] /admin/account/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại!`);
        res.redirect(req.get("referer"));
    } else {
        req.body.password = md5(req.body.password);
    
        const record = new Account(req.body);
        await record.save();
    
        res.redirect(`${systemConfig.prefixAdmin}/account`);
    }
}

// [GET] /admin/account/edit
module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false
    }

    try {
        const data = await Account.findOne(find);

        const roles = await Role.find({
            deleted: false
        });

        res.render("admin/pages/account/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles
        });

    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/account`);
    }
}

// [GET] /admin/account/detail
module.exports.detail = async(req, res) => {
    try {
        const id = req.params.id;
        
        const datas = await Account.findOne({
            _id: id,
            deleted: false
        });

        const roles = await Role.findOne({
            _id: datas.role_id,
            deleted: false
        })
        
        res.render("admin/pages/account/detail", {
            pageTitle: "Chi tiết tài khoản",
            data: datas,
            role: roles
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/account`);
    }
}

// [DELETE] /admin/account/delete
module.exports.deleteAccount = async (req, res) => {
    const id = req.params.id;

    await Account.updateOne({_id: id}, {
        deleted: true
    });

    req.flash("success", "Xóa tài khoản thành công");
    res.redirect(req.get("referer"));
}