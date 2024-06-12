import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import './AffectUsers.css'; 
import request from '../../utils/request';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const AffectUserModal = ({ isOpen, onRequestClose }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedStagiaires, setSelectedStagiaires] = useState([]);
  const [selectedChercheurs, setSelectedChercheurs] = useState([]);

  const [projects, setProjects] = useState([]); 
  const [utilisateurs, setUtilisateurs] = useState([]); 



  const handleProjectChange = (selected) => {
    setSelectedProject(selected);
  };

  const handleStagiairesChange = (selected) => {
    setSelectedStagiaires(selected);
  };

  const handleChercheursChange = (selected) => {
    setSelectedChercheurs(selected);
  };

  const handleSubmit = async() => {
    try {
      const response = await request.post("/api/projets/affectUserModal", {
        projectId: selectedProject.value,
        selectedUsers: [
          ...selectedStagiaires.map(stagiaire => stagiaire.value),
          ...selectedChercheurs.map(chercheur => chercheur.value)
        ]
      });
      console.log(response.data.message); 
      toast.success("Utilisateur(s) affecté(s) avec succés");
      onRequestClose(); 
      
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
      } else {
          toast.error('Une erreur s\'est produite lors de l\'affectation des utilisateurs au projet.');
      }
    }
  };


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await request.get("/api/projets/listeProjets");
        setProjects(response.data); 
      } catch (error) {
        console.error(error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const response = await request.get("/api/users");
        setUtilisateurs(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUtilisateurs();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Affecter un utilisateur à un projet"
      ariaHideApp={false}
      className="affect-user-modal"
      overlayClassName="affect-user-overlay"
    >
      <h2 className="modal-title">Affecter un utilisateur à un projet</h2>

      <div className="modal-user-content">
        <div className="project-selection"> 
          <label>Choisir un projet:</label>
          <Select
            options={projects.map(project => ({ value: project._id, label: project.NomProjet }))}
            value={selectedProject}
            onChange={handleProjectChange}
          />
        </div>

        <div className="stagiaire-selection"> 
          <label>Choisir stagiaire(s):</label>
          <Select
            options={utilisateurs.filter(user => user.role === 'stagiaire').map(utilisateur => ({ value: utilisateur._id, label: utilisateur.username }))}
            isMulti={true}
            value={selectedStagiaires}
            onChange={handleStagiairesChange}
          />
        </div>

        <div className="chercheur-selection">
          <label>Choisir chercheur(s):</label>
          <Select
            options={utilisateurs.filter(user => user.role === 'chercheur').map(utilisateur => ({ value: utilisateur._id, label: utilisateur.username }))}
            isMulti={true}
            value={selectedChercheurs}
            onChange={handleChercheursChange}
          />
        </div>

        <div className="modal-buttons">
          <button onClick={handleSubmit}>Soumettre</button>
          <button onClick={onRequestClose}>Annuler</button>
        </div>
      </div>
      <ToastContainer/>
    </Modal>
  );
};

export default AffectUserModal;
