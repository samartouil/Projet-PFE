import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import request from '../../utils/request';

// Définissez le style du modal
const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
};

const ArmoireSearchModal = ({ isOpen, onRequestClose, onSearch }) => {
  const [selectedArmoire, setSelectedArmoire] = useState('');
  const [armoires, setArmoires] = useState([]);

  useEffect(() => {
    const fetchArmoires = async () => {
      try {
        const response = await request.get('/api/equipements/emplacements/armoires'); 
        setArmoires(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des armoires:', error);
      }
    };

    fetchArmoires();
  }, []);
  
  const handleSearch = () => {
    onSearch(selectedArmoire); // Déclencher la recherche avec l'armoire sélectionnée
    onRequestClose(); // Fermer le modal
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      contentLabel="Rechercher par Armoire"
    >
      <h2>Rechercher par Armoire</h2>
      <select
        value={selectedArmoire}
        onChange={(e) => setSelectedArmoire(e.target.value)}
      >
        <option value="">Sélectionnez une armoire</option>
        {armoires.map((armoire) => (
          <option key={armoire._id} value={armoire.name}>
            {armoire.name}
          </option>
        ))}
      </select>

      <button onClick={handleSearch}>Rechercher</button>
      <button onClick={onRequestClose}>Annuler</button>
    </Modal>
  );
};

export default ArmoireSearchModal;
