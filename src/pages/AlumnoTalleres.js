import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { servicioEstudiante, servicioGimnasio, servicioTaller } from "../services/userService";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function AlumnoTalleres() {
  const navigate = useNavigate();
  const [talleresInscritos, setTalleresInscritos] = useState([]);
  const [talleresExplorar, setTalleresExplorar] = useState([]);
  const [gimnasiosInscritos, setGimnasiosInscritos] = useState([]);
  const [gimnasiosExplorar, setGimnasiosExplorar] = useState([]);
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

        const responseInscritosTal = await servicioEstudiante.obtenerTalleresInscritos(matricula);
        const talleresInscritosData = await Promise.all(
          responseInscritosTal.data.map(async (inscripcion) => {
            const responseTaller = await servicioEstudiante.obtenerDetallesTaller(inscripcion.taller_id);
            return responseTaller.data;
          })
        );
        setTalleresInscritos(talleresInscritosData);

        // Obtener gimnasios inscritos
        const responseInscritosGim = await servicioEstudiante.obtenerGimnasioInscritos(matricula);
        const gimnasiosInscritosData = await Promise.all(
          responseInscritosGim.data.map(async (inscripcion) => {
            const responseGimnasio = await servicioEstudiante.obtenerDetallesGimnasio(inscripcion.gimnasio_id);
            return responseGimnasio.data;
          })
        );
        setGimnasiosInscritos(gimnasiosInscritosData);

        // Obtener talleres por explorar
        const responseExplorar = await servicioTaller.obtenerTalleres();
        setTalleresExplorar(responseExplorar.data);

        // Obtener gimnasios por explorar
        const responseExplorarGim = await servicioGimnasio.obtenerGimnasios();
        setGimnasiosExplorar(responseExplorarGim.data);

      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar los talleres y gimnasios");
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
        <h2 className="text-center mb-4 text-success">Talleres y Gimnasios donde estás inscrito</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex overflow-auto">
          {talleresInscritos.length > 0 ? (
            talleresInscritos.map((taller) => (
              <div key={taller.id} className="card me-3" style={{ width: "200px", border: "none", cursor: "pointer" }} onClick={() => navigate(`/InformacionTaller/${taller.id}`)}>
                <img src={`http://localhost:8000/storage/${taller.imagen}`} alt={taller.nombre_tall} className="card-img-top" style={{ height: "150px", objectFit: "cover", borderRadius: "50%" }} />
                <div className="card-body text-center">
                  <h5 className="card-title text-success">{taller.nombre_tall}</h5>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No estás inscrito en ningún taller.</p>
          )}

          {gimnasiosInscritos.length > 0 ? (
            gimnasiosInscritos.map((gimnasio) => (
              <div key={gimnasio.id} className="card me-3" style={{ width: "200px", border: "none", cursor: "pointer" }} onClick={() => navigate(`/InformacionGimnasio/${gimnasio.id}`)}>
                <img src={`http://localhost:8000/storage/${gimnasio.imagen}`} alt={gimnasio.nombre_gim} className="card-img-top" style={{ height: "150px", objectFit: "cover", borderRadius: "50%" }} />
                <div className="card-body text-center">
                  <h5 className="card-title text-success">{gimnasio.nombre_gim}</h5>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No estás inscrito en ningún gimnasio.</p>
          )}
        </div>
      </section>

      <section className="container py-5 bg-light">
        <h2 className="text-center mb-4 text-success">Talleres por explorar</h2>
        <div className="row g-4">
          {talleresExplorar.length > 0 ? (
            talleresExplorar.map((taller) => (
              <div key={taller.id} className="col-md-6">
                <div className="d-flex bg-white p-3 rounded shadow-sm" style={{ cursor: "pointer" }} onClick={() => navigate(`/InformacionTaller/${taller.id}`)}>
                  <img src={`http://localhost:8000/storage/${taller.imagen}`} alt={taller.nombre_tall} className="rounded me-3" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
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

      <section className="container py-5 bg-light">
        <h2 className="text-center mb-4 text-success">Gimnasios por explorar</h2>
        <div className="row g-4">
          {gimnasiosExplorar.length > 0 ? (
            gimnasiosExplorar.map((gimnasio) => (
              <div key={gimnasio.id} className="col-md-6">
                <div className="d-flex bg-white p-3 rounded shadow-sm" style={{ cursor: "pointer" }} onClick={() => navigate(`/InformacionGimnasio/${gimnasio.id}`)}>
                  <img src={`http://localhost:8000/storage/${gimnasio.imagen}`} alt={gimnasio.nombre_gim} className="rounded me-3" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                  <div>
                    <h4 className="text-success">{gimnasio.nombre_gim}</h4>
                    <p>{gimnasio.descripcion}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No hay gimnasios disponibles para explorar.</p>
          )}
        </div>
      </section>
    </div>
  );
}