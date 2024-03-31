import "./register.css"
import { useState } from "react";



const Register = () => {
  

    return (  
        < section className="form-container">
            <h1 className="form-title">Créer Compte utilisateur</h1>
            <form className="form" >
                <div className="form-group" >
                   <label htmlFor="username" className="form-label">
                         Nom&Prénom
                   </label>
                   <input 
                   type="text"
                   className="form-input"
                   id="username"
                   placeholder="Entrer Nom et Prénom"
                   />
                </div>
                <div className="form-group" >
                   <label htmlFor="email" className="form-label">
                         Email
                   </label>
                   <input 
                   type="email"
                   className="form-input"
                   id="email"
                   placeholder="Entrer l'email"
                   />
                </div>
                <div className="form-group" >
                   <label htmlFor="Role" className="form-label">
                         Role
                   </label>
                   <select
                   type="Role"
                   className="form-input"
                   id="Select"
                   placeholder="Choisir le Role"
                   >
                    <option value="">Selectionnez une option</option>
                    <option value="responsable">Responsable Laboratoire</option>
                    <option value="chercheur">Chercheur</option>
                    <option value="stagiaire">Stagiaire</option>

                   </select>
                </div>
                <div className="form-group" >
                   <label htmlFor="password" className="form-label">
                         MotDePasse
                   </label>
                   <input 
                   type="password"
                   className="form-input"
                   id="password"
                   placeholder="Saisir un Mot De Passe"
                   />
                </div>
                <div className="form-group" >
                   <label htmlFor="confirmpassword" className="form-label">
                         ConfirmerMotDePasse
                   </label>
                   <input 
                   type="confirmpassword"
                   className="form-input"
                   id="Confirmpassword"
                   placeholder="Confirmer Mot De Passe"
                   />
                </div>
                <button  className="form-btn" type="submit">
                    Créer
                </button>
            </form>
        </ section>
    );
}
 
export default Register;