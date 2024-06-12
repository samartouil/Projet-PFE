import "./home.css";
import Options from "../../components/Options";

const Home = () => {
    return ( 
        <section className="homeOp">
            <div className="homeOp-hero-header">
                <div className="homeOp-hero-header-layout">
                    <h1 className="homeOp-title">Welcome To SGELR</h1>
                </div>
            </div>
            <Options/>
        </section>

        

     );
}
 
export default Home;