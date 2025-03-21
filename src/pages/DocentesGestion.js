import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { servicioDocente } from "../services/userService";
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default function DocentesGestion() {
    const navigate = useNavigate();
    const [docentes, setDocentes] = useState([]);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        matricula: "",
        nombre: "",
        apellido_pat: "",
        apellido_mat: "",
        email: "",
        num_celular: "",
        afili_seguro: "",
        especialidad: ""
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchDocentes();
    }, []);

    const fetchDocentes = async () => {
        try {
            const response = await servicioDocente.obtenerTodosDocentes();
            setDocentes(response.data);
        } catch (err) {
            setError(err.response?.data?.error || "Error al cargar los docentes");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleShowModal = (docente = null) => {
        if (docente) {
            setFormData({
                matricula: docente.matricula,
                nombre: docente.nombre,
                apellido_pat: docente.apellido_pat,
                apellido_mat: docente.apellido_mat,
                email: docente.email,
                num_celular: docente.num_celular,
                afili_seguro: docente.afili_seguro,
                especialidad: docente.especialidad
            });
            setEditingId(docente.matricula);
        } else {
            setFormData({
                matricula: "",
                nombre: "",
                apellido_pat: "",
                apellido_mat: "",
                email: "",
                num_celular: "",
                afili_seguro: "",
                especialidad: ""
            });
            setEditingId(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            matricula: "",
            nombre: "",
            apellido_pat: "",
            apellido_mat: "",
            email: "",
            num_celular: "",
            afili_seguro: "",
            especialidad: ""
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await servicioDocente.editarDocente(formData.matricula, formData);
            } else {
                await servicioDocente.actualizarPerfilDocente(formData);
            }
            Swal.fire({
                title: editingId ? "¡Actualización exitosa!" : "¡Registro exitoso!",
                text: editingId
                    ? "El docente ha sido actualizado correctamente."
                    : "El docente ha sido registrado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                background: '#fff',
                iconColor: '#721c24',
                confirmButtonColor: '#155724',
            });
            handleCloseModal();
            fetchDocentes();
        } catch (err) {
            setError(err.response?.data?.error || "Error al guardar los datos");
        }
    };

    const handleDelete = async (matricula) => {
        try {
            await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción no se puede deshacer",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await servicioDocente.eliminarDocente(matricula);
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "El docente ha sido eliminado correctamente.",
                        icon: "success",
                        confirmButtonText: "Aceptar",
                        background: '#fff',
                        iconColor: '#721c24',
                        confirmButtonColor: '#155724',
                    });
                    fetchDocentes();
                }
            });
        } catch (err) {
            setError(err.response?.data?.error || "Error al eliminar el docente");
        }
    };

    return (
        <div className="container-fluid p-0">
            <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#0e9443" }}>
                <Container>
                    <Navbar.Brand className="text-white">GYMUTTEC</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" className="text-white"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/TalleresGestion" className="text-white">Talleres</Nav.Link>
                            <Nav.Link href="/GimnasiosGestion" className="text-white">Gimnasios</Nav.Link>
                            <Nav.Link href="/AlumnosGestion" className="text-white">Alumnos</Nav.Link>
                            <Nav.Link href="/DocentesGestion" className="text-white active">Docentes</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link onClick={handleLogout} className="btn btn-danger btn-sm text-white">Cerrar sesión</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-success">Gestión de Docentes</h2>
                    <Button variant="success" onClick={() => handleShowModal()}>
                        Agregar Docente
                    </Button>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Matrícula</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Teléfono</th>
                            <th>Afiliación Seguro</th>
                            <th>Especialidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {docentes.map((docente) => (
                            <tr key={docente.matricula}>
                                <td>{docente.matricula}</td>
                                <td>{docente.nombre}</td>
                                <td>{`${docente.apellido_pat} ${docente.apellido_mat}`}</td>
                                <td>{docente.num_celular}</td>
                                <td>{docente.afili_seguro}</td>
                                <td>{docente.especialidad}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleShowModal(docente)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(docente.matricula)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={showModal} onHide={handleCloseModal} className="modal-blur" style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(14, 148, 67, 0.1)' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingId ? "Editar Docente" : "Agregar Docente"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Matrícula</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la matrícula (10 dígitos)"
                                    value={formData.matricula}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setFormData({...formData, matricula: value});
                                    }}
                                    pattern="\d{10}"
                                    maxLength="10"
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el nombre"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                    required
                                />
                            </Form.Group>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Apellido Paterno</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese el apellido paterno"
                                            value={formData.apellido_pat}
                                            onChange={(e) => setFormData({...formData, apellido_pat: e.target.value})}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Apellido Materno</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese el apellido materno"
                                            value={formData.apellido_mat}
                                            onChange={(e) => setFormData({...formData, apellido_mat: e.target.value})}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            {!editingId && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Ingrese el email institucional"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        pattern=".+@uttec\.edu\.mx$"
                                        title="Debe ser un correo institucional (@uttec.edu.mx)"
                                        required
                                    />
                                </Form.Group>
                            )}
                            <Form.Group className="mb-3">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el teléfono (10 dígitos)"
                                    value={formData.num_celular}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setFormData({...formData, num_celular: value});
                                    }}
                                    pattern="\d{10}"
                                    maxLength="10"
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Afiliación de Seguro</Form.Label>
                                <Form.Select
                                    value={formData.afili_seguro}
                                    onChange={(e) => setFormData({...formData, afili_seguro: e.target.value})}
                                    required
                                >
                                    <option value="">Seleccione una opción</option>
                                    <option value="IMSS">IMSS</option>
                                    <option value="ISSSTE">ISSSTE</option>
                                    <option value="Particular">Particular</option>
                                    <option value="Otro">Otro</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Especialidad</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la especialidad"
                                    value={formData.especialidad}
                                    onChange={(e) => setFormData({...formData, especialidad: e.target.value})}
                                    required
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end">
                                <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                                    Cancelar
                                </Button>
                                <Button variant="success" type="submit">
                                    {editingId ? "Actualizar" : "Guardar"}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}