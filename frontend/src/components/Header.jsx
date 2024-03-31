import { Link } from "react-router-dom";
import { useState } from "react";
import "./header.css"

const Header = () => {



const [toggle, setToggle] =useState(false);


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
                    <Link to="/" onClick={() => setToggle(false)} className="nav-link">
                        <i className="bi bi-house"></i>Home
                    </Link>
                    <Link to="/Nous" onClick={() => setToggle(false)} className="nav-link">
                        <i className="bi bi-building"></i>A propos de nous
                    </Link>
                    <Link to="" onClick={() => setToggle(false)} className="nav-link">
                        <i className="bi bi-diagram-3"></i>Nos plateformes
                    </Link>
                    <Link to="" onClick={() => setToggle(false)} className="nav-link">
                        <i className="bi bi-telephone"></i>Nous contacter
                    </Link>
                </ul>
            </nav>

            
            <div className="header-right">
                <Link to="/Profile/:id" className="header-right-link">
                    <i class="bi bi-person-circle"></i>
                    <span>Admin</span>
                </Link>
                <button className="header-right-link">
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Déconnexion</span>
                </button>
            </div>
        </header>

     );
}
 
export default Header;
