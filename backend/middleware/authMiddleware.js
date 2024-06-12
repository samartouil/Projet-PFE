// Importer les packages nécessaires
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");


// Middleware pour vérifier le token d'authentification
//nestamalha fel logout
const verifyToken = asyncHandler(async (req, res, next) => {
    // Récupérer le token depuis les en-têtes de la requête
    const authToken = req.headers.authorization;

    // Vérifier si le token est présent
    if (!authToken) {
        return res.status(401).json({ message: "Unauthorized: Token is missing" });
    }
    //split(" ") trodhelek array w tkasem win fama " "
    const token = authToken.split(" ")[1];
    try {
        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user ={
            _id: decoded.user._id,
            photo:decoded.user.profilePhoto,
            username: decoded.user.username,
            email: decoded.user.email,
            phone:decoded.user.phone,
            role: decoded.user.role,
            isAdmin: decoded.user.isAdmin,
            activated: decoded.user.activated,
            createdBy: decoded.user.createdBy
        }
        req.user = user;
       
        next(); // Passer au middleware suivant
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
});



//verify token and only user himself
function verifyTokenAndOnlyUser(req,res,next){
    verifyToken(req, res, () => {
        if (req.user._id === req.params.id){
            next();
        }else{
            return res.status(403).json({message: "Non autorisé, seulement l'utilisateur concerné"});
        }
    });
}

function verifyTokenAndOnlyAdmin(req,res,next){
    verifyToken(req, res, () => {
        if (req.user.role === 'admin'){
            next();
        }else{
            return res.status(403).json({message: "Non autorisé, seulement l'administrateur"});
        }
    });
}




module.exports = {verifyToken, verifyTokenAndOnlyUser, verifyTokenAndOnlyAdmin};