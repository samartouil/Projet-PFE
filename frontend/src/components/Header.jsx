import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./header.css"
import { useSelector , useDispatch} from "react-redux";
import { logout } from "../redux/apiCalls/authApiCall";
import request from "../utils/request";
import { BiBell } from "react-icons/bi";


const Header = () => {
const dispatch = useDispatch();
    //el user eli mawjouda fel auth
const { user } = useSelector(state => state.auth);


const [toggle, setToggle] =useState(false);
const [hasNotification, setHasNotification] = useState(false);
const [notificationList, setNotificationList] = useState([]);
const [showEquipmentList, setShowEquipmentList] = useState(false);
const [showPlatformList, setShowPlatformList] = useState(false);

useEffect(() => {
    
    const fetchEquipmentsWithLowSecurityStock = async () => {
        try {
            const response = await request.get("/api/equipements/lowstock"); 
            if (response.data.length > 0) {
                setNotificationList(response.data);
                console.log(response.data.length);
                setHasNotification(true);
                console.log(hasNotification)
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des équipements avec un stock de sécurité faible :", error);
        }
    };

    fetchEquipmentsWithLowSecurityStock(); 
}, [hasNotification]);

    const toggleEquipmentList = () => {
        setShowEquipmentList(prevState => !prevState); 
    }; 

    const scrollToAboutUs = () => {
        const aboutUsSection = document.getElementById('about-us');
        if (aboutUsSection) {
            window.scrollTo({
                top: aboutUsSection.offsetTop,
                behavior: 'smooth'
            });
            setToggle(false);
        }
    };


const scrollToContactUs = () => {
    const contactSection = document.getElementById('contact-us');
    if (contactSection) {
        window.scrollTo({
            top: contactSection.offsetTop,
            behavior: 'smooth' // Ajoute une animation de défilement fluide
        });
        setToggle(false); // Fermer le menu après avoir cliqué sur le lien
    }
};

const togglePlatformList = () => {
    setShowPlatformList(prevState => !prevState);
};




    return ( 
        <header className="header">

            <div className="header-left">
                <div className="header-logo">
                    <img src="/logosg.png" alt="Logo SGELR" style={{ width: '150px' }} />
                </div>
                <div onClick={() => setToggle(prev=> !prev)} className="header-menu">
                    <i className="bi bi-list"></i>
                </div>
            </div>

            


            <nav style={{ clipPath:toggle && "polygon(0 0, 100% 0, 100% 100%, 0 100%)"}} className="navbar">
                <ul className="nav-links">
                    {user ?
                        <>
                        {user.role !== 'stagiaire' && (
                                <Link to="/options" onClick={() => setToggle(false)} className="nav-link">
                                    <i className="bi bi-grid"></i>Options
                                </Link>
                            )}
                           
                        <Link to="" onClick={scrollToContactUs} className="nav-link">
                            <i className="bi bi-telephone"></i>Nous contacter
                        </Link>
                        </> : (
                            <>
                            <Link to="/" onClick={() => setToggle(false)} className="nav-link">
                                <i className="bi bi-house"></i>Home
                            </Link>
                            <Link to="#" onClick={scrollToAboutUs} className="nav-link">
                                <i className="bi bi-building"></i>A propos de nous
                            </Link>
                            <Link to="#" onClick={togglePlatformList}className="nav-link">
                                <i className="bi bi-diagram-3"></i>Nos plateformes
                            </Link>
                            <Link to="" onClick={scrollToContactUs} className="nav-link">
                                <i className="bi bi-telephone"></i>Nous contacter
                            </Link>
                            </>
                        )
                    }
                    
                </ul>
            </nav>

            
            <div className="header-right">
            {user ?
            <>
                    <Link to={`/Profile/${user?._id}`} className="header-right-link">
                        <img src={user?.profilePhoto.url}
                        alt="user photo"
                        className="header-right-user-photo" />
                        <span className="header-right-username">
                            {user?.username}
                        </span>
                    </Link>
                    {user.role==='admin' ?
                    <div className="notification-icon" onClick={toggleEquipmentList}>
                        <BiBell className="bell-icon" />
                        {hasNotification && <div className='notification-dot' ></div>}
                    </div>:
                    <div></div>
                    }
                    <Link onClick={() => dispatch(logout())} className="header-right-link">
                        <i className="bi bi-box-arrow-right"></i>
                        
                    </Link>
            </> : (
                <>   
                </>
            )
            }
            </div>
            {/* Affichage conditionnel de la liste des équipements */}
            {showEquipmentList && (
                <div className="header-equipment-list">
                     <h3 className="equipment-list-item">Liste des équipements hors stock de sécurité:</h3>
                    <ul>
                        {notificationList.map((equipment) => (
                            <li className="header-equipment-info">
                                <span className="header-equipment-name">{equipment.EQname}</span>
                                <span> Stock: {equipment.EQstock}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {showPlatformList && (
                <div className="header-platform-list">
                    
                    <ul>
                        <li className="platform-item">CAO</li>
                        <li className="platform-item">FabLab</li>
                        <li className="platform-item">NanoMat</li>
                        <li className="platform-item">Nano Fab</li>
                    </ul>
                </div>
            )}


        </header>

     );
}
 
export default Header;
