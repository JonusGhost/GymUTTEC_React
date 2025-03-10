import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importar React Router
import Principal from "./Principal";
import AlumnoTalleres from "./AlumnoTalleres";
import InformacionAlumno from "./InformacionAlumno"
import Login from "./Login"; // Importar el componente Login (asegúrate de tenerlo)

function App() {
  return (
    <Router>
      <Routes> {/* Definir las rutas dentro de Routes */}
        <Route path="/" element={<Principal />} /> {/* Ruta principal */}
        <Route path="/AlumnoTalleres" element={<AlumnoTalleres />} /> 
        <Route path="/InformacionAlumno" element={<InformacionAlumno />} />
        <Route path="/login" element={<Login />} /> {/* Ruta para Login */}
      </Routes>
    </Router>
  );
}

export default App;