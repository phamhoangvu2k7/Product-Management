const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
    { 
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 1000000
        }
    }, 
    {
        timestamps: true
    }
);

const forgotPassword = mongoose.model("forgotPassword", forgotPasswordSchema, "forgot_password");

module.exports = forgotPassword;