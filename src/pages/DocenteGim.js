import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { servicioDocente, servicioAsistencia, servicioGimnasio } from "../services/userService";
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

export default function DocenteGimnasio() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [docente, setDocente] = useState(null);
    const [activeTab, setActiveTab] = useState("informacion");
    const [gimnasio, setGimnasio] = useState(null);
    const [horarios, setHorarios] = useState([]); 
    const [alumnos, setAlumnos] = useState([]);
    const [asistencia, setAsistencia] = useState({}); 
    const [horasImpartidas, setHorasImpartidas] = useState("");
    const [error, setError] = useState("");
    const [sinAsignar, setSinAsignar] = useState(false);

    useEffect(() => {
        const cargarInformacionGimnasio = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || user.role !== "D") {
                    navigate("/");
                    return;
                }

                const matricula = user.idUsuario;
                const response = await servicioDocente.obtenerPerfilDocente(matricula);
                setDocente(response.data);

                // Verificar si tiene gimnasio asignado
                if (!response.data.docente.gimnasio || !response.data.docente.gimnasio.id) {
                    setSinAsignar(true);
                    return;
                }

                const id_gimnasio = response.data.docente.gimnasio.id;

                // Obtener información del gimnasio
                const responseGim = await servicioGimnasio.obtenerGimnasio(id_gimnasio);
                setGimnasio(responseGim.data);
                
                // Obtener horarios del gimnasio
                const responseHorarios = await servicioGimnasio.obtenerHorariosGimnasio(id_gimnasio);
                setHorarios(responseHorarios.data);

                // Obtener lista de alumnos inscritos en el gimnasio
                const responseAlumnos = await servicioAsistencia.obtenerListaAsistenciaGim(id_gimnasio);
                setAlumnos(responseAlumnos.data.alumnos || []);
            } catch (err) {
                setError(err.response?.data?.error || "Error al cargar la información");
                console.error("Error:", err);
            }
        };

        cargarInformacionGimnasio();
    }, [id, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const toggleAsistencia = (matricula, estado) => {
        setAsistencia((prevAsistencia) => ({
            ...prevAsistencia,
            [matricula]: estado,
        }));
    };

    const handleSubmitAttendance = async () => {
        try {
            const datos = {
                gimnasio_id: gimnasio.id,
                horas_asignadas: horasImpartidas,
                asistencia: Object.entries(asistencia).reduce((acc, [matricula, estado]) => {
                    acc[matricula] = estado;
                    return acc;
                }, {}),
            };
    
            await servicioAsistencia.pasarListaGim(datos);
    
            Swal.fire({
                title: "¡Asistencia registrada!",
                text: "La asistencia ha sido guardada correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                background: '#fff',
                iconColor: '#721c24',
                confirmButtonColor: '#155724',
            });
    
            setError("");
            setHorasImpartidas("");
            setActiveTab("informacion");
        } catch (err) {
            setError(err.response?.data?.error || "Error al subir la asistencia");
        }
    };                

    if (sinAsignar) {
        return (
            <>
                <div className="container-fluid p-0">
                    <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#0e9443" }}>
                        <Container>
                            <Navbar.Brand className="text-white">GYMUTTEC</Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" className="text-white" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="me-auto">
                                    <Nav.Link href="/DocenteTaller" className="text-white">Taller</Nav.Link>
                                    <Nav.Link href="/InformacionDocente" className="text-white">Datos</Nav.Link>
                                </Nav>
                                <Nav>
                                    <Nav.Link onClick={handleLogout} className="btn btn-danger btn-sm text-white">Cerrar sesión</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div>

                <section className="container py-5">
                    <div className="card shadow">
                        <div className="card-body text-center py-5">
                            <h2 className="text-danger mb-4">Gimnasio sin asignar</h2>
                            <p className="lead">Actualmente no tienes un gimnasio asignado.</p>
                            <p>Por favor, contacta al administrador para que te asigne a un gimnasio.</p>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <div className="container-fluid p-0">
                <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#0e9443" }}>
                    <Container>
                        <Navbar.Brand className="text-white">GYMUTTEC</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="text-white" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/DocenteTaller" className="text-white">Taller</Nav.Link>
                                <Nav.Link href="/InformacionDocente" className="text-white">Datos</Nav.Link>
                            </Nav>
                            <Nav>
                                <Nav.Link onClick={handleLogout} className="btn btn-danger btn-sm text-white">Cerrar sesión</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>

            <section className="container py-5">
                <h2 className="text-center mb-4 text-success">{gimnasio?.nombre_gim || "Cargando..."}</h2>
                {error && <div className="alert alert-danger">{error}</div>}

                <Tabs defaultActiveKey="informacion" id="gimnasio-tabs" className="mb-3" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                    {/* Pestaña 1: Información del Gimnasio */}
                    <Tab eventKey="informacion" title="Información del Gimnasio">
                        {gimnasio ? (
                            <div className="row">
                                <div className="col-md-4">
                                    <img
                                        src={gimnasio.imagen || "https://via.placeholder.com/300"}
                                        alt={gimnasio.nombre_gim}
                                        className="img-fluid rounded mb-3"
                                    />
                                </div>

                                <div className="col-md-8">
                                    <h3 className="text-success">{gimnasio.nombre_gim}</h3>
                                    <p><strong>Descripción:</strong> {gimnasio.descripcion}</p>
                                    <p><strong>Cupo:</strong> {gimnasio.num_alumnos} alumnos</p>
                                    <p><strong>Enlace de Grupo:</strong> 
                                        {gimnasio.enlace_grupo ? (
                                            <a href={gimnasio.enlace_grupo} target="_blank" rel="noopener noreferrer" className="ms-2">
                                                {gimnasio.enlace_grupo}
                                            </a>
                                        ) : " No disponible"}
                                    </p>
                                </div>

                                <div className="col-12 mt-4">
                                    <div className="border p-3 rounded shadow-sm">
                                        <h4>Horarios Disponibles</h4>
                                        <Table bordered className="text-center">
                                            <thead className="table-success">
                                                <tr>
                                                    <th>Hora</th>
                                                    <th>Lunes</th>
                                                    <th>Martes</th>
                                                    <th>Miércoles</th>
                                                    <th>Jueves</th>
                                                    <th>Viernes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((hora) => (
                                                    <tr key={hora}>
                                                        <td>{hora}</td>
                                                        {["lunes", "martes", "miercoles", "jueves", "viernes"].map((dia) => (
                                                            <td 
                                                                key={dia} 
                                                                style={{
                                                                    backgroundColor: horarios[dia]?.includes(hora) ? '#28a745' : 'transparent',
                                                                    color: horarios[dia]?.includes(hora) ? '#fff' : '#000'
                                                                }}
                                                            >
                                                                {horarios[dia]?.includes(hora) ? "✓" : ""}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <div className="spinner-border text-success" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        )}
                    </Tab>

                    {/* Pestaña 2: Pase de Lista */}
                    <Tab eventKey="pase-lista" title="Pase de Lista">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4 className="card-title mb-4">Registro de Asistencia</h4>

                                {/* Input de horas impartidas */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Horas impartidas:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        value={horasImpartidas}
                                        onChange={(e) => setHorasImpartidas(e.target.value)}
                                    />
                                </div>

                                <Table striped bordered hover responsive>
                                    <thead className="table-success">
                                        <tr>
                                            <th>Matrícula</th>
                                            <th>Nombre</th>
                                            <th>Asistencia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alumnos.length > 0 ? (
                                            alumnos.map((alumno) => (
                                                <tr key={alumno.matricula}>
                                                    <td>{alumno.matricula}</td>
                                                    <td>{alumno.nombre} {alumno.apellido_pat} {alumno.apellido_mat}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-around">
                                                            {["presente", "ausente", "justificado"].map((estado) => (
                                                                <div key={estado} className="form-check">
                                                                    <input
                                                                        type="radio"
                                                                        className="form-check-input"
                                                                        name={`asistencia-${alumno.matricula}`}
                                                                        value={estado}
                                                                        checked={asistencia[alumno.matricula] === estado}
                                                                        onChange={() => toggleAsistencia(alumno.matricula, estado)}
                                                                    />
                                                                    <label className="form-check-label">
                                                                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4">
                                                    No hay alumnos inscritos en este gimnasio
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                    
                                <div className="text-center mt-4">
                                    <Button 
                                        variant="success" 
                                        size="lg" 
                                        onClick={handleSubmitAttendance}
                                        disabled={Object.keys(asistencia).length === 0 || horasImpartidas === ""}
                                    >
                                        Guardar Asistencia
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </section>
        </>
    );
}