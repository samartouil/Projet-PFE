import "./login.css"
import { useState } from "react";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import {useDispatch } from "react-redux";
import { loginUser } from "../../redux/apiCalls/authApiCall";



const Login = () => {
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");

    const dispatch= useDispatch();

    const formSubmitHandler = (e) =>{
        e.preventDefault()
        if(email.trim() ==="") return toast.error("Email est requis");
        if(password.trim() ==="") return toast.error("Mot de passe est requis");
        dispatch(loginUser({email, password}));
    }

    return (
        <div className="login-box">
          <ToastContainer/>
          <h2>Connexion</h2>
          <form onSubmit={formSubmitHandler}>
            <div className="formL-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Entrer l'email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="formL-group">
              <label htmlFor="password">Mot De Passe:</label>
              <input
                type="password"
                id="password"
                placeholder="Saisir un Mot De Passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="login-btn" type="submit">Connexion</button>
          </form>
          <div className="formL-footer">
                Mot De Passe oublié ? <Link to =""> Oublié</Link>
          </div>
        </div>
      );
}
 
export default Login;




