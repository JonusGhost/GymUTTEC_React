import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { servicioAdmin } from "../services/userService";
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';

export default function InformacionAdmin() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [administradores, setAdministradores] = useState([]);
    const [activeTab, setActiveTab] = useState("listado");
    const [idEditando, setIdEditando] = useState(null);
    const [formulario, setFormulario] = useState({
        nombre: "",
        apellido_pat: "",
        apellido_mat: "",
        afili_seguro: "",
        num_celular: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        const fetchAdministradores = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.idUsuario) {
                    setError("Usuario no autenticado.");
                    return;
                }
                const responsetododocentes = await servicioAdmin.obtenerAdministradores();
                setAdministradores(responsetododocentes.data);
            } catch (err) {
                setError(err.response?.data?.error || "Error al cargar la información del admin");
            }
        };
        fetchAdministradores();
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
        });
    };

    const handleDele = async (admin) => {
        try {
            let response = await servicioAdmin.eliminarAdministrador(admin.matricula);
            if (response.error){
                throw new Error(response.error);
            }
            Swal.fire({
                title: "Eliminación exitosa!",
                text: "El administrador ha sido eliminado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                background: '#fff',
                iconColor: '#721c24',
                confirmButtonColor: '#155724',
            });
            const responsetodosadmin = await servicioAdmin.obtenerAdministradores();
            setAdministradores(responsetodosadmin.data);
        } catch (err) {
            setError(err.response?.data?.error || "Error al eliminar al administrador");
        }
    };

    const handleEdit = (admin) => {
        setFormulario({
            id: admin.id || "",
            matricula: admin.matricula || "",
            nombre: admin.nombre || "",
            apellido_pat: admin.apellido_pat || "",
            apellido_mat: admin.apellido_mat || "",
            afili_seguro: admin.afili_seguro || "",
            num_celular: admin.num_celular || "",
            email: admin.users?.email || "",
            password: "",
        });
        setIdEditando(admin.id);
        setActiveTab("registro");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const datosActualizados = {
            matricula: formulario.matricula,
            nombre: formulario.nombre,
            apellido_pat: formulario.apellido_pat,
            apellido_mat: formulario.apellido_mat,
            afili_seguro: formulario.afili_seguro,
            num_celular: formulario.num_celular,
            email: formulario.email,
            ...(formulario.password ? { password: formulario.password } : {}),
        };

        try {
            let response;
            if (idEditando) {
                response = await servicioAdmin.crearAdministrador(datosActualizados);
            } else {
                response = await servicioAdmin.crearAdministrador(datosActualizados);
            }

            if (response.error) {
                throw new Error(response.error);
            }

            Swal.fire({
                title: idEditando ? "¡Actualización exitosa!" : "¡Registro exitoso!",
                text: idEditando ? "El administrador ha sido actualizado correctamente." : "El estudiante ha sido registrado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                background: '#fff',
                iconColor: '#721c24',
                confirmButtonColor: '#155724',
            });

            limpiarFormulario();
            setIdEditando(null);
            const responseAdminis = await servicioAdmin.obtenerAdministradores();
            setAdministradores(responseAdminis.data);
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
                                    <NavDropdown.Item href="/AlumnosGestion">Alumnos</NavDropdown.Item>
                                    <NavDropdown.Item href="/DocentesGestion">Docentes</NavDropdown.Item>
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
                <h2 className="text-center mb-4 text-success">Administradores</h2>
                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} onClick={limpiarFormulario} className="mb-3" justify>
                    <Tab eventKey="listado" title="Lista de Administradores">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Numero Empleado</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {administradores.length > 0 ? (
                                    administradores.map((admin) => (
                                        <tr key={admin.id}>
                                            <td>{admin.matricula}</td>
                                            <td>{admin.nombre} {admin.apellido_pat} {admin.apellido_mat}</td>
                                            <td>{admin.users.email}</td>
                                            <td>
                                                <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEdit(admin)}>Editar</button>
                                                <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDele(admin)}>Eliminar</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No hay administradores disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="registro" title={formulario.id ? "Actualizar Administrador" : "Registrar Administrador"}>
                        <h2 className="text-center mb-4 text-success">{formulario.id ? "Actualizar Administrador" : "Registrar Administrador"}</h2>
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
                </Tabs>
            </section>
        </>
    );
}