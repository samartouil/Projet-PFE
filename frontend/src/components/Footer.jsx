import React from "react";
import "./footer.css";
const Footer = () => {
  
    return (  


      
        <footer id="contact-us" className="footer">
              <div className="footer-left">
                <div className="footer-logo">
                  <a href="https://crmn.rnrt.tn/public/">
                  <img src="/logoCRMN.png" alt="Logo de la société" />
                  </a>
                </div>
              </div>
              
              <nav className="footer-navbar">
                <div className="contact-info">
                  <h2>Coordonnées :</h2>
                  <p><strong> <i className="bi bi-geo-alt"></i> Adresse :</strong> Technopôle de Sousse "Novation City", Sahloul (BP 334 Sahloul Sousse 4054)</p>
                  <p><strong> <i className="bi bi-envelope-at-fill"></i> Email :</strong>bo.gec@crmn.rnrt.tn</p>
                  <p><strong><i className="bi bi-telephone-fill"></i> Téléphone :</strong> +216 73823003</p>
                </div>
              </nav>

              <div className="footer-right">
                  <div className="map">
                    {
                    <iframe
                      title="Location"
                      src="https://maps.app.goo.gl/32FKFwc4aARR8DGm6"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>}
                  </div>
              </div>
                    
      
      
</footer>

    );
}
 
export default Footer; 