const mongoose = require("mongoose");
const Joi = require("joi");

const BudgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    trim: true,
  },
  Etat:{
    type: Boolean,
    default: false
},
});



const Budget = mongoose.model("Budget", BudgetSchema);

function validateBudget(obj){
  const schema = Joi.object({
      name: Joi.string().trim().required(),
    
      });
      
  
  return schema.validate(obj);
}

module.exports = {Budget, validateBudget};
