import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import request from "../../utils/request";
import { useParams } from "react-router-dom";
import "./updateEquipementModal.css"; 

const UpdateEquipmentModal = ({ equipement, onClose, onUpdateSuccess }) => {
  const { id } = useParams();
  const [EQname, setEQname] = useState(equipement.EQname || ""); 
  const [EQdescription, setEQdescription] = useState(equipement.EQdescription || ""); 
  const [EQstock, setEQstock] = useState(equipement.EQstock || 0); 
  const [EQprix, setEQprix] = useState(equipement.EQprix || 0); 
  const [EQplace, setEQplace] = useState(equipement.EQplace?._id || ""); 
  const [EQbudget, setEQbudget] = useState(equipement.EQbudget?._id || ""); 
  const [EQtype, setEQtype] = useState(equipement.EQtype); 
  const [NbrDefaillant, setNbrDefaillant] = useState(0);

  const [emplacements, setEmplacements] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const emplacementsResponse = await request.get("/api/equipements/emplacements");
        setEmplacements(emplacementsResponse.data);

        const budgetsResponse = await request.get("/api/equipements/budgets");
        setBudgets(budgetsResponse.data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des options.");
      }
    };

    fetchOptions();
  }, []);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if ( parseFloat(EQprix) < 0 && parseFloat(EQstock) < 0) {
      toast.error('Le stock et le prix doivent être des nombres non négatifs');
      return;
    }
    const updateData = {
      EQname,
      EQdescription,
      EQstock,
      EQprix,
      EQplace,
      EQbudget,
      EQtype,
  
    };
    
    try {
      const response = await request.put(`/api/equipements/${id}`, updateData);
      if (NbrDefaillant > 0) {
        await request.post(`/api/equipements/${id}/mark-defaillant`, { NbrDefaillant }); 
      }
      toast.success("Équipement mis à jour avec succès");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Erreur lors de la mise à jour";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="update-equipment-modal">
      <form onSubmit={formSubmitHandler} className="update-equipment-form">
        <abbr title="Fermer">
          <i
            onClick={onClose}
            className="bi bi-x-circle-fill update-equipment-form-close"
          ></i>
        </abbr>
        <h1 className="update-equipment-title">Modifier l'équipement</h1>

        <label>Nom de l'équipement :</label>
        <input
          type="text"
          value={EQname}
          onChange={(e) => setEQname(e.target.value)}
        />

        <label>Description :</label>
        <textarea
          value={EQdescription}
          onChange={(e) => setEQdescription(e.target.value)}
        />

        <label>Stock :</label>
        <input
          type="number"
          value={EQstock}
          onChange={(e) => setEQstock(e.target.value)}
        />
        <label>Nombre de pièces nouvellement défaillantes :</label>
        <input
          type="number"
          value={NbrDefaillant}
          onChange={(e) => setNbrDefaillant(e.target.value)}
          min={0}
          placeholder="Nombre de pièces défaillantes"
        />

        <label>Prix (DT) :</label>
        <input
          type="number"
          value={EQprix}
          onChange={(e) => setEQprix(e.target.value)}
        />

        <label>Emplacement :</label>
        <select
          value={EQplace}
          onChange={(e) => setEQplace(e.target.value)}
        >
          <option value="">Sélectionnez l'emplacement</option>
          {emplacements.map((emplacement) => (
            <option key={emplacement.id} value={emplacement.id}>
              {emplacement.text}
            </option>
          ))}
        </select>

        <label>Budget :</label>
        <select
          value={EQbudget}
          onChange={(e) => setEQbudget(e.target.value)}
        >
          <option value="">Sélectionnez le budget</option>
          {budgets.map((budget) => (
            <option key={budget._id} value={budget._id}>
              {budget.name}
            </option>
          ))}
        </select>

        <button type="submit" className="update-modal-equipment-btn">
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default UpdateEquipmentModal;
