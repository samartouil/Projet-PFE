import { FaTh, FaUserPlus, FaTools } from "react-icons/fa"; // Icônes pour le menu
import { FaPlusCircle } from "react-icons/fa"; // Icône pour le projet

const projectMenu = [
  {
    title: "Liste Projets",
    icon: <FaTh />,
    path: "/projets", 
  },
  {
    title: "Ajouter Projet",
    icon: <FaPlusCircle />,
    path: "/ajoutProjet", // Chemin vers le formulaire d'ajout de projet
  },
  {
    title: "Affecter Utilisateur à un Projet",
    icon: <FaUserPlus />, 
    path: "affecterUtilisateurProjet", // Chemin pour affecter un utilisateur à un projet
    
  },
  {
    title: "Affecter Équipement à un Projet",
    icon: <FaTools />,
    path: "/affecterEquipementProjet", // Chemin pour affecter un équipement à un projet
  },
];

export default projectMenu;
