//kifeh theb el user fel BD(model)
const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

//const Schema = mongoose.Schema
//User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true, //tnahi el spaces men kodem w men teli
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
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
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
    phone:{
        type: String,
        maxlength:12,
        default:"+216",
    },
    activated:{
        type: Boolean,
        default: `true`
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Default value for createdBy
    }

},
{//object
    timestamps: true,
});

//3: hash the password
UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }

//chaîne de caractères aléatoire qui est ajoutée au mot de passe avant d'être haché
    const salt = await bcrypt.genSalt(10);
//await indique que cette opération est asynchrone et attend le résultat avant de passer à la ligne suivante
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password =  hashedPassword
})

//User Model
const User =mongoose.model("User", UserSchema);






// validate register
function validateRegisterUser(obj){
    const schema = Joi.object({
        username: Joi.string().trim().min(3).max(100).required(),
        email: Joi.string().trim().min(5).max(100).required().email(),
        role: Joi.string().valid('admin','responsable laboratoire', 'chercheur', 'stagiaire').required(),
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
function validateUpdateUser(obj){
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).email(),
        username: Joi.string().trim().min(2).max(100),
        password: Joi.string().trim().min(8),
        phone: Joi.string().max(12),
    });
    return schema.validate(obj);

}
module.exports={
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser
  
};