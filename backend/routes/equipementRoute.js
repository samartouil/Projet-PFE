const express = require('express');
const router = express.Router();
const { addEquipement, getEquipements, updateEquipement, deleteEquipement,getEquipement, 
    markPieceDefaillante,validateEquipementStagiaire, getAllEquipementsCount, 
    getEquipementsWithLowSecurityStock} = require('../controllers/equipementController');
const { addArmoire, getEmplacements, getArmoires, updateArmoire, deleteArmoire} = require('../controllers/PlaceController');
const { addBudget, getBudgets, getBudgetById, updateBudget, deleteBudget } = require('../controllers/BudgetController');
const { verifyToken, verifyTokenAndOnlyAdmin } = require('../middleware/authMiddleware');



// Routes pour les emplacements
//armoires
router.post('/armoires', verifyToken, addArmoire);
//  étagères
//router.post('/etageres', verifyToken, addEtagère);
router.get('/emplacements', verifyToken, getEmplacements);
router.get('/emplacements/armoires', verifyToken, getArmoires);
router.put('/emplacements/armoires/:id', verifyToken, updateArmoire);
router.delete('/emplacements/armoires/:id', verifyToken, deleteArmoire);




// Routes pour les budgets
router.post('/budgets', verifyToken, addBudget);
router.get('/budgets', verifyToken,getBudgets);
router.get('/budgets/:id',verifyToken, getBudgetById);
router.put('/budgets/:id',verifyToken, updateBudget);
router.delete('/budgets/:id', verifyToken, deleteBudget);

router.patch('/valider/:id',verifyToken, validateEquipementStagiaire);
// Routes pour les équipements 
router.post('/', verifyToken, addEquipement);
router.get('/', verifyToken,getEquipements);
router.get('/count', verifyToken,getAllEquipementsCount);
router.get('/lowstock', verifyToken,getEquipementsWithLowSecurityStock);

router.post('/:id/mark-defaillant', verifyToken,markPieceDefaillante);
router.get('/:id',verifyToken, getEquipement);
router.put('/:id', verifyToken, updateEquipement);
router.delete('/:id', verifyToken, deleteEquipement);







module.exports = router;
