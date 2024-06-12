//kifeh theb el user fel BD(model)
const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

//const Schema = mongoose.Schema
//User Schema
const EquipementSchema = new mongoose.Schema({
    EQname: {
        type: String,
        required: true,
        trim: true, //tnahi el spaces men kodem w men teli
        minlength: 3,
        maxlength: 100,
    },
    EQdescription: {
        type: String,
        maxlength: 500,
        default: '',
    },
    EQstock: {
        type: Number,
        required: true,
        trim: true,

    },
    NbrDefaillant: {
        type: Number,
        default: 0,

    },
    EQsecuriteStock: {
        type: Number,
        default: 0,
        min: 0
    },
    estEnDessousDuStockSecurite: {
        type: Boolean,
        default: false
    },
    EQprix: {
        type: Number,
       
        trim: true,

    },
    EQplace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Etagère',
        default: null,
        required: true,
    },


    EQphoto: {
        type: Object,
        default: {
            url: "https://pixabay.com/fr/vectors/%C3%A9br%C3%A9cher-ic%C3%B4ne-micro-processeur-1710300/",
            publicId: null,
        }
    },
    EQtype: {
        type: String,
        required: true,
        trim: true,
        enum: ['composé', 'simple'],

    },



    EQbudget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget',
        default: null
    },

    isValid: {
        type: Boolean,
        default: `true`
    },
    Etat:{
        type: Boolean,
        default: false
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





//User Model
const Equipement = mongoose.model("Equipement", EquipementSchema);






// validate  equipement
function validateEquipement(obj) {
    const schema = Joi.object({
        EQname: Joi.string().trim().min(3).max(100).required(),
        EQdescription: Joi.string().max(500).allow(''),
        EQstock: Joi.number().required(),
        EQsecuriteStock: Joi.number(),
        EQprix: Joi.number().allow(null).empty(''),
        EQplace: Joi.string().hex().length(24).required(),
        EQtype: Joi.string().valid('composé', 'simple').required(),
        EQbudget: Joi.string().hex().length(24),
        NbrDefaillant: Joi.number(),

    });


    return schema.validate(obj);
}

module.exports = {
    Equipement,
    validateEquipement

};