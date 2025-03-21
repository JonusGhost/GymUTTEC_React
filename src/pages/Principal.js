import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Para la redirección
import "bootstrap/dist/css/bootstrap.min.css";
import { servicioTaller } from "../services/userService";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function HomePage() {
  const [talleres, setTalleres] = useState([]);

  useEffect(() => {
    // Obtener talleres usando el servicio de Axios
    const cargarTalleres = async () => {
      try {
        const response = await servicioTaller.obtenerTalleres();
        setTalleres(response.data);
      } catch (error) {
        console.error("Error cargando talleres:", error);
      }
    };
    cargarTalleres();
  }, []);

  return (
    <div className="container-fluid p-0">
      {/* Título del Gimnasio */}
      <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#0e9443" }}>
          <Container>
              <Navbar.Brand className="text-white">GYMUTTEC</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" className="text-white"/>
              <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="me-auto">
                    
                  </Nav>
                  <Nav>
                      <Nav.Link className="btn btn-light btn-sm text-succes" href="/login">Iniciar sesión</Nav.Link>
                  </Nav>
              </Navbar.Collapse>
          </Container>
      </Navbar>
      
      {/* Imagen Principal */}
      <div>
        <img 
          src="https://media.gettyimages.com/id/1296308226/es/foto/sport-and-fitness-equipment.jpg?s=612x612&w=0&k=20&c=8gcDFFbHcXcSIPxJ9Nb2w-48AUgxIO4gYKQmQWixNcU=" 
          alt="Gimnasio" 
          className="img-fluid w-100" 
          style={{ maxHeight: "400px", objectFit: "cover" }} 
        />
      </div>

      {/* Sección de Talleres */}
      <section className="container py-5">
        <h2 className="text-center mb-4 text-success">Talleres</h2>
        <p className="text-center">Explora los diferentes talleres que ofrecemos para mejorar tu condición física y bienestar.</p>

        {/* Lista de Talleres */}
        <div className="row g-4">
          {talleres.length > 0 ? (
            talleres.map((taller, index) => (
              <div key={index} className="col-md-6">
                <div className="d-flex bg-light p-3 rounded shadow-sm">
                  <img 
                    src={taller.imagen} 
                    alt={taller.nombre} 
                    className="rounded me-3" 
                    style={{ width: "100px", height: "100px", objectFit: "cover" }} 
                  />
                  <div>
                    <h4 className="text-success">{taller.nombre}</h4>
                    <p>{taller.descripcion}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Cargando talleres...</p>
          )}
        </div>
      </section>
    </div>
  );
}
