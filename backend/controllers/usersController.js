const asyncHandler = require("express-async-handler"); //package fioudh m tokod testaml trycatch evrytime
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { url } = require("inspector");

/**----------------------------------
 * @desc  Get All Users Profile
 * @router /api/users/profile
 * @method  GET
 * @access  private (only admin)
 -------------------------------------*/

module.exports.getUsers = asyncHandler(async (req, res) => {

  const users = await User.find({activated: true});
  return res.status(200).json(users);
});


module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};

        if (req.user.isAdmin) {
            query.role = { $ne: 'admin' }; 
        } else {
            query.createdBy = req.user._id; 
        }

        if (role) {
            query.role = role; 
        }

        const users = await User.find(query).select("-password");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
    }
});




/**----------------------------------
 * @desc  Get User Profile
 * @router /api/users/profile/:id 
 * @method  GET
 * @access  public
 -------------------------------------*/

module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  } else {
    res.status(200).json(user);
  }

});


/**----------------------------------
 * @desc  Update User Profile
 * @router /api/users/profile/:id 
 * @method  PUT
 * @access  private (only user himself)
 -------------------------------------*/
module.exports.updateUserProfile = asyncHandler(async (req, res) => {
  console.log("Request data:", req.body);
  //validation lel forme
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //validation ken badel mot de passe
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  //update
  const updatedUser = await User.findByIdAndUpdate(req.params.id, {
    $set: {

      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
    }
    //new true yani rajali el user el jdid
  }, { new: true });
  console.log("Updated user:", updatedUser);
  res.status(200).json(updatedUser);
});


/**----------------------------------
 * @desc  Changer Etat User Profile
 * @router /api/users/profile/:id 
 * @method  PUT
 * @access  private (only user himself)
 -------------------------------------*/
module.exports.activateUserProfile = asyncHandler(async (req, res) => {
  console.log(req.body.activated)
  const updatedUser = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      activated: req.body.activated,
    }


  });

  res.status(200).json(updatedUser);

});


/**----------------------------------
* @desc  Get Users Count
* @router /api/users/count
* @method  GET
* @access  public
-------------------------------------*/

module.exports.getAllUsersCountCtrl = asyncHandler(async (req, res) => {

  if (req.user.isAdmin) {
    //find heya eli tjib all users mel db
    const countAll = await User.countDocuments();
    const countResponsable = await User.countDocuments({ role: "responsable laboratoire" });
    const countChercheur = await User.countDocuments({ role: "chercheur" });
    const countStagiaire = await User.countDocuments({ role: "stagiaire" });
    const response = {
      total: countAll,
      responsable_laboratoire: countResponsable,
      chercheur: countChercheur,
      stagiaire: countStagiaire,
    };

    return res.status(200).json(response);
  }

  //responsable
  if (req.user.role === "responsable laboratoire") {
    const countChercheur = await User.countDocuments({
      createdBy: req.user._id,
      role: "chercheur",
    });
    const countStagiaire = await User.countDocuments({
      createdBy: req.user._id,
      role: "stagiaire",
    });

    return res.status(200).json({
      count_chercheur: countChercheur,
      count_stagiaire: countStagiaire,
    });
  }

  // Pour le chercheur
  if (req.user.role === "chercheur") {
    const countStagiaire = await User.countDocuments({
      createdBy: req.user._id,
      role: "stagiaire",
    });

    return res.status(200).json({ count_stagiaire: countStagiaire });
  }

  // Stagiaire
  return res.status(403).json({ message: "Accès interdit" });

});


/**----------------------------------
 * @desc  Profile Photo Upload
 * @router /api/users/profile/profile-photo-upload
 * @method  POST
 * @access  private (only logged in user)
 -------------------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier fourni" })
  }

  //get user from DB
  const user = await User.findById(req.user._id);
  //delete the old photo
  if (user.profilePhoto.publicId !== null) {
    const oldImagePath = path.join(__dirname, `/images/${user.profilePhoto.publicId}`); //path mta el old image

    if (fs.existsSync(oldImagePath)) {//tchoufha mawjouda ou non
      fs.unlinkSync(oldImagePath);//tfaskhhaa
    }
  }

  //thot taswira jdida
  user.profilePhoto = {
    url: `../images/${req.file.filename}`,
    publicId: req.file.filename,
  };

  //tsajel les modifs
  await user.save();

  res.status(200).json({
    message: "Votre photo de profile a été telechargée avec succés",
    profilePhoto: { url: user.profilePhoto.url, publicId: user.profilePhoto.publicId },
  });
});


