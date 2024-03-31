const asyncHandler= require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateRegisterUser,validateLoginUser } = require("../models/User");
const { response } = require("express");


/**----------------------------------
 * @desc  Register New User
 * @router /api/auth/register
 * @method  POST
 * @access  public
 -------------------------------------*/

//**********************Register*******************//
module.exports.registerUserCtrl = asyncHandler(async(req,res) =>{

    //1:validation
    const { error } = validateRegisterUser(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message});
    }

    //2:is user already exists
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({message:"user already exist"});
    }


    //3: hash the password
    //chaîne de caractères aléatoire qui est ajoutée au mot de passe avant d'être haché
    const salt = await bcrypt.genSalt(10);
    //await indique que cette opération est asynchrone et attend le résultat avant de passer à la ligne suivante
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //4:new user and save it to db
    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
    });
    await user.save();

    //5:send a response to client
    res.status(201).json({ message:"you registered successfully"});

});


//***************************Login***************************//
module.exports.loginUserCtrl = asyncHandler(async(req,res) =>{

    try {
        const { error} = validateLoginUser(req.body);
        if(error){
            return res.status(400).json({message: error.details[0].message});
        }else{
            User.findOne({email: req.body.email})
            .then(user=>{
            if(!user){
                res.status(400).json({ message:"not found user"});
            }else{
                bcrypt.compare(req.body.password, user.password)
                .then(isMatch=>{
                    if(!isMatch){
                        res.status(400).json({ message:"incorrect password"});
                    }else{
                        res.send("identique")
                    }
                })
            }
        })
           
        }
    } catch (error) {
        res.status(400).json(error.message);
    }

});