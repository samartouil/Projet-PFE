const mongoose = require('mongoose');


const affectationEquipementSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects' 
    },
    equipementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipement'
    },
    nombrePieces: { 
        type: Number,
        required: true
    }
},
{//object
    timestamps: true,
});


const AffectationEquipement = mongoose.model('affectEquipement', affectationEquipementSchema);

module.exports = AffectationEquipement;