const router = require("express").Router();
const jwt = require("jsonwebtoken");
/**oubien:
const express = require("express)"
const router = express.Router()**/
const{ registerUserCtrl, loginUserCtrl}= require("../controllers/authController");
const { checkAdminRole} = require('../middleware/roleMiddleware');
const { verifyToken} = require('../middleware/authMiddleware');




// /api/auth/register
router.post("/register",verifyToken, checkAdminRole(['admin','chercheur', 'responsable laboratoire']),  registerUserCtrl);
router.post("/login",loginUserCtrl);



module.exports = router;