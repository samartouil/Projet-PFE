
import React, { useState } from 'react';
import request from '../../utils/request';
import { toast } from 'react-toastify';
import '../forms/addBudgetModal.css';

const AddArmoireModal = ({ isOpen, onClose, onAdd }) => {
    const [newArmoire, setNewArmoire] = useState('');
    const [nombreEtagères, setNombreEtagères] = useState('');

    const handleAddArmoire = async () => {
        try {
            const response = await request.post('/api/equipements/armoires', { name: newArmoire, nombreEtagères });
            toast.success('Armoire ajoutée avec succès !');
            onAdd(response.data);
            setNewArmoire('');
            onClose();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                console.error('Erreur lors de l\'ajout de l\'armoire:', error);
                toast.error('Erreur lors de l\'ajout de l\'armoire.');
            }
        }
    };

    if (!isOpen) {
        return null; 
      }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Ajouter une nouvelle armoire</h2>
                <input
                    type="text"
                    value={newArmoire}
                    onChange={(e) => setNewArmoire(e.target.value)}
                    placeholder="Nom de l'armoire"
                />
                <input
                    type="number"
                    value={nombreEtagères}
                    onChange={(e) => setNombreEtagères(e.target.value)}
                    placeholder="Nombre d'Étagères"
                    min={0}
                />
                <button onClick={handleAddArmoire}>Ajouter</button>
                <button onClick={onClose}>Fermer</button>
            </div>
        </div>
    );
};

export default AddArmoireModal;
