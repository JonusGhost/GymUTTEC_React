import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser } from "react-icons/fa";
import { servicioEstudiante } from "../services/userService";
import { servicioTaller } from "../services/api";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function AlumnoTalleres() {
  const navigate = useNavigate();
  const [talleresInscritos, setTalleresInscritos] = useState([]);
  const [talleresExplorar, setTalleresExplorar] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTalleres = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.idUsuario) {
          setError("Usuario no autenticado.");
          return;
        }

        const matricula = user.idUsuario;
        
        // Obtener los talleres inscritos
        const responseInscritos = await servicioEstudiante.obtenerTalleresInscritos(matricula);
        const talleresInscritosData = await Promise.all(
          responseInscritos.data.map(async (inscripcion) => {
            const responseTaller = await servicioEstudiante.obtenerDetallesTaller(inscripcion.taller_id);
            return responseTaller.data;
          })
        );
        setTalleresInscritos(talleresInscritosData);

        // Obtener los talleres disponibles
        const responseExplorar = await servicioTaller.obtenerTalleres();
        setTalleresExplorar(responseExplorar.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar los talleres");
      }
    };

    fetchTalleres();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container-fluid p-0">
      
      <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#0e9443" }}>
          <Container>
              <Navbar.Brand className="text-white">GYMUTTEC</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" className="text-white"/>
              <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="me-auto">
                  <Nav.Link href="/InformacionAlumno" className="text-white">Datos</Nav.Link>
                  </Nav>
                  <Nav>
                      <Nav.Link onClick={handleLogout} className="btn btn-danger btn-sm text-white">Cerrar sesión</Nav.Link>
                  </Nav>
              </Navbar.Collapse>
          </Container>
      </Navbar>

      <section className="container py-5">
        <h2 className="text-center mb-4 text-success">Talleres donde estás inscrito</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex overflow-auto">
          {talleresInscritos.length > 0 ? (
            talleresInscritos.map((taller) => (
              <div
                key={taller.id}
                className="card me-3"
                style={{ width: "200px", border: "none", cursor: "pointer" }}
                onClick={() => navigate(`/InformacionTaller/${taller.id}`)}
              >
                <img
                  src={`http://localhost:8000/storage/${taller.imagen}`}
                  alt={taller.nombre_tall}
                  className="card-img-top"
                  style={{ height: "150px", objectFit: "cover", borderRadius: "50%" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-success">{taller.nombre_tall}</h5>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No estás inscrito en ningún taller.</p>
          )}
        </div>
      </section>

      <section className="container py-5 bg-light">
        <h2 className="text-center mb-4 text-success">Talleres por explorar</h2>
        <div className="row g-4">
          {talleresExplorar.length > 0 ? (
            talleresExplorar.map((taller) => (
              <div key={taller.id} className="col-md-6">
                <div
                  className="d-flex bg-white p-3 rounded shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/InformacionTaller/${taller.id}`)}
                >
                  <img
                    src={`http://localhost:8000/storage/${taller.imagen}`}
                    alt={taller.nombre_tall}
                    className="rounded me-3"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                  <div>
                    <h4 className="text-success">{taller.nombre_tall}</h4>
                    <p>{taller.descripcion}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No hay talleres disponibles para explorar.</p>
          )}
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center mb-4 text-success">Gimnasios donde estás inscrito</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex overflow-auto">
          {talleresInscritos.length > 0 ? (
            talleresInscritos.map((taller) => (
              <div
                key={taller.id}
                className="card me-3"
                style={{ width: "200px", border: "none", cursor: "pointer" }}
                onClick={() => navigate(`/InformacionTaller/${taller.id}`)}
              >
                <img
                  src={`http://localhost:8000/storage/${taller.imagen}`}
                  alt={taller.nombre_tall}
                  className="card-img-top"
                  style={{ height: "150px", objectFit: "cover", borderRadius: "50%" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-success">{taller.nombre_tall}</h5>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No estás inscrito en ningún taller.</p>
          )}
        </div>
      </section>

      <section className="container py-5 bg-light">
        <h2 className="text-center mb-4 text-success">Talleres por explorar</h2>
        <div className="row g-4">
          {talleresExplorar.length > 0 ? (
            talleresExplorar.map((taller) => (
              <div key={taller.id} className="col-md-6">
                <div
                  className="d-flex bg-white p-3 rounded shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/InformacionTaller/${taller.id}`)}
                >
                  <img
                    src={`http://localhost:8000/storage/${taller.imagen}`}
                    alt={taller.nombre_tall}
                    className="rounded me-3"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                  <div>
                    <h4 className="text-success">{taller.nombre_tall}</h4>
                    <p>{taller.descripcion}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No hay talleres disponibles para explorar.</p>
          )}
        </div>
      </section>
    </div>
  );
}
