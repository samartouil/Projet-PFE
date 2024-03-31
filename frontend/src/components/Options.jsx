import "./options.css"
import { Link } from "react-router-dom";
import image1 from '../images/1.png';
import image2 from '../images/2.png';
import image3 from '../images/3.png';
import image4 from '../images/4.png';

const Options = () => {
    return ( 
        <div className="options">
            <Link className="option">
                <img 
                src={image1}
                alt=""
                className="optionImg"
                />
                <div className="optionTitle">
                  <h1>Gérer Equipement</h1>
                </div>
            </Link>
            

            <Link className="option">
              <img 
                src={image2}
                alt=""
                className="optionImg"
                />
                <div className="optionTitle">
                   <h1>Gérer Projets</h1>
                </div>
            </Link>


            <Link to="/forms" className="option">
                <img 
                src={image4}
                alt=""
                className="optionImg"
                />
                <div className="optionTitle">
                   <h1>Créer Compte</h1>
                </div> 
            </Link>
            

            
            <Link to="/suivi" className="option">
                <img 
                src={image3}
                alt=""
                className="optionImg"
                />
                <div className="optionTitle">
                   <h1>Rapport et Suivi</h1>
                </div> 
            </Link>



        </div>
     );
}
 
export default Options;