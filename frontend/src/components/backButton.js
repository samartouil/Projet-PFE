import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi'; 
import './backButton.css';


const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); 
  };

  return (
    <button onClick={goBack} className="back-button">
      <HiArrowLeft size={20} />
      Retour
    </button>
  );
};

export default BackButton;
