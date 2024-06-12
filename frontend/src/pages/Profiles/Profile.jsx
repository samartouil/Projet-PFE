import React, { useEffect, useState } from 'react';
import "./profile.css";
import {  useDispatch } from 'react-redux';
import {useParams} from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import request from '../../utils/request';
import {  uploadProfilePhoto } from '../../redux/apiCalls/profileApiCall';
import UpdateProfileModal from './UpdateProfileModal';
import BackButton from "../../components/backButton";


const Profile = () => {
    const dispatch=useDispatch();
    
    const [file, setFile] = useState(null);
    const [updateProfile, setUpdateProfile] =useState(false);

    const { id } = useParams();
    const [user, setUser] = useState({});
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('')
    
        
    useEffect(() => {
            // Fetch the user's profile data
            request.get(`/api/users/profile/${id}`)
            .then((response) => {
                setUser(response.data);
                setUsername(response.data.username);
                setEmail(response.data.email);
                setPhone(response.data.phone);
                setProfilePhoto(response.data.profilePhoto)
            })
            .catch((error) => {
                console.error(error);
                toast.error("Erreur lors du chargement du profil");
            });
        }, [id]);

   const formSubmitHandler = async (e) =>{
        e.preventDefault();
        if (!file) return toast.warning("pas de fichier choisi !");

        const formData= new FormData();
        formData.append("image", file);

        dispatch(uploadProfilePhoto(formData));
        
      };
      

    /********* delete account
    const deleteAccountHandler = () =>{
        swal({
            title: "Vous étes sur?",
            text: "Une fois supprimé, vous ne pouvez pas le récupérer",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) =>{
            if (willDelete){
                swal ("Compte supprimé!", {
                    icon: "success",
                });
            }else {
                swal("Une erreur s'est produite!");
            }
        });
    } *********/




    return (
        <section className="profile">
            <BackButton />
            <h2>Profil</h2>
            <div className="profile-header">
                <div className="profile-image-wrapper">
                    
                        {/* <img src={file? URL.createObjectURL(file):"/images/user-avatar.png"} alt="" className="profile-image" /> */}
                        <img src={`http://localhost:8000/${profilePhoto.url}`} alt="" className="profile-image"/>
                        
                  
                    <form onSubmit={formSubmitHandler}>
                        <abbr title="Choose profile photo">
                            <label htmlFor="file" className="bi bi-camera-fill upload-profile-photo-icon"></label>
                        </abbr>
                        <input
                            style={{ display: 'none' }}
                            type="file"
                            name="file"
                            id="file"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <button type="submit" className="upload-profile-photo-btn">upload</button>
                    </form>
                </div>
                <div className="profile-info">
                
                    <div className="profile-info-column">
                        
                        <label htmlFor="nom">Nom et prénom : </label>
                        
                            <span>{username}</span>
                        
                    </div>

                    <div className="profile-info-column">
                        <label htmlFor="email">Email : </label>
                        
                            <span>{email}</span>
                        
                    </div>
                    <div className="profile-info-column">
                        <label htmlFor="role">Role : </label>
                       
                            <div className="styled-info">{user.role}</div>
                       
                    </div>


                   
                 
                    <div className="profile-info-column">
                        <label htmlFor="phone">Numéro de téléphone : </label>
                        
                            <span>{phone}</span>
                        
                    </div>
                
                        <button onClick={() => setUpdateProfile(true)} type="button"  className="profile-update-btn">
                        Modifier Profil
                         </button>
                {updateProfile && (
                    <UpdateProfileModal setUpdateProfile={setUpdateProfile}/>
                )}
                    
        
                
                </div>
            </div>
            <ToastContainer />
        </section>
    );
};

export default Profile;
