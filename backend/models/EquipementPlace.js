const mongoose = require("mongoose");
const Joi = require("joi");



const EtagèreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
   armoireId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Armoire',
    default: null,
   
  }

});


const ArmoireSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  nombreEtagères: {
    type: Number,
    required: true,
  },
  Etat:{
    type: Boolean,
    default: false
},

});

const Etagère = mongoose.model("Etagère", EtagèreSchema);
const Armoire = mongoose.model("Armoire", ArmoireSchema)



function validatePlace(obj){
  const schema = Joi.object({
      name: Joi.string().trim().required(),
      armoireId: Joi.string().hex().length(24),

      });
      
  
  return schema.validate(obj);
}



module.exports = {Etagère, Armoire,validatePlace};

