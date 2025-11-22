const Role = require("../../models/role_model")
const systemConfig = require("../../config/system");

// [GET] /admin/role
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await Role.find(find);

    res.render("admin/pages/role/index", {
        pageTitle: "Nhóm quyền",
        record: records
    });
}

// [GET] /admin/role/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/role/create", {
        pageTitle: "Thêm nhóm quyền"
    });
}

// [POST] /admin/role/create
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/role`);
}