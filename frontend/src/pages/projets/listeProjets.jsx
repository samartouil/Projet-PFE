import React, { useState, useEffect } from "react";
import "./listeProjets.css"; 
import { Link } from "react-router-dom";
import Sidebar from "../../components/sidebarEq"; 
import projectMenu from "../../data/projetMenu";
import request from "../../utils/request";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AffectUserModal from "./affectUsers";
import AffectEquipmentModal from "./affectEquipement";
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';

const Project = () => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false); // Contrôle du modal
    const [isEqModalOpen, setIsEqModalOpen] = useState(false);

    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Page actuelle
    const [projectsPerPage] = useState(5); // Nombre de projets par page

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await request.get("/api/projets/listeProjets");
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    const openUserModal = () => {
        setIsUserModalOpen(true); // Ouvre le modal
    };

    const closeUserModal = () => {
        setIsUserModalOpen(false); // Ferme le modal
    };

    const openEqModal = () => {
        setIsEqModalOpen(true); // Ouvre le modal
    };

    const closeEqModal = () => {
        setIsEqModalOpen(false); 
    };

    // Filtrer les projets par terme de recherche
    const filteredProjects = projects.filter(project =>
        project.NomProjet.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Obtenir les projets pour la page actuelle
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    // Changer de page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    // Aller à la page précédente
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    };

    // Aller à la page suivante
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            paginate(currentPage + 1);
        }
    };

    return (
        <div className="containerr">
            <ToastContainer/>
            <Sidebar menuType={projectMenu} onAffecterUtilisateurClick={openUserModal} onAffecterEquipementClick={openEqModal} />
            <div className="project-list-section ">
                <div className="project-management">
                    <h1 className="title-projet">Liste des Projets</h1>
                    <div className="barre">
                        <div className="search-bar">
                            <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            <button>Rechercher</button>
                        </div>
                    </div>
                </div>
                <div className="project-container">
                    {currentProjects.map((project) => (
                        <div className="project" key={project._id}>
                            <h3>{project.NomProjet}</h3>
                            <p>Description: {project.description}</p>
                            <p>Ajouté par: {project.créerPar.username} - {project.créerPar.role}</p>
                            <Link to={`/detailsProject/${project._id}`} className="view-more-button">
                                Voir plus
                            </Link>
                        </div>
                    ))}
                </div>
                <nav className="pagination">
                    <button onClick={goToPreviousPage} className="pagination-button" disabled={currentPage === 1}>
                        <GrFormPrevious />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={i + 1 === currentPage ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={goToNextPage} className="pagination-button" disabled={currentPage === totalPages}>
                        <GrFormNext />
                    </button>
                </nav>
                <AffectUserModal isOpen={isUserModalOpen} onRequestClose={closeUserModal} />
                <AffectEquipmentModal isOpen={isEqModalOpen} onRequestClose={closeEqModal} />
            </div>
        </div>
    );
};

export default Project;