import { BrowserRouter, Routes,Route } from "react-router-dom"
import React from 'react';
import Main from './components/Main';
import Header from './components/Header';
import Home from "./pages/home/Home";
import Register from "./pages/forms/Register";
import Nous from "./pages/Nous/Nous";
import Profile from "./pages/Profiles/Profile";
import Dashboard from "./pages/dashboard/dashboard";



function App() {
  return (
    <BrowserRouter >
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/forms" element={<Register/>}/>
        <Route path="/Nous" element={<Nous/>}/>
        <Route path="/Profile/:id" element={<Profile/>}/>
        <Route path="/suivi" element={<Dashboard/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
