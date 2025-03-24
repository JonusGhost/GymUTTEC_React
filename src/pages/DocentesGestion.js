import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { servicioDocente, servicioAdmin, servicioTaller, servicioGimnasio } from "../services/userService";
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';

export default function InformacionDocente() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [docentes, setDocentes] = useState([]);
    const [activeTab, setActiveTab] = useState("listado");
    const [idEditando, setIdEditando] = useState(null);
    const [talleres, setTalleres] = useState([]);
    const [gimnasios, setGimnasios] = useState([]);
    const [idTaller, setIdTaller] = useState(null);
    const [idGimnasio, setIdGimnasio] = useState(null);
    const [formulario, setFormulario] = useState({
        nombre: "",
        apellido_pat: "",
        apellido_mat: "",
        afili_seguro: "",
        num_celular: "",
        email: "",
        password: "",
        especialidad: "", 
    });

    useEffect(() => {
        const fetchDocentes = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.idUsuario) {
                    setError("Usuario no autenticado.");
                    return;
                }
                const responsetododocentes = await servicioDocente.obtenerTodosDocentes();
                console.log(responsetododocentes.data); 
                setDocentes(responsetododocentes.data);
            } catch (err) {
                setError(err.response?.data?.error || "Error al cargar la información del docente");
            }
            try {
                const responseTalleres = await servicioTaller.obtenerTalleres();
                setTalleres(responseTalleres.data);
            } catch (err) {
                setError(err.response?.data?.error || "Error al cargar la información del taller");
            }
            try {
                const responseTalleres = await servicioGimnasio.obtenerGimnasios();
                setGimnasios(responseTalleres.data);
            } catch (err) {
                setError(err.response?.data?.error || "Error al cargar la información del taller");
            }
        };
        fetchDocentes();
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
            especialidad: "",
        });
    };

    const handleDele = async (docente) => {
        try {
            let response = await servicioDocente.eliminarDocente(docente.matricula);
            if (response.error) {
                throw new Error(response.error);
            }
            Swal.fire({
                title: "Eliminación exitosa!",
                text: "El docente ha sido eliminado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                background: '#fff',
                iconColor: '#721c24',
                confirmButtonColor: '#155724',
            });
            const responsetododocentes = await servicioDocente.obtenerTodosDocentes();
            setDocentes(responsetododocentes.data);
        } catch (err) {
            setError(err.response?.data?.error || "Error al eliminar al docente");
        }
    };

    const handleEdit = (docente) => {
        setFormulario({
            id: docente.id || "",
            matricula: docente.matricula || "",
            nombre: docente.nombre || "",
            apellido_pat: docente.apellido_pat || "",
            apellido_mat: docente.apellido_mat || "",
            num_celular: docente.num_celular || "",
            afili_seguro: docente.afili_seguro || "",
            especialidad: docente.especialidad || "",
            email: docente.users?.email || "",
            password: "",
        });
        setIdEditando(docente.id);
        setActiveTab("registro");
    };

    const handleAsigTall = (docente) => {
        setFormulario({
            id: docente.id || "",
            matricula: docente.matricula || "",
            nombre: docente.nombre || "",
            apellido_pat: docente.apellido_pat || "",
            apellido_mat: docente.apellido_mat || "",
            especialidad: docente.especialidad || "",
        });
        setIdTaller(docente.taller?.id || null);
        setActiveTab("asignar");
    };  

    const handleAsigGim = (docente) => {
        setFormulario({
            id: docente.id || "",
            matricula: docente.matricula || "",
            nombre: docente.nombre || "",
            apellido_pat: docente.apellido_pat || "",
            apellido_mat: docente.apellido_mat || "",
            especialidad: docente.especialidad || "",
        });
        setIdGimnasio(docente.gimnasio?.id || null);
        setActiveTab("asignargim");
    };  

    const handleAsignarTaller = async (e) => {
        e.preventDefault();

        try {
            const datosAsignados = {
                matricula: formulario.matricula,
                taller_id: idTaller,
            };
            console.log(datosAsignados);

            let responseTal = await servicioAdmin.asignarDocenteTaller(datosAsignados.matricula, datosAsignados.taller_id);
            if (responseTal.error) {
                throw new Error(responseTal.error);
            }

            Swal.fire({
                title: "¡Asignación exitosa!",
                text: "El taller ha sido asignado correctamente al docente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                background: '#fff',
                iconColor: '#721c24',
                confirmButtonColor: '#155724',
            });

            limpiarFormulario();
            setIdTaller(null);
            const responseDocentes = await servicioDocente.obtenerTodosDocentes();
            setDocentes(responseDocentes.data);
            setActiveTab("listado");

        } catch (err) {
            setError(err.response?.data?.error || "Error al asignar el taller.");
        }
    };

    const handleAsignarGim = async (e) => {
        e.preventDefault();

        try {
            const datosAsignados = {
                matricula: formulario.matricula,
                gimnasio_id: idGimnasio,
            };
            console.log(datosAsignados);

            let responseGim = await servicioAdmin.asignarDocenteGimnasio(datosAsignados.matricula, datosAsignados.gimnasio_id);
            if (responseGim.error) {
                throw new Error(responseGim.error);
            }

            Swal.fire({
                title: "¡Asignación exitosa!",
                text: "El gimnasio ha sido asignado correctamente al docente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                background: '#fff',
                iconColor: '#721c24',
                confirmButtonColor: '#155724',
            });

            limpiarFormulario();
            setIdGimnasio(null);
            const responseDocentes = await servicioDocente.obtenerTodosDocentes();
            setDocentes(responseDocentes.data);
            setActiveTab("listado");

        } catch (err) {
            setError(err.response?.data?.error || "Error al asignar el gimnasio.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const datosActualizados = {
            matricula: formulario.matricula,
            nombre: formulario.nombre,
            apellido_pat: formulario.apellido_pat,
            apellido_mat: formulario.apellido_mat,
            num_celular: formulario.num_celular,
            afili_seguro: formulario.afili_seguro,
            especialidad: formulario.especialidad,
            email: formulario.email,
            ...(formulario.password ? { password: formulario.password } : {}),
        };

        try {
            let response;
            if (idEditando) {
                response = await servicioDocente.actualizarPerfilDocente(datosActualizados); 
            } else {
                response = await servicioDocente.actualizarPerfilDocente(datosActualizados);
            }

            if (response.error) {
                throw new Error(response.error);
            }

            Swal.fire({
                title: idEditando ? "¡Actualización exitosa!" : "¡Registro exitoso!",
                text: idEditando ? "El docente ha sido actualizado correctamente." : "El docente ha sido registrado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                background: '#fff',
                iconColor: '#721c24',
                confirmButtonColor: '#155724',
            });

            limpiarFormulario();
            setIdEditando(null);
            const responseDocentes = await servicioDocente.obtenerTodosDocentes();
            setDocentes(responseDocentes.data);
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
                                    <NavDropdown.Item href="/AdministradoresGestion">Administradores</NavDropdown.Item>
                                    <NavDropdown.Item href="/AlumnosGestion">Alumnos</NavDropdown.Item>
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
                <h2 className="text-center mb-4 text-success">Docentes</h2>
                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} onClick={limpiarFormulario} className="mb-3" justify>
                    <Tab eventKey="listado" title="Lista de Docentes">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Numero Empleado</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Taller</th>
                                    <th>Gimnasio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docentes.length > 0 ? (
                                    docentes.map((docente) => (
                                        <tr key={docente.id}>
                                            <td>{docente.matricula}</td>
                                            <td>{docente.nombre} {docente.apellido_pat} {docente.apellido_mat}</td>
                                            <td>{docente.users.email}</td>
                                            <td>
                                                {docente?.taller?.nombre_tall || "No tiene taller asignado"}
                                            </td>
                                            <td>
                                                {docente?.gimnasio?.nombre_gim || "No tiene gimnasio asignado"}
                                            </td>
                                            <td>
                                                <button className="btn btn-success btn-sm mx-1" onClick={() => handleAsigTall(docente)}>Taller</button>
                                                <button className="btn btn-success btn-sm mx-1" onClick={() => handleAsigGim(docente)}>Gimnasio</button>
                                                <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEdit(docente)}>Editar</button>
                                                <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDele(docente)}>Eliminar</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No hay docentes disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="registro" title={formulario.id ? "Actualizar Docente" : "Registrar Docente"}>
                        <h2 className="text-center mb-4 text-success">{formulario.id ? "Actualizar Docente" : "Registrar Docente"}</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Matrícula</label>
                                <input type="text" className="form-control" placeholder="Ingrese la matrícula (10 dígitos)" name="matricula" value={formulario.matricula || ""} onChange={(e) => {const value = e.target.value.replace(/\D/g, '').slice(0, 10); setFormulario({...formulario, matricula: value}); }} pattern="\d{10}" maxLength="10" disabled={!!formulario.id} required/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Correo</label>
                                <input type="email" className="form-control" name="email" value={formulario.email || ""} onChange={(e) => setFormulario({...formulario, email: e.target.value})} pattern=".+@uttec\.edu\.mx$" disabled={!!formulario.id} required/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input type="text" className="form-control" name="nombre" value={formulario.nombre} onChange={handleChange} required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Apellido Paterno</label>
                                <input type="text" className="form-control" name="apellido_pat" value={formulario.apellido_pat} onChange={handleChange} required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Apellido Materno</label>
                                <input type="text" className="form-control" name="apellido_mat" value={formulario.apellido_mat} onChange={handleChange} required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Afiliación al Seguro</label>
                                <div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="afili_seguro" value="IMSS" checked={formulario.afili_seguro === "IMSS"} onChange={handleChange}required />
                                        <label className="form-check-label">IMSS</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="afili_seguro" value="ISSSTE" checked={formulario.afili_seguro === "ISSSTE"} onChange={handleChange}required />
                                        <label className="form-check-label">ISSSTE</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="afili_seguro" value="Particular" checked={formulario.afili_seguro === "Particular"} onChange={handleChange}required />
                                        <label className="form-check-label">Particular</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="afili_seguro" value="Otro" checked={formulario.afili_seguro === "Otro"} onChange={handleChange}required />
                                        <label className="form-check-label">Otro</label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Especialidad</label>
                                <input type="text" className="form-control" name="especialidad" value={formulario.especialidad} onChange={handleChange} required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Teléfono</label>
                                <input type="text" className="form-control" name="num_celular" value={formulario.num_celular} onChange={(e) => {const value = e.target.value.replace(/\D/g, '').slice(0,10); setFormulario({...formulario, num_celular: value});}} pattern="\d{10}" maxLength="10" required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">{formulario.id ? "Contraseña (opcional)" : "Contraseña"}</label>
                                <input type="password" className="form-control" name="password" value={formulario.password} onChange={handleChange} placeholder={formulario.id ? "Nueva contraseña" : "Contraseña"} />
                            </div>

                            <button type="submit" className="btn btn-success btn-block">{idEditando ? "Actualizar" : "Registrar"}</button>
                        </form>
                    </Tab>

                    <Tab eventKey="asignar" title="Asignar Taller" disabled>
                        <h2 className="text-center mb-4 text-success">Asignar Taller</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form className="card p-4 shadow-sm" onSubmit={handleAsignarTaller}>
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input type="text" className="form-control" name="nombre" value={formulario.nombre} onChange={handleChange} required disabled />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Apellido Paterno</label>
                                <input type="text" className="form-control" name="apellido_pat" value={formulario.apellido_pat} onChange={handleChange} required disabled />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Apellido Materno</label>
                                <input type="text" className="form-control" name="apellido_mat" value={formulario.apellido_mat} onChange={handleChange} required disabled />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Especialidad</label>
                                <input type="text" className="form-control" name="especialidad" value={formulario.especialidad} onChange={handleChange} required disabled />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Seleccionar Taller</label>
                                <select
                                    className="form-control"
                                    value={idTaller || ""}
                                    onChange={(e) => setIdTaller(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un taller</option>
                                    {talleres.length > 0 ? (
                                        talleres.map((taller) => (
                                            <option key={taller.id} value={taller.id}>
                                                {taller.nombre_tall}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No hay talleres disponibles</option>
                                    )}
                                </select>
                            </div>
                                
                            <button type="submit" className="btn btn-success btn-block">Asignar Taller</button>
                        </form>
                    </Tab>

                    <Tab eventKey="asignargim" title="Asignar Gimnasio" disabled>
                        <h2 className="text-center mb-4 text-success">Asignar Gimnasio</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form className="card p-4 shadow-sm" onSubmit={handleAsignarGim}>
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input type="text" className="form-control" name="nombre" value={formulario.nombre} onChange={handleChange} required disabled />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Apellido Paterno</label>
                                <input type="text" className="form-control" name="apellido_pat" value={formulario.apellido_pat} onChange={handleChange} required disabled />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Apellido Materno</label>
                                <input type="text" className="form-control" name="apellido_mat" value={formulario.apellido_mat} onChange={handleChange} required disabled />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Especialidad</label>
                                <input type="text" className="form-control" name="especialidad" value={formulario.especialidad} onChange={handleChange} required disabled />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Seleccionar Gimnasio</label>
                                <select
                                    className="form-control"
                                    value={idGimnasio || ""}
                                    onChange={(e) => setIdGimnasio(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un gimnasio</option>
                                    {gimnasios.length > 0 ? (
                                        gimnasios.map((gimnasio) => (
                                            <option key={gimnasio.id} value={gimnasio.id}>
                                                {gimnasio.nombre_gim}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No hay gimnasios disponibles</option>
                                    )}
                                </select>
                            </div>
                                
                            <button type="submit" className="btn btn-success btn-block">Asignar Gimnasio</button>
                        </form>
                    </Tab>

                </Tabs>
            </section>
        </>
    );
}