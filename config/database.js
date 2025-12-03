const mogoose = require("mongoose");

module.exports.connect = async () => {
    try {
        await mogoose.connect(process.env.MONGO_URL);
        console.log("Connect success");
    } catch (error) {
        console.log("Connect error"); 
    }
}