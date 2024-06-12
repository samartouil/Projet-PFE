import React, { useState, useEffect  } from 'react';
import request from "../../utils/request";
import './ajouEq.css'
import Sidebar from "../../components/sidebarEq";
import AddBudgetModal from "./AddBudgetModal";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const EquipementForm = () => {
  const [equipement, setEquipement] = useState({
    EQname: '',
    EQdescription: '',
    EQtype: '',
    EQstock: '',
    EQsecuriteStock:'',
    EQprix: '',
    EQplace: '', 
    EQbudget: '',
  });

  
  const [emplacements, setEmplacements] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      const emplacementsResponse = await request.get('/api/equipements/emplacements');
      setEmplacements(emplacementsResponse.data);

      const budgetResponse = await request.get('/api/equipements/budgets');
      setBudgets(budgetResponse.data);
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'EQstock' || name === 'EQprix' || name === 'EQsecuriteStock') && parseFloat(value) < 0) {
      toast.error('Le stock et le prix doivent être des nombres non négatifs');
      return;
    }
    if (name === 'EQbudget' && value === 'addNew') {
      setIsAddBudgetModalOpen(true);
    } else {
      setEquipement({ ...equipement, [name]: value });
    }
    
  };
  const handleAddNewBudget = (newBudget) => {
    setBudgets([...budgets, newBudget]); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(equipement);
      await request.post('/api/equipements/', equipement);  
      // Réinitialiser le formulaire après l'envoi réussi
      setEquipement({
        EQname: '',
        EQdescription: '',
        EQtype: '',
        EQstock: '',
        EQsecuriteStock:'',
        EQprix: '',
        EQplace: '', 
        EQbudget: '',
      });
      toast.success('Équipement ajouté avec succès !');
    } catch (error) {
      
      console.error('Erreur lors de l\'ajout de l\'équipement :', error);
      toast.error('Une erreur est survenue lors de l\'ajout de l\'équipement.');
    }
  };

  return (
    <section className='AjEquipement'>
      <ToastContainer/>
      <Sidebar/>
    <div className="equipement-form">
      <h2>Ajouter un équipement</h2>
      <form onSubmit={handleSubmit} className='formEq'>
        <label  htmlFor="EQname">Nom de l'équipement <span className="required" title="ce champ est obligatoire">*</span></label>
        <input type="text" name="EQname" value={equipement.EQname} onChange={handleChange} required />

        <label htmlFor="EQdescription">Description :</label>
        <textarea name="EQdescription" value={equipement.EQdescription} onChange={handleChange} />

        <label htmlFor="EQtype">Type <span className="required" title="ce champ est obligatoire">*</span></label>
        <select name="EQtype" value={equipement.EQtype} onChange={handleChange} required>
          <option value="">Sélectionnez le type</option>
          <option value="composé">Composé</option>
          <option value="simple">Simple</option>
        </select>

        <label htmlFor="EQsecuriteStock">Stock de securité <span className="required" title="ce champ est obligatoire">*</span></label>
        <input type="number" name="EQsecuriteStock" value={equipement.EQsecuriteStock} onChange={handleChange} required />

        <label htmlFor="EQstock">Stock <span className="required" title="ce champ est obligatoire">*</span></label>
        <input type="number" name="EQstock" value={equipement.EQstock} onChange={handleChange} required />

        <label htmlFor="EQprix">Prix (en DT):</label>
        <input type="number" name="EQprix" value={equipement.EQprix} onChange={handleChange}/>


    
        <label htmlFor="EQplace">Emplacement <span className="required" title="ce champ est obligatoire">*</span></label>
        <select name="EQplace" value={equipement.EQplace} onChange={handleChange} required>
          <option value="">Sélectionnez un emplacement</option>
          {emplacements.map((emplacement) => (
            
            <option key={emplacement.id} value={emplacement.id}>
            {emplacement.text} 
        </option>
            )
          )}
        </select>



        <label htmlFor="EQbudget">Budget :</label>
        <select name="EQbudget" value={equipement.EQbudget} onChange={handleChange} required>
          <option value="">Sélectionnez un budget</option>
          {budgets.map((budget) => (
            <option key={budget._id} value={budget._id}>
              {budget.name}
            </option>
          ))}
          <option value="addNew">Aucune, ajouter un budget</option> 
        </select>


        <button type="submit">Ajouter</button>
      </form>
      <AddBudgetModal
          isOpen={isAddBudgetModalOpen}
          onClose={() => setIsAddBudgetModalOpen(false)}
          onAdd={handleAddNewBudget}
        />
    </div>
    </section>
   
  );
};

export default EquipementForm;
