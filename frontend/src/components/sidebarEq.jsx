import React, { useState } from "react";
import "./SidebarEq.css";
import { HiMenuAlt3 } from "react-icons/hi";
import menu from "../data/sidebar";
import SidebarItem from "./sidebarEqItem";
import { NavLink, useNavigate } from "react-router-dom";



const Sidebar = ({ children, menuType, onAffecterUtilisateurClick , onAffecterEquipementClick, role }) => {
  console.log(role);
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const reload = () => {
    navigate("/equipements");
  };
  const menuToUse = menuType || menu;
  return (
    <div className="layout">
      <div className="sidebar" style={{ width: isOpen ? "230px" : "60px" }}>
        <div className="top_section">
          <div className="logo" style={{ display: isOpen ? "block" : "none" }}>
            <i className="bi bi-wrench-adjustable-circle"
              size={35}
              style={{ cursor: "pointer" }}
              //onClick={reload}
            />
          </div>

          <div
            className="bars"
            style={{ marginLeft: isOpen ? "100px" : "0px" }}
          >
            <HiMenuAlt3 onClick={toggle} />
          </div>
        </div>
        {menuToUse.map((item, index) => {
         if ((item.title === "Gérer budgets" || item.title === "Gérer emplacements") && role !== 'admin') {
         
          return null;
        }
        return (
          <div key={index} className="s-child">
            {item.title === "Affecter Utilisateur à un Projet" ? (
              <div className="sidebar-item">
                <div className="sidebar-title">
                  <span onClick={onAffecterUtilisateurClick}>
                    <div className="icon">{item.icon}</div>
                    {item.title}
                  </span>
                </div>
              </div>
            ) : item.title === "Affecter Équipement à un Projet" ? (
              <div className="sidebar-item">
                <div className="sidebar-title">
                  <span onClick={onAffecterEquipementClick}>
                    <div className="icon">{item.icon}</div>
                    {isOpen ? item.title : null}
                  </span>
                </div>
              </div>
            ) : (
              <NavLink to={item.path}>
                <SidebarItem item={item} isOpen={true} />
              </NavLink>
            )}
          </div>
        );
      })}
    </div>

      <main
        style={{
          paddingLeft: isOpen ? "230px" : "60px",
          transition: "all .5s",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Sidebar;