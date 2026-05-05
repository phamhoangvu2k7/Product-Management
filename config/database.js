const mongoose = require("mongoose");

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: process.env.MONGO_NAME,
        });
        console.log("Connect success");
    } catch (error) {
        console.log("Connect error:", error); 
    }
}