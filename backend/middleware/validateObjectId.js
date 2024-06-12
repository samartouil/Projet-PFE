const mongoose = require("mongoose");
//mongoose yaaml el etisal bin el db wel express

module.exports = (req, res,next) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({message: " id invalide"});
    }
    next();
}