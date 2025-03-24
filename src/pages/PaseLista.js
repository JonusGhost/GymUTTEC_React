import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { servicioAdmin, servicioAsistencia } from "../services/userService";
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';

export default function PaseLista() {
  const navigate = useNavigate();
  
  const [asistencia, setAsistencia] = useState({});
  const [error, setError] = useState("");
  const [tallerId, setTallerId] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [tallerNombre, setTallerNombre] = useState("");
  const [activeTab, setActiveTab] = useState("listado");
  const [GimnasiosExplorar, setGimnasiosExplorar] = useState([]);

  useEffect(() => {
    const fetchAttendanceList = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.idUsuario) {
            setError("Usuario no autenticado.");
            return;
        }

        const response = await servicioAdmin.obtenerTodosEstudiantes();
        setAlumnos(response.data.alumnos || []);
        setTallerNombre(response.data.nombre_taller || "Taller");
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar la lista de asistencia");
      }
    };

    fetchAttendanceList();
  }, [tallerId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleAsistencia = (matricula, estado) => {
    setAsistencia({ ...asistencia, [matricula]: estado });
  };

  const handleSubmitAttendance = async () => {
    try {
      await servicioAsistencia.enviarAsistencia({
        taller_id: tallerId,
        asistencias: Object.entries(asistencia).map(([matricula, estado]) => ({
          matricula,
          estado
        }))
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Error al subir la asistencia");
    }
  };

  // Función vacía para evitar errores
  const limpiarFormulario = () => {
    console.log("Limpieza de formulario");
  };

  const handleEdit = (taller) => {
    console.log("Editar taller:", taller);
  };

  const handleDele = (taller) => {
    console.log("Eliminar taller:", taller);
  };

  return (
    <>
      <div className="container-fluid p-0">
        <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#0e9443" }}>
          <Container>
            <Navbar.Brand className="text-white">GYMUTTEC</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" className="text-white" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/" className="text-white">Talleres</Nav.Link>
                <Nav.Link href="/" className="text-white">Gimnasios</Nav.Link>
                <Nav.Link href="/ListaDocente" className="text-white">Pase de Lista</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={handleLogout} className="btn btn-danger btn-sm text-white">Cerrar sesión</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <section className="container py-5">
          <h2 className="text-center mb-4 text-success">Pase de Lista</h2>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            onClick={limpiarFormulario}
            className="mb-3"
            justify
          >
            <Tab eventKey="listado" title="Lista de Alumnos inscritos">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Matrícula</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {GimnasiosExplorar.length > 0 ? (
                    GimnasiosExplorar.map((taller, index) => (
                      <tr key={taller.id}>
                        <td>{index + 1}</td>
                        <td>{taller.nombre_gim}</td>
                        <td>{taller.descripcion}</td>
                        <td>
                          <a href={taller.enlace_grupo} target="_blank" rel="noopener noreferrer">
                            Ver grupo
                          </a>
                        </td>
                        <td>
                          <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEdit(taller)}>Editar</button>
                          <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDele(taller)}>Eliminar</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No hay Gimnasios disponibles</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </section>
      </div>
    </>
  );
}