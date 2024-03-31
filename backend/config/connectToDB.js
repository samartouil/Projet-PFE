const mongoose = require("mongoose");

module.exports = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection à MongoDB ");
    }catch (error){
        console.log("Connection échouée à MongoDB!", error);
    }
}