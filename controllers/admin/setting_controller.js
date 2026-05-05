const SettingGeneral = require("../../models/settings_general_model");

module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    res.render("admin/pages/setting/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral
    });
}

module.exports.generalPatch = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    if(settingGeneral) {
        await SettingGeneral.updateOne({
            _id: settingGeneral.id
        }, req.body);
    }
    else {
        const record = new SettingGeneral(req.body);
        await record.save();
    }

    req.flash("success", "Cập nhật cài đặt chung thành công!");
    res.redirect(req.get("referer"));
}

