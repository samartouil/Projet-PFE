const router = require ("express").Router()
const { getUsers, getAllUsersCtrl, getUserProfileCtrl, updateUserProfile, getAllUsersCountCtrl, profilePhotoUploadCtrl, activateUserProfile} = require("../controllers/usersController");
const { verifyToken, verifyTokenAndOnlyUser } = require("../middleware/authMiddleware");
const photoUpload = require("../middleware/photoUpload");
const validateObjectId = require("../middleware/validateObjectId");


// /api/users/profile
router.route("/").get(getUsers);
router.route("/profile").get(verifyToken,getAllUsersCtrl);
// /api/users/profile/:id
router.route("/profile/:id")
    .get(validateObjectId,getUserProfileCtrl)
    .put(validateObjectId,verifyTokenAndOnlyUser, updateUserProfile);
router.route("/profile/:id/activate").put(activateUserProfile)

// /api/users/count
router.route("/count").get(verifyToken,getAllUsersCountCtrl)
// /api/users/profile/profile-photo-upload
//single taswira bark yani
router.route("/profile/profile-photo-upload").post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl);
module.exports = router ;