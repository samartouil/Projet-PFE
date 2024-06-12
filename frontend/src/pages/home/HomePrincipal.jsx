import React, { useState, useEffect, useRef } from "react";
import "./homePrincipal.css";
import Login from "../forms/Login";

// Importez vos images pour le diaporama
import image1 from '../home/image1.jpg';
import image2 from '../home/image2.jpg';
import image3 from '../home/image3.jpg';
import g1 from '../home/g1.png';
import g2 from '../home/g2.png';
import g3 from '../home/g3.png';
import OIP from '../home/OIP.jpeg';
const HomePrincipal = () => {

    // Définissez un tableau d'images pour le diaporama
    const images = [image1, image2, image3];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Changez l'image toutes les 5 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);
   
    const FeatureBox = ({ image, title, description }) => {
        return (
          <div className="feature-box">
            <img src={image} alt="Feature" className="feature-image"  />
            <h2 className="feature-title">{title}</h2>
            <p className="feature-description">{description}</p>
          </div>
        );
      };
   

    const FeaturesSection = () => {
        return (
          <div className="features-section">
            <h2 className="section-title">Ce que nous offrons :</h2>
           
            <div className="feature-boxes">
              
                    <FeatureBox
                image={g1}
                
                
                />
                <FeatureBox
                image={g2}
                
                
                />
                <FeatureBox
                image={g3}
            
                
                />
            </div>
        </div>
        );
};
const aboutUsRef = useRef(null);

const AboutUsSection = () => {
  return (
      <div id="about-us" className="about-us-section" ref={aboutUsRef}>
    
          <h2>À propos de nous :</h2>
          <p>
              Le Centre de Recherche en Microélectronique et Nanotechnologie est créé par le Décret n° 2012-1217 du 27 juillet 2012. C’est un établissement public à caractère scientifique et technologique doté de la personnalité morale et de l’autonomie financière et placé sous la tutelle du Ministère de l’Enseignement Supérieur et de la Recherche Scientifique.
          </p>
          <div> 
          <img src={OIP} alt="Feature" className="about-us-image" />
       </div>
          {/* Ajoutez le contenu supplémentaire de la section "À propos de nous" ici */}
      </div>
       
  );
};  

    return ( 
        <section className="home">
            {/* Affichez l'image actuelle du diaporama */}
            <img className="background-image" src={images[currentImageIndex]} alt="Background" />
            <div className="background-overlay"></div>
            <div className="home-hero-header">
                <div className="home-hero-header-layout">
                    <h1 className="home-title">-Systeme De Gestion Des Equipements Et Consommables Laboratoire de Recherche-</h1>
                    <p className="description"> </p>
                </div>
            </div>
            <div className="home-content">
                <Login/>
                <AboutUsSection />

            </div>
            <FeaturesSection /> 
        </section>
        
    );
};
 
export default HomePrincipal;