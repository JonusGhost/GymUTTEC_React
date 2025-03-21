import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { servicioEstudiante, servicioAdmin } from "../services/userService";
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';

export default function InformacionEstudiante() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [estudiantes, setEstudiantes] = useState([]);
    const [activeTab, setActiveTab] = useState("listado");
    const [idEditando, setIdEditando] = useState(null);
    const [formulario, setFormulario] = useState({
        nombre: "",
        apellido_pat: "",
        apellido_mat: "",
        afili_seguro: "",
        num_celular: "",
        email: "",
        password: "",
        sit_academica: "",
        grado: "",
    });

    useEffect(() => {
        const fetchEstudiantes = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.idUsuario) {
                    setError("Usuario no autenticado.");
                    return;
                }
                const responseEstudiantes = await servicioAdmin.obtenerTodosEstudiantes();
                setEstudiantes(responseEstudiantes.data);
            } catch (err) {
                setError(err.response?.data?.error || "Error al cargar la información del estudiante");
            }
        };
        fetchEstudiantes();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario((prevFormulario) => ({
            ...prevFormulario,
            [name]: value,
        }));
    };

    const limpiarFormulario = () => {
        setFormulario({
            nombre: "",
            apellido_pat: "",
            apellido_mat: "",
            afili_seguro: "",
            num_celular: "",
            email: "",
            password: "",
            sit_academica: "",
            grado: "",
        });
    };

    const handleDele = async (estudiante) => {
        try {
            let response = await servicioAdmin.eliminarEstudiante(estudiante.id);
            if (response.error) {
                throw new Error(response.error);
            }
            Swal.fire({
                title: "Eliminación exitosa!",
                text: "El estudiante ha sido eliminado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                background: '#fff',
                iconColor: '#721c24',
                confirmButtonColor: '#155724',
            });
            const responseEstudiantes = await servicioAdmin.obtenerTodosEstudiantes();
            setEstudiantes(responseEstudiantes.data);
        } catch (err) {
            setError(err.response?.data?.error || "Error al eliminar al estudiante");
        }
    };

    const handleEdit = (estudiante) => {
        setFormulario({
            id: estudiante.id,
            nombre: estudiante.nombre,
            apellido_pat: estudiante.apellido_pat,
            apellido_mat: estudiante.apellido_mat,
            num_celular: estudiante.num_celular,
            afili_seguro: estudiante.afili_seguro,
            grado: estudiante.grado,
            sit_academica: estudiante.sit_academica,
            email: estudiante.email,
            password: "",
        });
        setIdEditando(estudiante.id);
        setActiveTab("registro");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const datosActualizados = {
            nombre: formulario.nombre,
            apellido_pat: formulario.apellido_pat,
            apellido_mat: formulario.apellido_mat,
            num_celular: formulario.num_celular,
            afili_seguro: formulario.afili_seguro,
            grado: formulario.grado,
            sit_academica: formulario.sit_academica,
            email: formulario.email,
            ...(formulario.password ? { password: formulario.password } : {}),
        };

        try {
            let response;
            if (idEditando) {
                response = await servicioEstudiante.actualizarPerfilEstudiante(datosActualizados);
            } else {
                response = await servicioEstudiante.actualizarPerfilEstudiante(datosActualizados);
            }

            if (response.error) {
                throw new Error(response.error);
            }

            Swal.fire({
                title: idEditando ? "¡Actualización exitosa!" : "¡Registro exitoso!",
                text: idEditando ? "El estudiante ha sido actualizado correctamente." : "El estudiante ha sido registrado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                background: '#fff',
                iconColor: '#721c24',
                confirmButtonColor: '#155724',
            });

            limpiarFormulario();
            setIdEditando(null);
            const responseEstudiantes = await servicioAdmin.obtenerTodosEstudiantes();
            setEstudiantes(responseEstudiantes.data);
            setActiveTab("listado");

        } catch (err) {
            setError(err.response?.data?.error || "Error al guardar los datos");
        }
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
                                <Nav.Link href="/TalleresGestion" className="text-white">Talleres</Nav.Link>
                                <Nav.Link href="/GimnasiosGestion" className="text-white">Gimnasios</Nav.Link>
                                <NavDropdown title={<span className="text-white">Usuarios</span>} id="nav-basic-nav-dropdown">
                                    <NavDropdown.Item href="/">Administradores</NavDropdown.Item>
                                    <NavDropdown.Item href="/">Docentes</NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link href="/InformacionAdmin" className="text-white">Datos</Nav.Link>
                            </Nav>
                            <Nav>
                                <Nav.Link onClick={handleLogout} className="btn btn-danger btn-sm text-white">Cerrar sesión</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>

            <section className="container py-5">
                <h2 className="text-center mb-4 text-success">Estudiantes</h2>
                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3" justify>
                    <Tab eventKey="listado" title="Lista de Estudiantes">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Matricula</th>
                                    <th>Nombre</th>
                                    <th>Teléfono</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantes.length > 0 ? (
                                    estudiantes.map((estudiante) => (
                                        <tr key={estudiante.id}>
                                            <td>{estudiante.matricula}</td>
                                            <td>{estudiante.nombre} {estudiante.apellido_pat} {estudiante.apellido_mat}</td>
                                            <td>{estudiante.num_celular}</td>
                                            <td>
                                                <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEdit(estudiante)}>Editar</button>
                                                <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDele(estudiante)}>Eliminar</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No hay estudiantes disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="registro" title={idEditando ? "Actualizar Estudiante" : "Registrar Estudiante"}>
                        <h2 className="text-center mb-4 text-success">{idEditando ? "Actualizar Estudiante" : "Registrar Estudiante"}</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Matrícula</label>
                                <input type="text" className="form-control" value={formulario.matricula || ""}  disabled/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input type="text" className="form-control" name="nombre" value={formulario.nombre} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Apellido Paterno</label>
                                <input type="text" className="form-control" name="apellido_pat" value={formulario.apellido_pat} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Apellido Materno</label>
                                <input type="text" className="form-control" name="apellido_mat" value={formulario.apellido_mat} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Correo</label>
                                <input type="email" className="form-control" name="email" value={formulario.email} onChange={handleChange} disabled/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Afiliación al Seguro</label>
                                <input type="text" className="form-control" name="afili_seguro" value={formulario.afili_seguro} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Grado</label>
                                <input type="text" className="form-control" name="grado" value={formulario.grado} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Situación Académica</label>
                                <input type="text" className="form-control" name="sit_academica" value={formulario.sit_academica} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Teléfono</label>
                                <input type="number" className="form-control" name="num_celular" value={formulario.num_celular} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Contraseña (opcional)</label>
                                <input type="password" className="form-control" name="password" value={formulario.password} onChange={handleChange} placeholder="Nueva contraseña" />
                            </div>
                            <button type="submit" className="btn btn-success btn-block">{idEditando ? "Actualizar" : "Registrar"}</button>
                        </form>
                    </Tab>
                </Tabs>
            </section>
        </>
    );
}