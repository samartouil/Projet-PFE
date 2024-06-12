import React, { useState} from 'react';
import request from "../../utils/request";
import "./addBudgetModal.css"
import { toast } from 'react-toastify';



const AddBudgetModal = ({ isOpen, onClose, onAdd }) => {
    const [budgetName, setBudgetName] = useState('');
  
    const handleAddBudget = async () => {
      try {
        const response = await request.post('/api/equipements/budgets/', { name: budgetName });
        toast.success('Budget ajouté avec succès !');
        onAdd(response.data); 
        setBudgetName(''); 
        onClose(); 
      } catch (error) {
        console.log(error);
        console.error('Erreur lors de l\'ajout du budget:', error);
        toast.error('Erreur lors de l\'ajout du budget.');
      }
    };
  
    if (!isOpen) {
      return null; // Ne pas afficher si le modal n'est pas ouvert
    }
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Ajouter un nouveau budget</h2>
          <input
            type="text"
            value={budgetName}
            onChange={(e) => setBudgetName(e.target.value)}
            placeholder="Nom du budget"
          />
          <button onClick={handleAddBudget}>Ajouter</button>
          <button onClick={onClose}>Fermer</button>
        </div>
      </div>
    );
  };


  export default AddBudgetModal;
  