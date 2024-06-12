const mongoose = require('mongoose');

const Project = new mongoose.Schema({
    
id: {
    type: mongoose.Schema.Types.ObjectId,
},
NomProjet:{
    type:String,
    required:true
},
description:{
    type:String 
},
DateDébut:{
    type:Date,

}, 
DateFin:{
    type:Date,

},
BudgetConsacré:{
    type:Number,

},

créerPar:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',


},
Etat:{
    type: Boolean,
    default: false
},
},{
    timestamps:true,
}
);



module.exports = mongoose.model("Projects", Project);