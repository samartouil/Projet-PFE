import { FaTh, FaRegChartBar, FaCommentAlt } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";



const menu = [

  
  {
    title: "Liste équipements",
    icon: <FaTh />,
    path: "/equipements",
  },
  {
    title: "Ajouter Equipement",
    icon: <BiImageAdd />,
    path: "/ajoutEquipement",
    
  },

  
  {
    title: "Gérer budgets",
    icon: <BiImageAdd />,
    path: "/budgets",
    
  },
  {
    title: "Gérer emplacements",
    icon: <BiImageAdd />,
    path: "/emplacements",
    
  },
  {
    title: "Rapporter Probléme",
    icon: <FaCommentAlt />,
    path: "#",
  },
];

export default menu;