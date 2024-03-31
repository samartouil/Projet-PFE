import{Link} from "react-router-dom"


const Sidebar = () => {
    return ( 
        <div className="dashboard-sidebar">
            <Link to="/suivi" className="dashboard-title">
                <i className="bi bi-columns"></i>
                Rapport et Suivi
            </Link>
                <ul className="dashboard-list">
                    <Link className="dashboard-sidebar-link" to="/suivi/users-table">
                       <i className="bi bi-person"></i> 
                       Utilisateurs
                    </Link>
                    <Link className="dashboard-sidebar-link" to="/suivi/users-table">
                       <i className="bi bi-cpu"></i> 
                       Equipements
                    </Link>
                    <Link className="dashboard-sidebar-link" to="/suivi/users-table">
                       <i className="bi bi-ui-checks-grid"></i> 
                       Projets
                    </Link>
                    
                </ul>
        </div>
     );
}
 
export default Sidebar;