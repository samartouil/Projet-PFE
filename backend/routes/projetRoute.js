const express = require('express');
const { addProject, FindAllProjects, findProjectById, updateProject, affecterUtilisateursAuProjet, affecterEquipementsAuProjet, deleteProjet } = require('../controllers/projetController');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');


router.post('/', verifyToken, addProject);
router.get('/listeProjets', verifyToken, FindAllProjects);
router.get('/detailsProject/:id', verifyToken, findProjectById);
router.put('/detailsProject/:id', verifyToken, updateProject);
router.delete('/detailsProject/:id', verifyToken, deleteProjet);
router.post('/affectUserModal', verifyToken, affecterUtilisateursAuProjet);
router.post('/affectEquipement', verifyToken, affecterEquipementsAuProjet);




module.exports = router;