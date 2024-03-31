//kifeh theb el user fel BD(model)
const mongoose = require("mongoose");
const Joi = require("joi");
//const Schema = mongoose.Schema


//User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true, //tnahi el faragh men kodem w men teli
        minlength: 3,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 100,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true, 
        minlength: 8,
    },
    profilePhoto: {
        type: Object,
        default:{
            url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
            publicId: null,
        }
    },
    role: {
        type: String,
        required:true,
        enum: ['admin', 'responsable laboratoire', 'chercheur', 'stagiaire'],
        default: 'stagiaire',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },

},
{//object
    timestamps: true,
});

//User Model
const User =mongoose.model("User", UserSchema);






// validate register
function validateRegisterUser(obj){
    const schema = Joi.object({
        username: Joi.string().trim().min(3).max(100).required(),
        email: Joi.string().trim().min(5).max(100).required().email(),
        role: Joi.string().valid('admin','responsableLaboratoire', 'chercheur', 'stagiaire').required(),
        password: Joi.string().trim().min(8).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().label('Confirm password').messages({
            'any.only': '{{#label}} does not match password',
        }),
        
    })
    return schema.validate(obj);
}

//validate Login
    function validateLoginUser(obj){
        const schema = Joi.object({
            email: Joi.string().trim().min(5).max(100).required().email(),
            password: Joi.string().trim().required(),
            
        });
        return schema.validate(obj);

}

module.exports={
    User,
    validateRegisterUser,
    validateLoginUser
  
};