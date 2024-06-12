import { useState, useEffect } from "react";
import "./updateProfile.css";
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import request from "../../utils/request";


const UpdateProfileModal=({setUpdateProfile}) =>{

    const { id } = useParams();
    const [user, setUser] = useState({});
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');



    useEffect(() => {
        // Fetch the user's profile data
        request.get(`/api/users/profile/${id}`)
          .then((response) => {
            setUser(response.data);
            setUsername(response.data.username);
            setEmail(response.data.email);
            setPhone(response.data.phone);
          })
          .catch((error) => {
            console.error(error);
            toast.error("Erreur lors du chargement du profil");
          });
      }, [id]);
   
    const formSubmitHandler = async (e) => {
        e.preventDefault();

        const updateData = {
            username,
            email,
            phone,
          };
      
          if (password.trim() !== '') {
            updateData.password = password;
          }
      
          try {
            const response = await request.put(`/api/users/profile/${id}`, updateData);
            console.log("Backend response:", response.data); 
            setUser(response.data);
            toast.success("Profil mis à jour avec succès");
          } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Erreur lors de la mise à jour";
            toast.error(errorMessage);
          }
        
    };

    return(
        <div className="update-profile">
            <form onSubmit={formSubmitHandler} className="update-profile-form">
                <abbr title="close">
                    <i onClick={() => setUpdateProfile(false)}
                    className="bi bi-x-circle-fill update-profile-form-close">
                    </i>
                </abbr>
                <h1 className="updtae-profile-title">Modifier Profil</h1>
                <input type="text"
                className="update-profile-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom & Prénom"
                />
                <input type="text"
                className="update-profile-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                />
                <input type="text"
                className="update-profile-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Numéro de télèphone"
                />
                <input type="password"
                className="update-profile-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de Passe"
                />
                <button type="submit" className="update-profile-btn">
                    Valider
                </button>
            </form>
            <ToastContainer/>
        </div>
    );
    
}

export default UpdateProfileModal;