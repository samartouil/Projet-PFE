import React, { useState, useEffect } from 'react';
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa';
import '../budgets/manageBudgets.css';
import request from '../../utils/request';
import Sidebar from "../../components/sidebarEq";
import AddArmoireModal from './AddArmoire';
import { toast, ToastContainer } from 'react-toastify'; 
import Swal from 'sweetalert2';

const ManageEmplacements = () => {
    const [armoires, setArmoires] = useState([]);
    const [isAddArmoireModalOpen, setIsAddArmoireModalOpen] = useState(false);

    const [editableArmoireId, setEditableArmoireId] = useState(null);
    const [editedArmoireName, setEditedArmoireName] = useState('');

    useEffect(() => {
        fetchArmoires();
    }, []);

    const fetchArmoires = async () => {
        try {
            const response = await request.get('/api/equipements/emplacements/armoires');
            setArmoires(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des armoires:', error);
        }
    };

    const openAddArmoireModal = () => {
        setIsAddArmoireModalOpen(true);
    };

    const closeAddArmoireModal = () => {
        setIsAddArmoireModalOpen(false);
    };

    const handleAddNewArmoire = (newArmoire) => {
        setArmoires([...armoires, newArmoire]);
        setIsAddArmoireModalOpen(false);
        fetchArmoires();
    };

    const handleEditArmoire = (armoireId, armoireName, armoireNombreEtagères) => {
        setEditableArmoireId(armoireId);
        setEditedArmoireName(armoireName);
    };

    const handleSaveEditedArmoire = async (armoireId) => {
        try {
            await request.put(`/api/equipements/emplacements/armoires/${armoireId}`, {
                name: editedArmoireName,
            });

            // Mettre à jour localement les valeurs de l'armoire éditée
            const updatedArmoires = armoires.map(armoire => {
                if (armoire._id === armoireId) {
                    return {
                        ...armoire,
                        name: editedArmoireName,
                    };
                }

                return armoire;
            });

            setArmoires(updatedArmoires);
            setEditableArmoireId(null);
        } catch (error) {
            console.error('Erreur lors de la modification de l\'armoire :', error);
        }
    };

    const handleCancelEdit = () => {
        setEditableArmoireId(null);
    };



    
    const handleDeleteArmoire = async (id) => {
        const result = await Swal.fire({
          title: 'Voulez-vous supprimer cette armoire',
          text: 'Cette action ne peut pas être annulée.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui',
          cancelButtonText: 'Non',
        });
      
        if (result.isConfirmed) {
          try {
            const response = await request.delete(`/api/equipements/emplacements/armoires/${id}`);
        
            toast.success('Armoire supprimé avec succès');
            fetchArmoires();
          } catch (error) {
            toast.error('Erreur lors de la suppression de l\'armoire');
          }
        }
      };




    return (
        <section className="manage-budgets-container">
            <Sidebar />
            <div className="manage-budgets-content">
                <h2 className='manage-budgets-title'>Gestion des Emplacements</h2>
                <Button onClick={openAddArmoireModal} className="add-budget-button">Ajouter un Emplacement</Button>

                <table className='budgets-table'>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Nombre d'Étagères</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {armoires.map((armoire) => (
                            <tr key={armoire._id}>
                                <td>
                                    {editableArmoireId === armoire._id ? (
                                        <input
                                            type="text"
                                            value={editedArmoireName}
                                            onChange={(e) => setEditedArmoireName(e.target.value)}
                                        />
                                    ) : (
                                        armoire.name
                                    )}
                                </td>
                                <td>
                                    {armoire.nombreEtagères}
                                </td>
                                <td>
                                    {editableArmoireId === armoire._id ? (
                                        <>
                                            <FaCheck className='action-icons' onClick={() => handleSaveEditedArmoire(armoire._id)} />
                                            <FaTrashAlt className='action-icons' onClick={handleCancelEdit} />
                                        </>
                                    ) : (
                                        <>
                                            <FaEdit className='action-icons' onClick={() => handleEditArmoire(armoire._id, armoire.name, armoire.nombreEtagères)} />
                                            <FaTrashAlt className='action-icons' onClick={() => handleDeleteArmoire(armoire._id)} />
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <AddArmoireModal isOpen={isAddArmoireModalOpen} onClose={closeAddArmoireModal} onAdd={handleAddNewArmoire} />
            </div>
            <ToastContainer />
        </section>
    );
};

export default ManageEmplacements;
