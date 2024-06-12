const { Equipement } = require('../models/EquipementModel');
const  {Etagère,Armoire,validatePlace}  = require('../models/EquipementPlace');
const asyncHandler = require("express-async-handler");

// Ajouter une armoire 
// Endpoint pour ajouter une armoire avec le nombre d'étagères spécifié
const addArmoire = asyncHandler(async (req, res) => {
    const { name, nombreEtagères } = req.body;

    const { error } = validatePlace({ name });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const existingArmoire = await Armoire.findOne({ name });
    if (existingArmoire) {
        return res.status(400).json({ message: "Cette armoire existe déjà." });
    }

    const newArmoire = new Armoire({ name, nombreEtagères });

    try {
        await newArmoire.save();

        // Créer automatiquement les étagères pour cette armoire
        for (let i = 1; i <= nombreEtagères; i++) {
            const newEtagère = new Etagère({
                name: `Étagère ${i}`,
                armoireId: newArmoire._id,
            });
            await newEtagère.save();
        }

        res.status(201).json({ message: 'Armoire créée avec succès', newArmoire });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de l\'armoire.' });
    }
});


const getArmoires = async(req,res) => {
    try {
        const armoires = await Armoire.find({Etat: false});
        res.status(200).json(armoires)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des armoires.' });
    }
};

const getEmplacements = async (req, res) => {
    try {
     
      const armoires = await Armoire.find({Etat: false});
      const emplacements = [];
      for (const armoire of armoires) {
        const etageres = await Etagère.find({ armoireId: armoire._id });
        //n3abi tableau
        etageres.forEach((etagere) => {
            //push tzid ligne felekher mta tableau
          emplacements.push({
            text: `${armoire.name} - ${etagere.name}`, 
            id: etagere._id });
        });
      }
  
      res.status(200).json(emplacements); 
  
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des emplacements.' });
    }
  };


    
    const updateArmoire = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;

        const { error } = validatePlace({ name });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        try {
            const armoire = await Armoire.findById(id);
            if (!armoire) {
                return res.status(404).json({ message: 'Armoire non trouvée.' });
            }

            armoire.name = name;
            await armoire.save();

            res.status(200).json({ message: 'Armoire mise à jour avec succès', armoire });
        } catch (error) {
            res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'armoire.' });
        }
    });

  // Supprimer une armoire
  const deleteArmoire = async (req, res) => {
    const { id } = req.params;
    let nbrequipment = 0;

    try {
        const armoire = await Armoire.findById(id);
        if (!armoire) {
            return res.status(404).json({ message: 'Armoire not found.' });
        }

        const etageres = await Etagère.find({ armoireId: armoire._id });
        const equipementsPromises = etageres.map(async (etagere) => {
            const equipements = await Equipement.find({ EQplace: etagere._id });
            if (equipements.length !== 0) {
                nbrequipment += equipements.length;
            }
        });

        // Wait for all the equipementsPromises to resolve
        await Promise.all(equipementsPromises);
        if (nbrequipment > 0) {
            return res.status(403).json({ message: 'Supression imposible, il existe des équipements dedans ' });
        }else {
            
        await Armoire.findOneAndUpdate(
            { _id: id }, 
            { $set: {
                Etat: true,
            } },
            { new: true } 
        );

        return res.status(200).json({ message: 'Armoire supprimé avec succès.' });

        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erreur lors de la suppression de l\'armoire.' });
    }
};


  
 

module.exports = {
    addArmoire,
    getEmplacements,
    getArmoires,
    updateArmoire,
    deleteArmoire
};