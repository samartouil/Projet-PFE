import React, { useState } from 'react';
import "./profile.css";
import imgav from "../../images/user-avatar.png";

const Profile = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [editable, setEditable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [profileData, setProfileData] = useState({
        nom: "amal maatouk",
        email: "example@example.com",
        role: "Utilisateur",
        password: "152876",
        phone: '+216 51857247'
    });

    const [editedProfileData, setEditedProfileData] = useState({ ...profileData });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setProfileImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = (event) => {
        event.preventDefault();
        setProfileData(editedProfileData);
        toggleEdit();
        console.log("Profil mis à jour !");
    };

    const toggleEdit = () => {
        setEditable(!editable);
        // Si l'utilisateur annule l'édition, restaurez les valeurs originales
        if (!editable) {
            setEditedProfileData({ ...profileData });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditedProfileData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <section className="profile">
            <div className="profile-header">
                <div className="profile-image-wrapper">
                    {profileImage ? (
                        <img src={profileImage} alt="" className="profile-image" />
                    ) : (
                        <img src={imgav} alt="" className="profile-image" />
                    )}
                    <form>
                        <abbr title="Choose profile photo">
                            <label htmlFor="file" className="bi bi-camera-fill upload-profile-photo-icon"></label>
                        </abbr>
                        <input
                            style={{ display: 'none' }}
                            type="file"
                            name="file"
                            id="file"
                            onChange={handleFileChange}
                        />
                    </form>
                </div>
                <div className="profile-info">
                    <div className="profile-info-column">
                        <label htmlFor="nom">Nom et prénom:</label>
                        {editable ? (
                            <input type="text" id="nom" name="nom" value={editedProfileData.nom} onChange={handleChange} />
                        ) : (
                            <div className="styled-info">{profileData.nom}</div>
                        )}
                    </div>

                    <div className="profile-info-column">
                        <label htmlFor="email">Email:</label>
                        {editable ? (
                            <input type="text" id="email" name="email" value={editedProfileData.email} onChange={handleChange} />
                        ) : (
                            <div className="styled-info">{profileData.email}</div>
                        )}
                    </div>
                    <div className="profile-info-column">
                        <label htmlFor="role">Role:</label>
                        {editable ? (
                            <input type="text" id="role" name="role" value={editedProfileData.role} onChange={handleChange} />
                        ) : (
                            <div className="styled-info">{profileData.role}</div>
                        )}
                    </div>
                    <div className="profile-info-column">
                    <label htmlFor="password">Mot de passe:</label>

                    {editable?(
                     <div className="password-input-container"> 
                      <input
                       type={showPassword ? "text" : "password"}
                       id="password"
                       name="password"
                       value={editable ? profileData.password : profileData.password}
                       onChange={handleChange}
                   /> 
                        <i
                            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                            onClick={togglePasswordVisibility}
                        ></i>
                       </div>
                    ) : (
                        <p>*********</p>
                    )}
                      
                 </div>
                    <div className="profile-info-column">
                        <label htmlFor="phone">Numéro de téléphone:</label>
                        {editable ? (
                            <input type="text" id="phone" name="phone" value={editedProfileData.phone} onChange={handleChange} />
                        ) : (
                            <div className="styled-info">{profileData.phone}</div>
                        )}
                    </div>
                    <button onClick={toggleEdit} className="profile-update-btn" type="submit">
                        <i className="bi bi-file-person-fill"></i>{editable ? "Valider" : "Modifier Profile"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Profile;
