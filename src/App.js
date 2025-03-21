import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importar React Router

import Principal from "./pages/Principal";
import AlumnoTalleres from "./pages/AlumnoTalleres";
import InformacionAlumno from "./pages/InformacionAlumno"
import InformacionTaller from "./pages/InformacionTaller"; // Import InformacionTaller
import DocenteTaller from "./pages/DocenteTaller";
import Login from "./pages/Login"; // Importar el componente Login

// Rutas Docente
import TalleresGestion from "./pages/TalleresGestion";
import InformacionAdmin from "./pages/InformacionAdmin";

function App() {
  return (
    <Router>
      <Routes> {/* Definir las rutas dentro de Routes */}
        <Route path="/" element={<Principal />} /> {/* Ruta principal */}
        <Route path="/AlumnoTalleres" element={<AlumnoTalleres />} /> 
        <Route path="/InformacionAlumno" element={<InformacionAlumno />} />

        <Route path="/InformacionTaller/:id" element={<InformacionTaller/>}/>
        <Route path="/docenteTaller" element={<DocenteTaller/>}/>
        <Route path="/login" element={<Login />} /> {/* Ruta para Login */}

        {/* Ruta Administradores */}
        <Route path="/TalleresGestion" element={<TalleresGestion />} /> 
        <Route path="/InformacionAdmin" element={<InformacionAdmin />} /> 
        { /*<Route path="/GimnasiosGestion" element={<GimnasiosGestion />} /> 
        <Route path="/AdministradoresGestion" element={<AdministradoresGestion />} /> 
        <Route path="/AlumnosGestion" element={<AlumnosGestion />} /> 
        <Route path="/DocenteGestion" element={<DocenteGestion />} />
        */ } 
      </Routes>
    </Router>
  );
}

export default App;