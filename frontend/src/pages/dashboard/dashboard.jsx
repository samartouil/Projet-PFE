import "./Dashboard.css"
import DashboardMain from "./dashboardMain";
import Sidebar from "./sidebar";


const Dashbord = () => {
    return ( 
        <section className="dashboard">
            <Sidebar/>
            <DashboardMain />
        </section>
     );
}
 
export default Dashbord;