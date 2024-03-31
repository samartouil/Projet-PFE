import{Link} from "react-router-dom"


const DashboardMain = () => {
    return ( 
        <div className="dashboard-main">
            <div className="mainheader">
                <div className="main-card">
                    <h5 className="card-title">Utilisateurs</h5>
                    <div className="card-count">120</div>
                    <div className="card-link-wrapper">
                        <Link 
                        to="/suivi/users-table"
                        className="card-link"
                        >
                         Voir tout les utilisateurs
                        </Link>
                        <div className="card-icon">
                            <i className="bi bi-person"></i>
                        </div>
                    </div>
                </div>
                <div className="main-card">
                    <h5 className="card-title">Equipements</h5>
                    <div className="card-count">500</div>
                    <div className="card-link-wrapper">
                        <Link 
                        to="/suivi/rapport-équipement"
                        className="card-link"
                        >
                         Voir les statistiques
                        </Link>
                        <div className="card-icon">
                            <i className="bi bi-graph-up-arrow"></i>
                        </div>
                    </div>
                </div>
                <div className="main-card">
                    <h5 className="card-title">Projets</h5>
                    <div className="card-count">20</div>
                    <div className="card-link-wrapper">
                        <Link 
                        to="/suivi/rapport-projets"
                        className="card-link"
                        >
                         Voir les statistiques
                        </Link>
                        <div className="card-icon">
                            <i className="bi bi-graph-up-arrow"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default DashboardMain;