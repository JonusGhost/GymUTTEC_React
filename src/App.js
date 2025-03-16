import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importar React Router

import Principal from "./pages/Principal";
import AlumnoTalleres from "./pages/AlumnoTalleres";
import InformacionAlumno from "./pages/InformacionAlumno"
import InformacionTaller from "./pages/InformacionTaller"; // Import InformacionTaller
import Login from "./pages/Login"; // Importar el componente Login


function App() {
  return (
    <Router>
      <Routes> {/* Definir las rutas dentro de Routes */}
        <Route path="/" element={<Principal />} /> {/* Ruta principal */}
        <Route path="/AlumnoTalleres" element={<AlumnoTalleres />} /> 
        <Route path="/InformacionAlumno" element={<InformacionAlumno />} />
        <Route path="/InformacionTaller/:id" element={<InformacionTaller/>}/>
        <Route path="/login" element={<Login />} /> {/* Ruta para Login */}
      </Routes>
    </Router>
  );
}

export default App;