const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const settingGeneralSchema = new mongoose.Schema({ 
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String    
}, {
    timestamps: true
});

const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema, "settings_general");

module.exports = SettingGeneral;