const { Budget, validateBudget } = require('../models/Budget');

// Ajouter un budget
const addBudget = async (req, res) => {
    // 1: validation
    const { error } = validateBudget(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { name } = req.body;

    try {
        const existingBudget = await Budget.findOne({ name, etat: false });
        if (existingBudget) {
            return res.status(400).json({ message: "Un budget avec ce nom existe déjà." });
        }

        const newBudget = new Budget({ name, etat: false });
        await newBudget.save();
        res.status(201).json(newBudget);
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Erreur lors de la création du budget.' });
    }
};


// Obtenir tous les budgets
const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ Etat: false});
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des budgets.' });
    }
};

// Obtenir un budget par ID
const getBudgetById = async (req, res) => {
    const { id } = req.params;

    try {
        const budget = await Budget.findById(id);
        if (!budget) {
            return res.status(404).json({ message: 'Budget non trouvé.' });
        }
        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du budget.' });
    }
};

// Mettre à jour un budget
const updateBudget = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        // Vérifier si un budget avec le même nom existe déjà
        const existingBudget = await Budget.findOne({ name });
        if (existingBudget && existingBudget._id.toString() !== id) {
            return res.status(400).json({ message: 'Le nom du budget existe déjà.' });
        }

        const updatedBudget = await Budget.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );
        if (!updatedBudget) {
            return res.status(404).json({ message: 'Budget non trouvé.' });
        }
        res.status(200).json(updatedBudget);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du budget.' });
    }
};

// Supprimer un budget
const deleteBudget = async (req, res) => {
    try {
        await Budget.findByIdAndUpdate(req.params.id,
             {
                $set: {
                Etat: true,
                }
            });
        res.status(200).json({ message: 'Budget supprimé avec succès.' });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la suppression du Budget.' });
    }
};



module.exports = {
    addBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget
};
