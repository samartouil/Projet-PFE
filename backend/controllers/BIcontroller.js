const { Equipement, validateEquipement} = require('../models/EquipementModel');
const Projet = require('../models/Projet');
const {Budget} = require('../models/Budget');
const mongoose = require("mongoose");
const asyncHandler= require("express-async-handler");
const AffectationEquipement = require('../models/affectEquipement');
const Affectation = require('../models/affectusers');




const calculatePiecePercentages = async (req, res) => {
    try {
       
        const equipements = await Equipement.find({NbrDefaillant : {$ne :0} }); // $ne yani not equal

        const piecePercentages = [];

        for (const equipement of equipements) {
            const totalPieces = equipement.EQstock + equipement.NbrDefaillant;
            const piecesDefaillantes = equipement.NbrDefaillant || 0;
            const piecesNonDefaillantes = equipement.EQstock;

            const pourcentageDefaillantes = ((piecesDefaillantes / totalPieces) * 100 || 0).toFixed(2);
            const pourcentageNonDefaillantes = (100 - pourcentageDefaillantes).toFixed(2);

            
            piecePercentages.push({
                equipementId: equipement._id,
                nom: equipement.EQname,
                pourcentageDefaillantes,
                pourcentageNonDefaillantes
            });
        }

       
        res.status(200).json(piecePercentages);
    } catch (error) {
        console.error('Erreur lors du calcul des pourcentages de pièces défaillantes et non défaillantes :', error);
        res.status(500).json({ message: 'Erreur lors du calcul des pourcentages de pièces défaillantes et non défaillantes.' });
    }
};



// Calculer le taux d'utilisation des équipements dans les projets
const calculateEquipmentUtilization = async (req, res) => {
    try {
        
        const equipments = await Equipement.find();
        const projects = await Projet.find();

        
        const equipmentUtilization = {};

        
        for (const equipment of equipments) {
            
            const projectsUsingEquipment = await AffectationEquipement.find({ equipementId: equipment._id }).distinct('projectId');

            const utilizationRate = projectsUsingEquipment.length / projects.length;

        
            equipmentUtilization[equipment.EQname] = utilizationRate;
        }

       
        res.status(200).json(equipmentUtilization);
    } catch (error) {
        console.error('Erreur lors du calcul du taux d\'utilisation des équipements:', error);
        res.status(500).json({ message: 'Erreur lors du calcul du taux d\'utilisation des équipements.' });
    }
};


// Obtenir les budgets les plus utilisés pour les équipements
const getMostUsedBudgetsForEquipments = asyncHandler(async (req, res) => {
    try {
        const equipements = await Equipement.find().populate('EQbudget');
        
        const budgetFrequencyMap = {};

        // Compter la fréquence d'utilisation de chaque budget
        equipements.forEach(equipement => {
            const budgetId = equipement.EQbudget._id.toString(); 
            if (budgetFrequencyMap[budgetId]) {
                budgetFrequencyMap[budgetId]++;
            } else {
                budgetFrequencyMap[budgetId] = 1;
            }
        });

       
        const sortedBudgets = Object.entries(budgetFrequencyMap)
            .sort((a, b) => b[1] - a[1]) 
            .map(async ([budgetId, frequency]) => {
                const budget = await Budget.findById(budgetId);
                return { budgetName: budget.name, frequency }; 
            });

        
        const resolvedBudgets = await Promise.all(sortedBudgets);

        res.status(200).json(resolvedBudgets);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des budgets les plus utilisés pour les équipements.' });
    }
});




const calculateProjectComplexity = async (req, res) => {
    try {
        // Récupérer tous les projets de la base de données
        const projects = await Projet.find();

        const projectComplexities = [];

        // poids
        const weightDuration = 0.4;
        const weightEquipmentCount = 0.3;
        const weightUserCount = 0.2;
        const weightBudget = 0.1;

       // min max
        const minDuration = 0; 
        const maxDuration = 730; 
        const minEquipmentCount = 0; 
        const maxEquipmentCount = 50; 
        const minUserCount = 0; 
        const maxUserCount = 50; 
        const minBudget = 0; 
        const maxBudget = 1000000; 



        for (const project of projects) {
            // Récupération mta3 données
            const duration = calculateDuration(project.DateDébut, project.DateFin);
            const equipmentCount = await AffectationEquipement.find({ projectId: project._id }).countDocuments();
            const userCount = await Affectation.find({ projectId: project._id }).countDocuments();
            const budget = project.BudgetConsacré;

            // Normalisation
            const normalizedDuration = normalizeValue(duration, minDuration, maxDuration);
            const normalizedEquipmentCount = normalizeValue(equipmentCount, minEquipmentCount, maxEquipmentCount);
            const normalizedUserCount = normalizeValue(userCount, minUserCount, maxUserCount);
            const normalizedBudget = normalizeValue(budget, minBudget, maxBudget);

            // Calcul
            const complexity = (normalizedDuration * weightDuration) +
                               (normalizedEquipmentCount * weightEquipmentCount) +
                               (normalizedUserCount * weightUserCount) +
                               (normalizedBudget * weightBudget);

           

            projectComplexities.push({
                projectId: project._id,
                projectName: project.NomProjet,
                complexity: complexity < 0 ? 0 : complexity,
            });
        }

        // ordre décroissant
        projectComplexities.sort((a, b) => b.complexity - a.complexity);

        res.status(200).json(projectComplexities);
    } catch (error) {
        console.error('Erreur lors du calcul de la complexité des projets :', error);
        res.status(500).json({ message: 'Erreur lors du calcul de la complexité des projets.' });
    }
};

    
    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationInMs = end - start;
        const durationInDays = durationInMs / (1000 * 60 * 60 * 24); // Conversion en jours
        return durationInDays;
    };

    // Fonction mta3 normalisation
    const normalizeValue = (value, minValue, maxValue) => {
        return (value - minValue) / (maxValue - minValue);
    };









module.exports = {calculatePiecePercentages, calculateEquipmentUtilization, getMostUsedBudgetsForEquipments, calculateProjectComplexity}
