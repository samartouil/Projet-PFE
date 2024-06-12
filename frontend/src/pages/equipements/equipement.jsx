
import EquipmentList from "../../components/EquipementList";
import Sidebar from "../../components/sidebarEq";
import "./equipement.css";
import { useSelector } from "react-redux";


const Equipements = () => {

    const { user } = useSelector(state => state.auth);
    return ( 
        <section className="equipementPage">
            <Sidebar role={user.role} />
            <EquipmentList />
            
        </section>
     );
}
 
export default Equipements;