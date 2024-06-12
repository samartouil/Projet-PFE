const { Equipement, validateEquipement} = require('../models/EquipementModel');
const { Etagère, Armoire } = require('../models/EquipementPlace');
const AffectationEquipement = require ('../models/affectEquipement');
const Projet = require('../models/Projet');
const mongoose = require("mongoose");
const asyncHandler= require("express-async-handler");
const cron = require('node-cron');


// Ajouter un équipement
const addEquipement = async (req, res) => {

    const { error } = validateEquipement(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message});
    }

    let EquipementE = await Equipement.findOne({EQname: req.body.EQname});
    if(EquipementE){
        return res.status(400).json({message:"Equipement existe déjà"});
    }

    const createdBy = req.user? req.user._id : null ;
    let isValid = true; 

    if (req.user.role === "stagiaire") {
        isValid = false; 
    }
    const { EQname, EQdescription, EQtype, EQstock, EQsecuriteStock, EQprix, EQplace, EQbudget } = req.body;
    if (!mongoose.Types.ObjectId.isValid(EQplace)) {
        return res.status(400).json({ message: "Emplacement ID invalide" });
      }

    const etagere= await Etagère.findById(EQplace);
   
    if (!etagere) {
        return res.status(400).json({ message: "L'étagère  fournie n'existe pas" });
    }
   
    const equipement = new Equipement({
        EQname,
        EQdescription,
        EQtype,
        EQstock,
        EQsecuriteStock,
        EQprix,
        EQplace,
        EQbudget,
        createdBy: createdBy,
        isValid,
    });

    try {
        await equipement.save();
        res.status(201).json(equipement);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Erreur lors de la création de l\'équipement.' });
    }
};

// Obtenir tous les équipements + recherche
const getEquipements = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm; 
        const sortOrder = req.query.sortOrder || 'asc'; //ascendant wala descendant
        const armoireName = req.query.armoire; 
        
        const query = {Etat: false};
        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i'); // 'i' pour insensible à la casse yani majuscule wala miniscule kifkif 
            query.EQname = regex;
        }
        if (armoireName) {
            const armoire = await Armoire.findOne({ name: armoireName });
            if (armoire) {
                const etageres = await Etagère.find({ armoireId: armoire._id });
                query.EQplace = { $in: etageres.map((etagere) => etagere._id) };
            }
        }

        const equipements = await Equipement.find(query)
            .populate({ path: 'EQplace', populate: { path: 'armoireId', model: 'Armoire' } })
            .populate('EQbudget')
            .populate('createdBy')
            .sort({ EQname: sortOrder });

        res.status(200).json(equipements);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des équipements.' });
    }
};


//get equipement
const getEquipement = asyncHandler(async (req, res) => {
    const equipementId = req.params.id;
  
    // Valider l'ObjectId
    if (!mongoose.Types.ObjectId.isValid(equipementId)) {
      return res.status(400).json({ message: "ID invalide" });
    }
  
    const equipement = await Equipement.findById(equipementId)
      .populate({ path: 'EQplace', populate: { path: 'armoireId', model: 'Armoire' } })
      .populate('EQbudget')
      .populate('createdBy');
  
    if (!equipement) {
      return res.status(404).json({ message: "Équipement non trouvé" });
    }

    const affectations = await AffectationEquipement.find({ equipementId: equipement._id })
    .populate('projectId');
    const projetsAffectes = affectations.reduce((acc, affectation) => {
        const { projectId, nombrePieces } = affectation;
        const existingProjet = acc.find(p => p.projet._id.equals(projectId._id));
        if (existingProjet && !affectation.projectId.Etat ) {
          existingProjet.nombrePieces += nombrePieces;
        } else if (!affectation.projectId.Etat) {
          acc.push({ projet: projectId, nombrePieces });
        }
        return acc;
      }, []);
  
    res.status(200).json({equipement, projetsAffectes});
  });
  




