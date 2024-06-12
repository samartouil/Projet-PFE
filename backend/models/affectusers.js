const mongoose = require('mongoose');


const affectationSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Projects' 
}, 
  userId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User'
    } 
});


const Affectation = mongoose.model('affectuser', affectationSchema); // Utilisez la méthode model pour créer le modèle

module.exports = Affectation;