import "./options.css"
import { Link } from "react-router-dom";
import image1 from '../images/1.png';
import image2 from '../images/2.png';
import image3 from '../images/3.png';
import image4 from '../images/4.png';
import { useSelector} from "react-redux"

const Options = () => {
   
    const { user } = useSelector(state => state.auth);
    
    return ( 
        <div className="options">
            
            {user && (user.isAdmin ) && (
                <Link to="/dashboard" className="option">
                    <img 
                        src={image3}
                        alt=""
                        className="optionImg"
                    />
                    <div className="optionTitle">
                        <h1>Dashboard</h1>
                    </div> 
                </Link>
            )}

            {user && (user.isAdmin || user.role === 'responsable laboratoire' || user.role==='chercheur') && (
                <Link to="/forms/register" className="option">
                    <img 
                    src={image4}
                    alt=""
                    className="optionImg"
                    />
                    <div className="optionTitle">
                    <h1>Créer Compte</h1>
                    </div> 
                </Link>
                
            )}
        
            
            
        
            <Link to="/equipements" className="option">
                <img 
                src={image1}
                alt=""
                className="optionImg"
                />
                <div className="optionTitle">
                  <h1>Gérer Equipement</h1>
                </div>
            </Link>

            {user && (user.isAdmin || user.role === 'responsable laboratoire' || user.role==='chercheur') && (
            <Link to="/Projets" className="option">
              <img 
                src={image2}
                alt=""
                className="optionImg"
                />
                <div className="optionTitle">
                   <h1>Gérer Projets</h1>
                </div>
            </Link>
             )}


            {user && (user.isAdmin || user.role === 'responsable laboratoire' || user.role==='chercheur') && (
            <Link to="/usersList" className="option">
                <img 
                src={image4}
                alt=""
                className="optionImg"
                />
                <div className="optionTitle">
                   <h1>Gérer utilisateur</h1>
                </div> 
            </Link>
            )}

            
            



        </div>
     );
}
 
export default Options;