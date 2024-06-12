const asyncHandler= require("express-async-handler"); //package fioudh m tokod testaml trycatch evrytime
const bcrypt = require("bcryptjs");
const { User, validateRegisterUser,validateLoginUser } = require("../models/User");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/authMiddleware");



/**----------------------------------
 * @desc  Register New User
 * @router /api/auth/register
 * @method  POST
 * @access  public
 -------------------------------------*/

const generateToken = (user) =>{
    const token =jwt.sign({user}, process.env.JWT_SECRET, {expiresIn :"1d"})
    /*const decoded=jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)*/
    return jwt.sign({user}, process.env.JWT_SECRET, {expiresIn :"1d"})
};

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
        return res.status(400).json({message:"Utilisateur existe déjà"});
    }


    //4:new user and save it to db
    const createdBy = req.user? req.user._id : null ;
    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        createdBy : createdBy,
    });
    await user.save();

    //5:send a response to client
    res.status(201).json({ message:"Compte créé avec succés" });//201 mta user new created wala new data fel bd

});


//***************************Login***************************//
module.exports.loginUserCtrl = asyncHandler(async(req,res) =>{

    try {
        const { error} = validateLoginUser(req.body);
        if(error){
            return res.status(400).json({message: error.details[0].message});
        }else{
            const user = await User.findOne({email: req.body.email, activated: true})
        
            if(!user){
                res.status(400).json({ message:"Utilisateur introuvable"});
            }else{//check password shih wale
                bcrypt.compare(req.body.password, user.password)

                .then(isMatch=>{
                    if(!isMatch){
                        res.status(400).json({ message:"Mot de passe incorrect"});
                    }else{
                        //generate token
                        const token=  generateToken(user)
                        res.status(200).json({ message:"Connexion réussie" ,
                        _id: user._id, isAdmin: user.isAdmin, profilePhoto: user.profilePhoto, email: user.email, role: user.role,
                        token, username: user.username, password: user.password, phone: user.phone});
                    }
                });
            }
        }
           
        
    } catch (error) {
        res.status(400).json(error.message);
    }

});


module.exports.logout = asyncHandler(async(req,res) =>{
    
     return res.status(200).json({message: "Successfully logged out"});
   
});


