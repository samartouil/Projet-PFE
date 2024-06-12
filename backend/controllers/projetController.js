const Projet = require('../models/Projet');
const ValidateProject = require('../validation/validateProjet');
const Affectation = require('../models/affectusers');
const AffectationEquipement = require('../models/affectEquipement');
const { Equipement } = require('../models/EquipementModel');


const addProject = async (req, res) => {
    try {
        const { errors, isValid } = ValidateProject(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        const créerPar = req.user? req.user._id : null ;
        
        const newProjet = new Projet({
            NomProjet: req.body.NomProjet,
            description: req.body.description,
            DateDébut: req.body.DateDébut,
            DateFin: req.body.DateFin,
            BudgetConsacré: req.body.BudgetConsacré,
            créerPar:créerPar,
        });

        
        await newProjet.save();


        return res.status(200).json({ message: "Le projet a été ajouté avec succès" });
        } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Fonction pour affecter les utilisateurs sélectionnés à un projet
const affecterUtilisateursAuProjet = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const selectedUsers = req.body.selectedUsers;

        for (const userId of selectedUsers) {
            const existingAffectation = await Affectation.findOne({ projectId: projectId, userId: userId });

            if (existingAffectation) {
                const user = await Utilisateur.findById(userId);
                const project = await Projet.findById(projectId);
                const message = `L'utilisateur ${user.nom} est déjà affecté au projet ${project.nom}`;
                return res.status(400).json({ message: message });
            } else {
                const affectation = new Affectation({
                    projectId: projectId,
                    userId: userId
                });
                await affectation.save();
            }
        }

        return res.status(200).json({ message: "L'affectation a été ajoutée avec succès." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de l\'affectation des utilisateurs au projet' });
    }
};



const affecterEquipementsAuProjet = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const selectedEquipements = req.body.selectedEquipements;
       
        for (const { equipementId, nombrePieces }  of selectedEquipements) {
            const equipement = await Equipement.findById(equipementId);

            if (equipement) {
                if (nombrePieces > equipement.EQstock) {
                    console.error(`Le nombre de pièces demandé pour l'équipement ${equipement.EQname} dépasse le stock disponible`);
                    return res.status(400).json({ message: `Le nombre de pièces demandé pour l'équipement ${equipement.EQname} dépasse le stock disponible` });
                }

                const affectationEquipement = new AffectationEquipement({
                    projectId: projectId,
                    equipementId: equipementId,
                    nombrePieces: nombrePieces
                });
                await affectationEquipement.save();

                // Mettre à jour le stock de l'équipement
                equipement.EQstock -= nombrePieces; 
                await equipement.save();
            } else {
                console.error(`Equipement avec l'ID ${equipementId} introuvable`);
            }
        }

        return res.status(200).json({ message: "L\'affectation des équipements a été ajoutée avec succès" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de l\'affectation des équipements au projet" });
    }
};


const FindAllProjects = async (req, res) => {
    try {
        
        const projects = await Projet.find({Etat: false}, ["NomProjet", "description","createdBy"]).populate('créerPar');

        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const findProjectById = async (req, res) => {
    try {
        const project = await Projet.findOne({ _id: req.params.id });

        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        };
        const affectations = await Affectation.find({ projectId: project._id }).populate('userId');
        
        const affectationEq = await AffectationEquipement.find({ projectId: project._id }).populate('equipementId');

        const utilisateursAffectés = affectations.map(affectation => affectation.userId);

        // Agréger les équipements affectés
        const equipementsAffectes = affectationEq.reduce((acc, affectation) => {
            const { equipementId, nombrePieces } = affectation;
            const existingEquipement = acc.find(e => e.equipement._id.equals(equipementId._id));
            if (existingEquipement && !affectation.equipementId.Etat) {
                existingEquipement.nombrePieces += nombrePieces;
            } else  if (!affectation.equipementId.Etat){
                acc.push({ equipement: equipementId, nombrePieces });
            }
            return acc;
        }, []);

        return res.status(200).json({ project, utilisateursAffectés, equipementsAffectes });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const updateProject = async (req, res) => {
    try {
        
        const { errors, isValid } = ValidateProject(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }

        
        const _id = req.params.id;
        const updatedProject = await Projet.findOneAndUpdate(
            { _id: _id }, 
            { $set: req.body },
            { new: true } 
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        return res.status(200).json(updatedProject);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Supprimer un projet
const deleteProjet = async (req, res) => {
    try {
        await Projet.findByIdAndUpdate(req.params.id,
             {
                $set: {
                Etat: true,
                }
            });
        res.status(200).json({ message: 'Projet supprimé avec succès.' });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la suppression du projet.' });
    }
};


module.exports= {addProject, FindAllProjects, findProjectById,
     updateProject, affecterUtilisateursAuProjet, affecterEquipementsAuProjet, deleteProjet};