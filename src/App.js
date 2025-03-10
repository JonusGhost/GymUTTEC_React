import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importar React Router
import Principal from "./Principal";
import Login from "./Login"; // Importar el componente Login (asegúrate de tenerlo)

function App() {
  return (
    <Router>
      <Routes> {/* Definir las rutas dentro de Routes */}
        <Route path="/" element={<Principal />} /> {/* Ruta principal */}
        <Route path="/login" element={<Login />} /> {/* Ruta para Login */}
      </Routes>
    </Router>
  );
}

export default App;