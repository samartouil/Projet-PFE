import React, { useState, useEffect } from 'react';
import AddBudgetModal from '../forms/AddBudgetModal'; 
import './manageBudgets.css';
import request from '../../utils/request';
import Sidebar from "../../components/sidebarEq";
import { FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa'; 
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify'; 
import "react-toastify/dist/ReactToastify.css";




const ManageBudgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);

    const [editableBudgetId, setEditableBudgetId] = useState(null);
    const [editedBudgetName, setEditedBudgetName] = useState('');


    const fetchBudgets = async () => {
        try {
            const response = await request.get('/api/equipements/budgets'); 
            setBudgets(response.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const openAddBudgetModal = () => {
        setIsAddBudgetModalOpen(true);
    };

    const closeAddBudgetModal = () => {
        setIsAddBudgetModalOpen(false);
    };
    const handleAddNewBudget = (newBudget) => {
        setBudgets([...budgets, newBudget]); // Ajoutez le nouveau budget à la liste des budgets
      };

      const handleEditBudget = (budgetId, budgetName) => {
        setEditableBudgetId(budgetId);
        setEditedBudgetName(budgetName);
    };

    const handleSaveEditedBudget = async () => {
        try {
            // Envoyez la requête pour mettre à jour le nom du budget
            await request.put(`/api/equipements/budgets/${editableBudgetId}`, { name: editedBudgetName });
    
            // Mettez à jour localement le nom du budget dans la liste
            const updatedBudgets = budgets.map(budget => {
                if (budget._id === editableBudgetId) {
                    return { ...budget, name: editedBudgetName };
                }
                return budget;
            });
            setBudgets(updatedBudgets);
            
            // Désactivez le mode édition
            setEditableBudgetId(null);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du budget :', error);
            alert('Erreur lors de la mise à jour du budget.');
        }
    };

    const handleDeleteBudget = async (budgetId) => {
        const result = await Swal.fire({
          title: 'Êtes-vous sûr?',
          text: 'Êtes-vous sûr de vouloir supprimer ce budget ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Oui, supprimer',
          cancelButtonText: 'Annuler',
        });
      
        if (result.isConfirmed) {
          try {
            await request.delete(`/api/equipements/budgets/${budgetId}`);
            toast.success('Le budget a été supprimé avec succès.');
            fetchBudgets()
          } catch (error) {
            console.error('Erreur lors de la suppression du budget :', error);
            const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
            toast.error(errorMessage);
          }
        }
      };
    
    
    
    

    return (
        <section className="manage-budgets-container">
             <ToastContainer />
            <Sidebar/>
            <div className="manage-budgets-content">
                    <h2 className='manage-budgets-title'>Liste des Budgets</h2>
                    <button onClick={openAddBudgetModal} className='add-budget-button'>Ajouter +</button>

                    <table className='budgets-table'>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgets.map((budget) => (
                                <tr key={budget._id}>
                                    <td>
                                        {editableBudgetId === budget._id ? (
                                             <div className="edit-actions">
                                             <input
                                                 type="text"
                                                 value={editedBudgetName}
                                                 onChange={(e) => setEditedBudgetName(e.target.value)}
                                             />
                                             <FaCheck
                                                 className='confirm-icon'
                                                 onClick={handleSaveEditedBudget}
                                             />
                                         </div>
                                        ) : (
                                            budget.name
                                        )}
                                    </td>
                                    <td >
                                        <FaEdit className='action-icons' onClick={() => handleEditBudget(budget._id, budget.name)}/>
                                        <FaTrashAlt className='action-icons' onClick={() => handleDeleteBudget(budget._id)}/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <AddBudgetModal isOpen={isAddBudgetModalOpen} onClose={closeAddBudgetModal} onAdd={handleAddNewBudget}/>
            </div>
            
        </section>
    );
};

export default ManageBudgets;
