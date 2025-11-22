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

// [GET] /admin/role/detail
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const records = await Role.findOne({
            _id: id,
            deleted: false
        });
        
        res.render("admin/pages/role/detail", {
            pageTitle: "Chi tiết nhóm quyền",
            record: records
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/role`);
    }
}

module.exports.edit = async (req, res) => {
    const id = req.params.id;
    
    const data = await Role.findOne({
        _id: id,
        deleted: false
    });

    res.render("admin/pages/role/edit", {
        pageTitle: "Chỉnh sửa nhóm quyền",
        data: data
    });
}

module.exports.editPatch = async (req, res) => {    
    const id = req.params.id;
    
    await Role.updateOne({_id: id}, req.body);

    res.redirect(`${systemConfig.prefixAdmin}/role`);
}