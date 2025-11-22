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
    req.flash("success", "Cập nhật thành công");

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

// [GET] /admin/role/edit
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

// [PATCH] /admin/role/edit
module.exports.editPatch = async (req, res) => {    
    const id = req.params.id;
    
    await Role.updateOne({_id: id}, req.body);

    req.flash("success", "Cập nhật thành công");

    res.redirect(`${systemConfig.prefixAdmin}/role`);
}

// [DELETE] /admin/role/delete/:id
module.exports.deletePermission = async (req, res) => {
    const id = req.params.id;

    await Role.updateOne({_id: id}, {
        deleted: true
    });
    req.flash("success", `Xóa nhóm quyền thành công`);

    res.redirect(req.get("referer"));
}

// [PATCH] /admin/role/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (type) {
        case "active":
            await Role.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash("success", `Cập nhật trạng thái của ${ids.length} sản phẩm thành công`);
            break;

        case "inactive":
            await Role.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash("success", `Cập nhật trạng thái của ${ids.length} sản phẩm thành công`);
            break;

        case "delete-all":
            await Role.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success", `Xóa ${ids.length} sản phẩm thành công`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split('-');
                position = parseInt(position);
                await Role.updateOne({ _id: id }, { position: position });
            }
            req.flash("success", `Cập nhật vị trí của ${ids.length} sản phẩm thành công`);
            break;
        default:
            break;
    }

    res.redirect(req.get("referer"));
}