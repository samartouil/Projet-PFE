import React, { useState, useEffect } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './detailsProjet.css'
import request from "../../utils/request";
import Sidebar from "../../components/sidebarEq";
import projectMenu from "../../data/projetMenu";
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';


const DetailsProject = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialProjectDetails, setInitialProjectDetails] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);
  const [utilisateursAffectes, setUtilisateursAffectes] = useState([]);
  const [equipementsAffectes, setEquipementsAffectes] = useState([]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await request.get(`/api/projets/detailsProject/${id}`);
        console.log("Réponse du backend :", response.data);

        // Sauvegarder les détails initiaux en formatant les dates
        const projectData = {
          ...response.data.project,
          DateDébut: response.data.project.DateDébut ? new Date(response.data.project.DateDébut).toISOString().split('T')[0] : '',
          DateFin: response.data.project.DateFin ? new Date(response.data.project.DateFin).toISOString().split('T')[0] : ''
        };

        setInitialProjectDetails(projectData);
        setProjectDetails(projectData);
        setUtilisateursAffectes(response.data.utilisateursAffectés);
        setEquipementsAffectes(response.data.equipementsAffectes);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleEditModeToggle = () => {
    setProjectDetails(initialProjectDetails);
    setIsEditMode(!isEditMode);
  };

  const handleInputChange = (e) => {
    setProjectDetails({ ...projectDetails, [e.target.name]: e.target.value });
  };

  const validateDates = () => {
    const startDate = new Date(projectDetails.DateDébut);
    const endDate = new Date(projectDetails.DateFin);
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

    if (projectDetails.BudgetConsacré < 0) {
      toast.error("Le budget ne peut pas être négatif.");
      return;
    }

    const dateValidationResult = validateDates();
    if (!dateValidationResult.valid) {
      toast.error(dateValidationResult.message);
      return;
    }

    try {
      await request.put(`/api/projets/detailsProject/${id}`, { ...projectDetails });
      setIsEditMode(false);
      toast.success("Projet modifié avec succès !");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Une erreur s'est produite lors de la modification du projet.");
    }
  };

  const handleCancelEdit = () => {
    setProjectDetails(initialProjectDetails); // Restaurer les détails initiaux
    setIsEditMode(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Voulez-vous supprimer ce projet ?',
      text: 'Cette action ne peut pas être annulée.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    });
  
    if (result.isConfirmed) {
      try {
        await request.delete(`/api/projets/detailsProject/${id}`);
        toast.success('Projet supprimé avec succès');
        navigate('/projets'); 
      } catch (error) {
        toast.error('Erreur lors de la suppression du projet');
      }
    }
  };

  

  return (
    <div className="container-details">
      <div>
        <button className="delete-button" onClick={() => handleDelete(projectDetails._id)} title="Supprimer ce Projet">
            <FaTrash />
          </button>
      </div>
      <Sidebar menuType={projectMenu} />
      <h1>Détails du Projet</h1>
      <ToastContainer />
      
      <div>
        
        <label className="details-label">
          <i class="bi bi-tag-fill"></i> Nom du Projet
        </label>
        {isEditMode ? (
          <input className="details-input" type="text" name="NomProjet" value={projectDetails?.NomProjet} onChange={handleInputChange} />
        ) : (
          <input className="details-input" type="text" value={projectDetails?.NomProjet || ''} readOnly />
        )}
      </div>
      <div>
        <label className="details-label">
          <i class="bi bi-pencil-square"></i> Description
        </label>
        {isEditMode ? (
          <textarea className="details-textarea" name="description" value={projectDetails?.description} onChange={handleInputChange} />
        ) : (
          <textarea className="details-textarea" value={projectDetails?.description} readOnly />
        )}
      </div>
      <div>
        <label className="details-label">
          <i class="bi bi-calendar-check"></i>  Date de début
        </label>
        {isEditMode ? (
          <input className="details-input" type="date" name="DateDébut" value={projectDetails?.DateDébut || ''} onChange={handleInputChange} />
        ) : (
          <input className="details-input" type="text" value={projectDetails?.DateDébut || ''} readOnly />
        )}
      </div>
      <div>
        <label className="details-label"><i class="bi bi-calendar-check"></i>  Date de fin</label>
        {isEditMode ? (
          <input className="details-input" type="date" name="DateFin" value={projectDetails?.DateFin || ''} onChange={handleInputChange} />
        ) : (
          <input className="details-input" type="text" value={projectDetails?.DateFin || ''} readOnly />
        )}
      </div>
      <div>
        <label className="details-label"> <i class="bi bi-currency-exchange"></i> BudgetConsacré </label>
        {isEditMode ? (
          <input className="details-input" type="number" name="BudgetConsacré" value={projectDetails?.BudgetConsacré} onChange={handleInputChange} />
        ) : (
          <input className="details-input" type="number" value={projectDetails?.BudgetConsacré} readOnly />
        )}
      </div>
      <div>
        <label className="details-label"> <i class="bi bi-people"></i> Équipe affectée</label>
        {isEditMode ? (
          <textarea className="details-textarea" name="equipeAffectee" value={utilisateursAffectes.map(utilisateur => `${utilisateur.username}`).join('\n')} onChange={handleInputChange} />
        ) : (
          <textarea className="details-textarea" value={utilisateursAffectes.map(utilisateur => `${utilisateur.username}`).join('\n')} readOnly />
        )}
      </div>
      <div>
        <label className="details-label"> <i className="bi bi-box"></i> Équipements affectés</label>
        {isEditMode ? (
          <textarea className="details-textarea" name="equipementsAffectee" value={equipementsAffectes.map(equipements => `${equipements.equipement.EQname}`).join('\n')} onChange={handleInputChange} />
        ) : (
          <textarea className="details-textarea" value={equipementsAffectes.map(equipements => `${equipements.equipement.EQname}`).join('\n')} readOnly />
        )}

      </div>

      {isEditMode ? (
        <div>
          <button className="details-button" onClick={handleSubmit}>Valider</button>
          <button className="details-button" onClick={handleCancelEdit}>Annuler</button>
        </div>
      ) : (
        <button className="details-button" onClick={handleEditModeToggle}>Modifier</button>
      )}
    </div>
  );
};

export default DetailsProject;