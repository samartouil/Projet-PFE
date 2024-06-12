const express = require('express');
const { calculatePiecePercentages, calculateEquipmentUtilization, getMostUsedBudgetsForEquipments, calculateProjectComplexity} = require('../controllers/BIcontroller');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');






//  /api/BI/equipements/piece-percentages
router.get('/equipements/piece-percentages', calculatePiecePercentages);
router.get('/equipements/utilisation', calculateEquipmentUtilization);
router.get('/equipements/budgetPlusUtilise', getMostUsedBudgetsForEquipments);
router.get('/equipements/complexiteProjet', calculateProjectComplexity);








module.exports = router;