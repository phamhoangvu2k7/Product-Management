const SettingGeneral = require("../../models/settings_general_model");

module.exports.SettingGeneral = async (req, res, next) => {
    const settingGeneral = await SettingGeneral.findOne({});
    res.locals.settingGeneral = settingGeneral;

    next();
}