import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import request from '../../utils/request';
import './eqDetails.css'; // Fichier CSS à créer
import UpdateEquipementModal from './UpdateEquipementModal';
import { useSelector } from "react-redux";
import { ReactToPrint } from 'react-to-print'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import BackButton from "../../components/backButton";
import FicheEquipemet from '../../components/EQimprime/EQimprime';

const EquipmentDetail = () => {
  const { id } = useParams(); 
  const [equipement, setEquipement] = useState({});
  const [affectations, setAffectations] = useState([]);
  const [updateEquipement, setUpdateEquipement] = useState(false);
  const componentRef = useRef();
  const { user } = useSelector(state => state.auth);
  


  const fetchEquipementDetails = async () => {
    try {
      const response = await request.get(`/api/equipements/${id}`);
      setEquipement(response.data.equipement);
      setAffectations(response.data.projetsAffectes);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des détails de l\'équipement');
    }
  };

  //bech tetaawd kol m yetbadl id
  useEffect(() => {
    fetchEquipementDetails();
  }, [id]);

  const handleOpenModal = () => {
    setUpdateEquipement(true);
  };

  return (
    <section className="equipment-detail">
      <ToastContainer/>
      <BackButton />
      <h2>Détails de l'équipement</h2>
      
      <div className="equipment-info">
      <div className="actions-bar">
        <ReactToPrint
          trigger={() => (
            <button className="print-equipment-btn">
              <FontAwesomeIcon icon={faPrint} /> Imprimer
            </button>
          )}
          content={() => componentRef.current} 
        />
      </div>
        <div className="equipment-photo">
          <img src={equipement.EQphoto?.url} alt={equipement.EQname} />
        </div>

        <div className="equipment-details">
          <div className="detail">
            <label>Nom : </label>
            <span>{equipement.EQname}</span>
          </div>

          <div className="detail">
            <label>Description : </label>
            <span>{equipement.EQdescription}</span>
          </div>

          <div className="detail">
            <label>Stock : </label>
            <span>{equipement.EQstock}</span>
          </div>

          <div className="detail">
            <label>Emplacement : </label>
            <span>
              {equipement.EQplace?.armoireId?.name} - {equipement.EQplace?.name}
            </span>
          </div>

          <div className="detail">
            <label>Nombre de Pièce Défaillantes : </label>
            <span>
              {equipement.NbrDefaillant} 
            </span>
          </div>

          <div className="detail">
            <label>Projets : </label>
            <span>
              {affectations?.map(affectation => (
                <div key={affectation._id}>
                  {affectation.projet.NomProjet}
                </div>
              ))}
            </span>
          </div>

          <div className="detail">
            <label>Budget : </label>
            <span>
              {equipement.EQbudget?.name} 
            </span>
          </div>

          <div className="detail">
            <label>Prix : </label>
            <span>{equipement.EQprix} DT</span>
          </div>

          
        </div>

        {(user&& user.role === 'admin' || user.user==='responsable laboratoire' || user.user==='chercheur') &&(<button
          type="button"
          onClick={handleOpenModal}
          className="update-equipment-btn"
        >
          Modifier l'équipement
        </button>)}
      </div>

      {updateEquipement && (
        <UpdateEquipementModal
          isOpen={updateEquipement}
          onClose={() => setUpdateEquipement(false)}
          equipement={equipement}
          onUpdateSuccess={fetchEquipementDetails} 
        />
      )}

      <div style={{ display: 'none' }}>
        <FicheEquipemet
          equipement={equipement}
          projets = {affectations}
          printedBy={user.username}
          ref={componentRef} 
        />
      </div>
    </section>
  );
};

export default EquipmentDetail;
