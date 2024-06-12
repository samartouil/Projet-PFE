import React, { useState } from "react";
import { useDispatch } from "react-redux";
import request from "../../utils/request";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../components/sidebarEq"; 
import projectMenu from "../../data/projetMenu"; 
import "react-toastify/dist/ReactToastify.css";
import "./ajoutProjet.css"; 

const FormAjouterProjet = () => {
  const dispatch = useDispatch();

  const [NomProjet, setNomProjet] = useState("");
  const [description, setDescription] = useState("");
  const [DateDébut, setDateDebut] = useState("");
  const [DateFin, setDateFin] = useState("");
  const [BudgetConsacré, setBudgetConsacré] = useState("");
  const [startDateError] = useState("");
  const [endDateError] = useState("");


  const validateDates = () => {
    const startDate = new Date(DateDébut);
    const endDate = new Date(DateFin);
    const minDate = new Date("2012-06-12");

    if (startDate <= minDate) {
      return { valid: false, message: "La date de début doit être supérieure à 12/06/2012." };
    }

    if (startDate >= endDate) {
      return { valid: false, message: "La date de fin doit être postérieure à la date de début." };
    }

    return { valid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (BudgetConsacré < 0) {
      toast.error("Le budget ne peut pas être négatif.");
      return;
    };

    const dateValidationResult = validateDates();
    if (!dateValidationResult.valid) {
      toast.error(dateValidationResult.message);
      return;
    }

    const newProject = {
      NomProjet,
      description,
      DateDébut,
      DateFin,
      BudgetConsacré,
    };
    
    try {
      const response = await request.post('/api/projets/', newProject);
      toast.success("Projet ajouté avec succès !");
      // Réinitialiser les champs du formulaire
      setNomProjet("");
      setDescription("");
      setDateDebut("");
      setDateFin("");
      setBudgetConsacré("");
      
    } catch (error) {
      toast.error("Une erreur s'est produite lors de l'ajout du projet.");
        console.error("Error adding project:", error);
    }

  };

  return (
    <section className="AjEquipement"> 
      <Sidebar menuType={projectMenu} />
      <div className="equipement-form">
        <h2>Ajouter un Projet</h2> 
        <ToastContainer />
        <form onSubmit={handleSubmit} className="formEq"> 
          <label htmlFor="NomProjet">Nom du Projet<span className="required" title="ce champ est obligatoire">*</span></label>
          <input
            type="text"
            name="NomProjet"
            value={NomProjet}
            onChange={(e) => setNomProjet(e.target.value)}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="DateDébut">Date de début<span className="required" title="ce champ est obligatoire">*</span></label>
          <input
            type="date"
            name="DateDébut"
            value={DateDébut}
            onChange={(e) => setDateDebut(e.target.value)}
            required
          />
          <span className="error">{startDateError}</span>

          <label htmlFor="DateFin">Date de fin<span className="required" title="ce champ est obligatoire">*</span></label>
          <input
            type="date"
            name="DateFin"
            value={DateFin}
            onChange={(e) => setDateFin(e.target.value)}
            required
          />
          <span className="error">{endDateError}</span>

          <label htmlFor="BudgetConsacré">Budget consacré</label>
          <input
            type="number"
            name="BudgetConsacré"
            value={BudgetConsacré}
            onChange={(e) => setBudgetConsacré(e.target.value)}
         
          />

          <div className="button-container"> 
            <button type="submit">Ajouter Projet</button>
          </div>
        </form>
      </div>

    </section>
  );
};

export default FormAjouterProjet;
