import "./register.css"
import { useEffect, useState } from "react";
import {toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useDispatch, useSelector} from "react-redux"
import { register } from "../../redux/apiCalls/authApiCall";
import {authActions}from "../../redux/slices/authSlice";
import swal from "sweetalert";



const Register = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const {registerMessage,registerError} = useSelector(state => state.auth)

    const [username, setusername]= useState("")
    const [email, setemail]= useState("")
    const [role, setrole]= useState("")
    const [password, setpassword]= useState("")
    const [confirmPassword, setconfirmPassword]= useState("")


    
    const resetForm = () => {
        setusername("");
        setemail("");
        setrole("");
        setpassword("");
        setconfirmPassword("");
    };

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        if (username.trim() === "") return toast.error("Nom d'utilisateur est requis");
        if (email.trim() === "") return toast.error("Email est requis");
        if (password.trim() === "") return toast.error("Mot de passe est requis");
        if (confirmPassword.trim() === "") return toast.error("Confirmation du mot de passe est requise");
        if (role === "") return toast.error("Role est requis");
        if (password !== confirmPassword) return toast.error("Les mots de passe ne correspondent pas");
      
        try {
          await dispatch(register({ username, email, password, role, confirmPassword }));
          //traja3ha null baa3d el creation
          dispatch(authActions.register(null));
          resetForm();
        } catch (error) {
          toast.error("Une erreur s'est produite lors de la création du compte.");
        }
      };
    
    useEffect(() => {
        if (registerMessage) {
            swal({
                title: registerMessage,
                icon: "success"
            });
        }
        if (registerError) {
            toast.error(registerError);
          }
        }, [registerMessage, registerError]);
    
   

    return (  
        < section className="form-container">
          
            <h1 className="form-title">Créer Compte utilisateur</h1>
            <form onSubmit={formSubmitHandler} className="form" >
                <div className="form-group" >
                   <label htmlFor="username" className="form-label">
                         Nom&Prénom <span className="required" title="ce champ est obligatoire">*</span>
                   </label>
                   <input 
                   type="text"
                   className="form-input"
                   id="username"
                   placeholder="Entrer Nom et Prénom"
                   value={username}
                   onChange={(e) => setusername(e.target.value)}
                   />
                </div>
                <div className="form-group" >
                   <label htmlFor="email" className="form-label">
                         Email <span className="required" title="ce champ est obligatoire">*</span>
                   </label>
                   <input 
                   type="email"
                   className="form-input"
                   id="email"
                   placeholder="Entrer l'email"
                   value={email}
                   onChange={(e) => setemail(e.target.value)}
                   />
                </div>
                <div className="form-group" >
                   <label htmlFor="role" className="form-label">
                         Role <span className="required" title="ce champ est obligatoire">*</span>
                   </label>
                   <select
                   type="role"
                   className="form-input"
                   id="role"
                   placeholder="Choisir le Role"
                   value={role}
                   onChange={(e) => setrole(e.target.value)}
                   >
                    <option value="">Selectionnez une option</option>
                    {user?.isAdmin? <option  value="responsable laboratoire">Responsable Laboratoire</option> : <></>}
                    {user && (user.isAdmin || user.role === 'responsable laboratoire') && (<option value="chercheur">Chercheur</option>)}
                    <option value="stagiaire">Stagiaire</option>

                   </select>
                </div>
                <div className="form-group" >
                   <label htmlFor="password" className="form-label">
                         MotDePasse <span className="required" title="ce champ est obligatoire">*</span>
                   </label>
                   <input 
                   type="password"
                   className="form-input"
                   id="password"
                   placeholder="Saisir un Mot De Passe"
                   value={password}
                   onChange={(e) => setpassword(e.target.value)}
                   />
                </div>
                <div className="form-group" >
                   <label htmlFor="confirmPassword" className="form-label">
                         ConfirmerMotDePasse <span className="required" title="ce champ est obligatoire">*</span>
                   </label>
                   <input 
                   type="password"
                   className="form-input"
                   id="confirmPassword"
                   placeholder="Confirmer Mot De Passe"
                   value={confirmPassword}
                   onChange={(e) => setconfirmPassword(e.target.value)}
                   />
                </div>
                <button  className="form-btn" type="submit">
                    Créer
                </button>
            </form>
            <ToastContainer />
        </ section>
    );
}
 
export default Register;