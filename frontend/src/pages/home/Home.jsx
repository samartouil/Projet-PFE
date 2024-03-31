import "./home.css";
import Options from "../../components/Options";

const Home = () => {
    return ( 
        <section className="home">
            <div className="home-hero-header">
                <div className="home-hero-header-layout">
                    <h1 className="home-title">Welcome To SGELR</h1>
                </div>
            </div>
            <Options/>
        </section>

        

     );
}
 
export default Home;