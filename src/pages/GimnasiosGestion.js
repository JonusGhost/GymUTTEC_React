import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { servicioGimnasio } from "../services/userService";
import { servicioDocente } from "../services/userService";
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
    const [GimnasiosExplorar, setGimnasiosExplorar] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [activeTab, setActiveTab] = useState("listado");
    const [idEditando, setIdEditando] = useState(null);
    const [formulario, setFormulario] = useState({
        nombre: "",
        descripcion: "",
        enlaceGrupo: "",
        numeroAlumnos: "",
        imagen: null,
        horario: {},
        docenteId: "",
    });

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.idUsuario) {
                    setError("Usuario no autenticado.");
                    return;
                }
                const responseGimnasios = await servicioGimnasio.obtenerGimnasios();
                const responseDocentes = await servicioDocente.obtenerTodosDocentes(); // Este servicio debe devolverte los docentes
                setGimnasiosExplorar(responseGimnasios.data);
                setDocentes(responseDocentes.data);
            } catch (err) {
                setError(err.response?.data?.error || "Error al cargar la información del admin");
            }
        };
        fetchAdmin();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleChange = (e) => {
        const { name, value, type, checked, dataset } = e.target;
        
        if (type === "file") {
            setFormulario({
                ...formulario,
                [name]: e.target.files[0], 
            });
        } else if (type === "checkbox") {
            const day = dataset.day;
            setFormulario(prevState => {
                const newHorario = { ...prevState.horario };
                if (!newHorario[day]) {
                    newHorario[day] = [];
                }
                if (checked) {
                    newHorario[day].push(value);
                } else {
                    newHorario[day] = newHorario[day].filter(hour => hour !== value);
                }

                return { ...prevState, horario: newHorario };
            });
        } else {
            setFormulario({
                ...formulario,
                [name]: value,
            });
        }
    };

    const limpiarFormulario = () => {
        setFormulario({
            nombre: "",
            descripcion: "",
            enlaceGrupo: "",
            numeroAlumnos: "",
            imagen: null,
            horario: {},
            docenteId: "",
        });
    };

    const handleDele = async (taller) => {
        try {
            let response;
            response = await servicioGimnasio.eliminarGimnasio(taller.id);
            if (response.error) {
                throw new Error(response.error);
            }
            Swal.fire({
                title: "Eliminacion exitosa!",
                text: "El taller ha sido eliminaado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                background: '#fff', 
                iconColor: '#721c24', 
                confirmButtonColor: '#155724', 
            });
            const responseGimnasios = await servicioGimnasio.obtenerGimnasios();
            setGimnasiosExplorar(responseGimnasios.data);
        } catch (err) {
            setError(err.response?.data?.error || "Error al guardar los datos");
        }
    };

    const handleEdit = (taller) => {
        console.log("Editando taller con ID:", taller.id);
        setFormulario({
            id: taller.idEditando,
            nombre: taller.nombre_gim,
            descripcion: taller.descripcion,
            enlaceGrupo: taller.enlace_grupo,
            numeroAlumnos: taller.num_alumnos,
            docenteId_1: taller.emp_docente_1,
            docenteId_2: taller.emp_docente_2,
            docenteId_3: taller.emp_docente_3,
            horario: typeof taller.horario === "string" ? JSON.parse(taller.horario) : taller.horario || {},
            imagen: null, 
        });
    
        setIdEditando(taller.id); 
        setActiveTab("registro"); 
    };    

    const handleSubmit = async (e) => {
        console.log("Editando taller con ID:", idEditando);
        e.preventDefault();
        const datosActualizados = {
            id: idEditando,
            nombre_gim: formulario.nombre,
            descripcion: formulario.descripcion,
            enlace_grupo: formulario.enlaceGrupo,
            num_alumnos: formulario.numeroAlumnos,
            imagen: formulario.imagen,
            horario: JSON.stringify(formulario.horario),
            emp_docente: formulario.docenteId,
            emp_docente_1: formulario.docenteId_1,
            emp_docente_2: formulario.docenteId_2,
            emp_docente_3: formulario.docenteId_3,
        };

        console.log(datosActualizados);

        try {
            let response;
            if (idEditando) {
                response = await servicioGimnasio.crearGimnasio(datosActualizados);
            } else {
                response = await servicioGimnasio.crearGimnasio(datosActualizados);
            }
    
            if (response.error) {
                throw new Error(response.error);
            }
    
            Swal.fire({
                title: idEditando ? "¡Actualización exitosa!" : "¡Registro exitoso!",
                text: idEditando
                    ? "El taller ha sido actualizado correctamente."
                    : "El taller ha sido creado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                background: '#fff', 
                iconColor: '#721c24', 
                confirmButtonColor: '#155724', 
            });
    
            limpiarFormulario();
            setIdEditando(null);
            const responseGimnasios = await servicioGimnasio.obtenerGimnasios();
            setGimnasiosExplorar(responseGimnasios.data);
            setActiveTab("listado");
    
        } catch (err) {
            setError(err.response?.data?.error || "Error al guardar los datos");
        }
    };

    const hours = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    const days = ["lunes", "martes", "miércoles", "jueves", "viernes"];

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
                                <NavDropdown title={<span className="text-white">Usuarios</span>} id="nav-basic-nav-dropdown">
                                    <NavDropdown.Item href="/">Administradores</NavDropdown.Item>
                                    <NavDropdown.Item href="/">Alumnos</NavDropdown.Item>
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
                <h2 className="text-center mb-4 text-success">Gimnasios</h2>
                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3" justify>
                    <Tab eventKey="listado" title="Lista de Gimnasios">
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Enlace</th>
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
                    <Tab eventKey="registro" title="Registro de Taller">
                        <h2 className="text-center mb-4 text-success">Registro</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input type="text" className="form-control" name="nombre" value={formulario.nombre} onChange={handleChange}/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Descripción</label>
                                <input type="text" className="form-control" name="descripcion" value={formulario.descripcion} onChange={handleChange}/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Enlace de grupo</label>
                                <input type="text" className="form-control" name="enlaceGrupo" value={formulario.enlaceGrupo} onChange={handleChange}/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Número de alumnos</label>
                                <input type="number" className="form-control" name="numeroAlumnos" value={formulario.numeroAlumnos} onChange={handleChange}/>
                            </div>

                            <div className="mb-3">
                            <label className="form-label">Docentes</label>
                                <select 
                                    name="docenteId" 
                                    className="form-control" 
                                    value={formulario.docenteId_1} 
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione un docente</option>
                                    {docentes.map(docente => (
                                        <option key={docente.id} value={docente.matricula}>
                                            {docente.nombre} {docente.apellido_pat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <select 
                                    name="docenteId" 
                                    className="form-control" 
                                    value={formulario.docenteId_2} 
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione un docente</option>
                                    {docentes.map(docente => (
                                        <option key={docente.id} value={docente.matricula}>
                                            {docente.nombre} {docente.apellido_pat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                                
                            <div className="mb-3">
                                <select 
                                    name="docenteId" 
                                    className="form-control" 
                                    value={formulario.docenteId_3} 
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione un docente</option>
                                    {docentes.map(docente => (
                                        <option key={docente.id} value={docente.matricula}>
                                            {docente.nombre} {docente.apellido_pat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Imagen</label>
                                <input type="file" className="form-control" name="imagen" onChange={handleChange}/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Horario</label>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            {hours.map(hour => (
                                                <th key={hour}>
                                                    <label className="form-label">{hour}</label>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {days.map(day => (
                                            <tr key={day}>
                                                <td>
                                                    <label className="form-label">
                                                        {day.charAt(0).toUpperCase() + day.slice(1)}
                                                    </label>
                                                </td>
                                                {hours.map(hour => (
                                                    <td key={hour}>
                                                        <div className="form-check form-check-inline">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                value={hour}
                                                                data-day={day}
                                                                checked={formulario.horario[day]?.includes(hour) || false}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <button type="submit" className="btn btn-success w-100">
                                {idEditando ? "Actualizar Taller" : "Registrar Taller"}
                            </button>
                        </form>
                    </Tab>
                </Tabs>
            </section>
        </>
    );
}