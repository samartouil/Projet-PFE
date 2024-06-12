import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './AffectEquipement.css'; // Feuille de style
import Select from 'react-select';
import request from '../../utils/request';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer,toast } from 'react-toastify';


const AffectEquipmentModal = ({ isOpen, onRequestClose }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [numberOfEquipments, setNumberOfEquipments] = useState(0);
  const [equipmentSelections, setEquipmentSelections] = useState([]);
  //const [equipmentSearchText, setEquipmentSearchText] = useState('');
  const [projectOptions, setProjectOptions] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);

 


  useEffect(() => {
    if (!isOpen) {
      fetchProjects();
      fetchEquipments();
      resetForm();
    }
  }, [isOpen]);

  const handleProjectChange = (option) => {
    setSelectedProject(option);
  };



  const fetchProjects = async () => {
    try {
      const response = await request.get('/api/projets/listeProjets');
      const projects = response.data.map(project => ({
        value: project._id,
        label: project.NomProjet
      }));
      setProjectOptions(projects);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
    }
  };

  const fetchEquipments = async () => {
    try {
      const response = await request.get('/api/equipements/');
      const equipments = response.data.map(equipment => ({
        value: equipment._id,
        label: equipment.EQname,
        stock: equipment.EQstock
      }));
      setEquipmentOptions(equipments);
    } catch (error) {
      console.error('Erreur lors de la récupération des équipements:', error);
    }
  };

  
  const resetForm = () => {
    setSelectedProject(null);
    setNumberOfEquipments(0);
    setEquipmentSelections([]);
  };


  const handleNumberOfEquipmentsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setNumberOfEquipments(value);
      setEquipmentSelections((prevSelections) => {
        if (value > prevSelections.length) {
            // Ajouter de nouveaux équipements
            return [
              ...prevSelections,
              ...Array(value - prevSelections.length).fill({ equipment: null, pieceCount: 1 }),
            ];
          } else if (value < prevSelections.length) {
            // Supprimer les équipements excédentaires
            return prevSelections.slice(0, value);
          }
          return prevSelections;
      });
    }
  };

  const getAvailableEquipmentOptions = (index) => {
    const selectedEquipmentIds = equipmentSelections
      .filter((selection, i) => i !== index)
      .map(selection => selection.equipment?.value);
    return equipmentOptions.filter(equipment => !selectedEquipmentIds.includes(equipment.value));
  };

  const handleEquipmentSelection = (index, option) => {
    const newSelections = [...equipmentSelections];
    if (option) {
      const equipment = equipmentOptions.find((equip) => equip.value === option.value);
      newSelections[index] = {
        equipment: option,
        pieceCount: 1,
        maxStock: equipment ? equipment.stock : 0,
      };
    } else {
      newSelections[index] = {
        equipment: null,
        pieceCount: 1,
        maxStock: 0,
      };
    }
    setEquipmentSelections(newSelections);
  };
  
  const handlePieceCountChange = (index, newCount) => {
    const newSelections = [...equipmentSelections];
    newSelections[index].pieceCount = newCount;
    setEquipmentSelections(newSelections);
  };
  

  const handleSubmit = async () => {
    const payload = {
      projectId: selectedProject ? selectedProject.value : null,
      selectedEquipements: equipmentSelections.map(selection => ({
        equipementId: selection.equipment.value,
        nombrePieces: selection.pieceCount
      }))
    };

    try {
      const response = await request.post('/api/projets/affectEquipement', payload);

      toast.success("Equipement(s) affecté(s) avec succés")
      onRequestClose();
    } catch (error) {
       if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message); 
      } else {
        console.error('Erreur lors de l\'envoi des données:', error);
        toast.error('Erreur lors de l\'affectation des équipements.');
      }
    }
  };

  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Affecter des équipements à un projet"
      ariaHideApp={false}
      className="affect-equipement-modal" 
      overlayClassName="affect-equipement-overlay"
    >
      <ToastContainer />
      
      <h2 className="modal-title">Affecter des équipements à un projet</h2>
      <div className="modal-content">
     
        <div className="project-selection">
          <label>Choisir un projet:</label>
          <Select
            options={projectOptions}
            value={selectedProject}
            onChange={handleProjectChange}
          />
        </div>

        <div className="number-of-equipments">
          <label>Nombre d'équipements à affecter:</label>
          <input
            type="number"
            value={numberOfEquipments}
            onChange={handleNumberOfEquipmentsChange}
            min={1}
          />
        </div>

        <div className="equipment-selection-dispo">
          {equipmentSelections.map((selection, index) => (
            <div key={index} className="equipment-selection">
              <label>Équipement {index + 1}:</label>
              <Select
                options={getAvailableEquipmentOptions(index)}
                value={selection.equipment}
                onChange={(option) => handleEquipmentSelection(index, option)}
                isClearable={true} 
              />

              {selection.equipment && (
                <>
                  <label>Nombre de pièces (Stock max: {selection.maxStock}):</label>
                  <input
                    type="number"
                    min={1}
              
                    value={selection.pieceCount}
                    onChange={(e) =>
                      handlePieceCountChange(index, parseInt(e.target.value, 10))
                    }
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="modal-buttons">
          <button onClick={handleSubmit}>Soumettre</button>
          <button onClick={onRequestClose}>Annuler</button>
        </div>
      </div>
     
    </Modal>
  );
};

export default AffectEquipmentModal;
