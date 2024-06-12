import React from 'react';
import './EQimprimer.css'; 


const FicheEquipemet = React.forwardRef(({ equipement, projets, printedBy }, ref) => (
  <div ref={ref} className="equipment-sheet">
    <div className="headerr">
      <img src="/logosg.png" alt="Logo" className="logo-left-logo" /> 
      <h2 className='fiche-title'>Fiche Technique de l'Équipement</h2>
      <img src="/logoCRMN.png" alt="Logo" className="logo-right-logo" /> 
    </div>
    <div className="equipment-photo-fiche">
      <img src={equipement.EQphoto?.url} alt={equipement.EQname} />
    </div>
    <div className="equipment-fiche">
      <div className="detaills">
        <label>Nom </label>
        <span>{equipement.EQname}</span>
      </div>
      <div className="detaills">
        <label>Description </label>
        <span>{equipement.EQdescription}</span>
      </div>
      <div className="detaills">
        <label>Stock </label>
        <span>{equipement.EQstock}</span>
      </div>
      <div className="detaills">
        <label>Emplacement </label>
        <span>
          {equipement.EQplace?.armoireId?.name} - {equipement.EQplace?.name}
        </span>
      </div>
      <div className="detaills">
        <label>Nombre de Pièce Défaillantes </label>
        <span>{equipement.NbrDefaillant}</span>
      </div>
      <div className="detaills">
        <label>Projets :</label>
        <span>{projets.map((projet, index) => (
          <div key={index}>
            {projet.projet.NomProjet}
          </div>
        ))}</span>
      </div>
      <div className="detaills">
        <label>Budget </label>
        <span>{equipement.EQbudget?.name}</span>
      </div>
      <div className="detaills">
        <label>Prix </label>
        <span>{equipement.EQprix} DT</span>
      </div>
    </div>
    <div className="printed-by">
      <label>Imprimé par </label>
      <span>{printedBy}</span>
    </div>
  </div>
));

export default FicheEquipemet;