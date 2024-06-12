import { BrowserRouter, Routes,Route, Navigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import Header from './components/Header';
import HomePrincipal from "./pages/home/HomePrincipal";
import Home from "./pages/OptionsHome/Home";
import Register from "./pages/forms/Register";
import Profile from "./pages/Profiles/Profile";
import Equipements from "./pages/equipements/equipement";
import EquipementForm from "./pages/forms/AjoutEq";
import Footer from "./components/Footer";
import {useSelector} from "react-redux";
import UserList from "./components/UsersList";
import EquipmentDetail from "./pages/equipements/EqDetails";
import FormAjouterProjet from "./pages/forms/AjoutProjet";
import Project from "./pages/projets/listeProjets";
import AffectUserModal from "./pages/projets/affectUsers";
import projectMenu from "./data/projetMenu";
import Sidebar from "./components/sidebarEq";
import ManageBudgets from "./pages/budgets/ManageBudgets";
import ManageEmplacements from "./pages/emplacements/ManageEmplacements";
import DetailsProject from "./pages/projets/detailsProjet";
import DashboardBI from "./pages/dashboard/appDashboard";
import NoAccess from './components/noAccess';
import NotFound from './components/notFound';

function App() {
  

  const { user } = useSelector(state => state.auth);
  const isAdmin = user && user.role === 'admin';
  const isChercheur = user && user.role === 'chercheur';
  const isResponsableLaboratoire = user && user.role === 'responsable laboratoire';


  const getRedirectPath = () => {
    if (!user) return "/";
    if (user.role === 'stagiaire') return "/equipements";
    if (['admin', 'responsable laboratoire', 'chercheur'].includes(user.role)) return "/options";
  
  };


  return (
    <BrowserRouter >
      <Header/>
      
      <Footer/>
      <Routes>
        <Route path="/" element={!user ? <HomePrincipal /> : <Navigate to={getRedirectPath()} />} />
        <Route path="/options" element={user ? <Home/> : <Navigate to ="/"/>}/>
        <Route path="/forms/register" element={user ? <Register/> : <Navigate to ="/"/>}/>
        <Route path="/Profile/:id" element={user ?<Profile/>: <Navigate to ="/"/>}/>
        <Route path="/equipements" element={user ?<Equipements/> : <Navigate to ="/"/>}/>
        <Route path="/usersList" element={user ? <UserList/> : <Navigate to ="/"/>}/>
        <Route path= "/ajoutEquipement" element={user ? <EquipementForm/>: <Navigate to ="/"/>}/>
        <Route path="/equipements/:id" element={user ?<EquipmentDetail/>: <Navigate to ="/"/>}/>
        <Route path="/ajoutProjet" element={
          (isAdmin || isChercheur || isResponsableLaboratoire) ? <FormAjouterProjet /> : <Navigate to="/no-access" />} />
        <Route path="/projets" element={user ?<Project/> : <Navigate to ="/"/>}/>
        <Route path="/budgets" element={user ?<ManageBudgets/> : <Navigate to ="/"/>}/>
        <Route path="/emplacements" element={user ?<ManageEmplacements/> : <Navigate to ="/"/>}/>
        <Route path="/detailsProject/:id" element={
          (isAdmin || isChercheur || isResponsableLaboratoire) ? <DetailsProject /> : <Navigate to="/no-access" />} />
        <Route path="/dashboard" element={isAdmin  ? <DashboardBI /> : <Navigate to="/no-access" />} />
        <Route path="/no-access" element={<NoAccess /> } />
        <Route path="*" element={<NotFound />} />

      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
