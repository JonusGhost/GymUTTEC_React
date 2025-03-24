import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 

import Principal from "./pages/Principal";
import AlumnoTalleres from "./pages/AlumnoTalleres";
import InformacionAlumno from "./pages/InformacionAlumno"
import InformacionTaller from "./pages/InformacionTaller";
import DocenteTaller from "./pages/DocenteTaller";
import Login from "./pages/Login"; 

// Rutas Docente

import TalleresGestion from "./pages/TalleresGestion";
import InformacionAdmin from "./pages/InformacionAdmin";
import GimnasiosGestion from "./pages/GimnasiosGestion";
import AlumnosGestion from "./pages/AlumnosGestion";
import AdministradoresGestion from "./pages/AdministradoresGestion";
import DocentesGestion from "./pages/DocentesGestion";

// Rutas Docentes
import InformacionDocente from "./pages/InformacionDocente";
import ListaDocente from "./pages/PaseLista"

// Rutas ---
import InformacionGimnasio from "./pages/InformacionGimnasio";

function App() {
  return (
    <Router>
      <Routes> {/* Definir las rutas dentro de Routes */}
        <Route path="/" element={<Principal />} /> {/* Ruta principal */}
        <Route path="/AlumnoTalleres" element={<AlumnoTalleres />} /> 
        <Route path="/InformacionAlumno" element={<InformacionAlumno />} />

        <Route path="/docenteTaller" element={<DocenteTaller/>}/>
        <Route path="/login" element={<Login />} /> {/* Ruta para Login */}

        {/* Ruta Administradores */}
        <Route path="/InformacionAdmin" element={<InformacionAdmin />} /> 
        <Route path="/TalleresGestion" element={<TalleresGestion />} /> 
        <Route path="/GimnasiosGestion" element={<GimnasiosGestion />} /> 
        <Route path="/AlumnosGestion" element={<AlumnosGestion />} /> 
        <Route path="/DocentesGestion" element={<DocentesGestion />} />
        <Route path="/AdministradoresGestion" element={<AdministradoresGestion />} />
        
        {/* Ruta Docentes */}
        <Route path="/InformacionDocente" element={<InformacionDocente/>}></Route>
        <Route path="/ListaDocente" element={<ListaDocente/>}></Route>
        
        {/* Ruta --- */}
        <Route path="/InformacionTaller/:id" element={<InformacionTaller/>}/>
        <Route path="/InformacionGimnasio/:id" element={<InformacionGimnasio/>}></Route>

      </Routes>
    </Router>
  );
}

export default App;