// Mettre à jour un équipement
const updateEquipement = async (req, res) => {
    const {error} = validateEquipement(req.body);
    if (error){
        return res.status(400).json({ message: error.details[0].message});
    }
    try {
        const updatedEquipement = await Equipement.findByIdAndUpdate(
            req.params.id,
            { $set: {
                EQname: req.body.EQname,
                EQdescription: req.body.EQdescription,
                EQprix: req.body.EQprix,
                EQstock: req.body.EQstock,
                EQplace:req.body.EQplace,
                EQbudget:req.body.EQbudget
              } },
            { new: true }
        );

        res.status(200).json(updatedEquipement);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'équipement.' });
    }
};



//valider un équipement
const validateEquipementStagiaire = async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
  
      const equipement = await Equipement.findById(id);
      if (!equipement) {
        return res.status(404).json({ message: "Équipement non trouvé" });
      }
  
      equipement.isValid = true; 
      await equipement.save();
  
      res.status(200).json({ message: "Équipement validé avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la validation de l'équipement" });
    }
  };



// Supprimer un équipement
const deleteEquipement = async (req, res) => {
    try {
        await Equipement.findByIdAndUpdate(req.params.id,
             {
                $set: {
                Etat: true,
                }
            });
        res.status(200).json({ message: 'Équipement supprimé avec succès.' });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la suppression de l\'équipement.' });
    }
};



//equipements count
const getAllEquipementsCount = asyncHandler(async(req,res)=> {
    try {
        const countAll = await Equipement.countDocuments();
      const countHorsStock = await Equipement.countDocuments({EQstock: 0});
      const countInvalid = await Equipement.countDocuments({isValid: false});

      const response = {
        total: countAll,
        HorsStock: countHorsStock,
        invalid: countInvalid,
      };
      return res.status(200).json(response);
   
    } catch (error) {
        console.error('Erreur lors du comptage des équipements:', error);
        return res.status(500).json({ message: 'Erreur lors du comptage des équipements.' });
    }
       
});


//Piece defaillante
const markPieceDefaillante = async (req, res) => {
    try {
        const equipementId = req.params.id;
        console.log(req.body.NbrDefaillant);
        const NbrDefaillant=parseInt(req.body.NbrDefaillant,10);
        
        if (isNaN(NbrDefaillant) || NbrDefaillant < 0) {
            return res.status(400).json({ message: "Le nombre de pièces défaillantes doit être un nombre positif." });
          }
        const equipement = await Equipement.findById(equipementId);

        if (!equipement) {
            return res.status(404).json({ message: 'Équipement non trouvé' });
        }
        if (equipement.EQstock < NbrDefaillant) {
            return res.status(400).json({ message: "Le stock ne peut pas être négatif." });
          }

        equipement.NbrDefaillant += NbrDefaillant;
        equipement.EQstock -= NbrDefaillant; 

        await equipement.save(); 

        res.status(200).json({ message: 'Pièce(s) marquée(s) comme défaillante' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors du marquage comme défaillant' });
    }
};


const checkSecurityStock = async () => {
    try {
        const equipements = await Equipement.find();

        for (const equipement of equipements) {
            if (equipement.EQstock <= equipement.EQsecuriteStock) {
                equipement.estEnDessousDuStockSecurite = true;
                await equipement.save(); 
                
            } else {
                equipement.estEnDessousDuStockSecurite = false;
                await equipement.save(); 
            }
        }
    } catch (error) {
        console.error("Erreur lors de la vérification du stock de sécurité :", error);
    }
};


const getEquipementsWithLowSecurityStock = async (req, res) => {
    try {
        const equipements = await Equipement.find({ estEnDessousDuStockSecurite: true });
        res.status(200).json(equipements);
    } catch (error) {
        console.error("Erreur lors de la récupération des équipements avec un stock de sécurité bas :", error);
        res.status(500).json({ message: 'Erreur lors de la récupération des équipements.' });
    }
};







module.exports = {
    addEquipement,
    getEquipements,
    getEquipement,
    updateEquipement,
    deleteEquipement,
    getAllEquipementsCount,
    markPieceDefaillante,
    validateEquipementStagiaire,
    checkSecurityStock,
    getEquipementsWithLowSecurityStock
};
