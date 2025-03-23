import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { servicioDocente } from "../services/userService";
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function InformacionDocente() {
    const navigate = useNavigate();
    const [docente, setDocente] = useState(null);
    const [error, setError] = useState("");
    const [formulario, setFormulario] = useState({
        matricula: "",
        nombre: "",
        apellido_pat: "",
        apellido_mat: "",
        especialidad: "",
        num_celular: "",
        afili_seguro: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        const fetchDocente = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.idUsuario) {
                    setError("Usuario no autenticado.");
                    return;
                }

                const matricula = user.idUsuario;
                const response = await servicioDocente.obtenerPerfilDocente(matricula);
                setDocente(response.data);

                setFormulario({
                    matricula: response.data.matricula || "",
                    nombre: response.data.nombre || "",
                    apellido_pat: response.data.apellido_pat || "",
                    apellido_mat: response.data.apellido_mat || "",
                    especialidad: response.data.especialidad || "",
                    num_celular: response.data.num_celular || "",
                    afili_seguro: response.data.afili_seguro || "",
                    email: response.data.users?.email || "",
                    password: "",
                });
            } catch (err) {
                setError(err.response?.data?.error || "Error al cargar la información del docente");
            }
        };
        fetchDocente();
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const datosActualizados = {
                matricula: docente.matricula,
                nombre: formulario.nombre,
                apellido_pat: formulario.apellido_pat,
                apellido_mat: formulario.apellido_mat,
                especialidad: formulario.especialidad,
                num_celular: formulario.num_celular,
                afili_seguro: formulario.afili_seguro,
                email: formulario.email,
                ...(formulario.password ? { password: formulario.password } : {}),
            };

            await servicioDocente.obtenerPerfilDocente(datosActualizados);
            Swal.fire({
                title: "¡Actualización exitosa!",
                text: "La información ha sido actualizada correctamente.",
                icon: "success",
                confirmButtonText: 'Aceptar',
                background: '#fff',
                iconColor: '#721c24',
                confirmButtonColor: '#155724',
            });

            setDocente((prevDocente) => ({
                ...prevDocente,
                ...datosActualizados,
            }));

            setFormulario((prev) => ({ ...prev, password: "" }));

        } catch (err) {
            setError(err.response?.data?.error || "Error al actualizar la información del docente");
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
                          <Nav.Link href="/" className="text-white">Talleres</Nav.Link>
                          <Nav.Link href="/" className="text-white">Gimnasios</Nav.Link>
                      </Nav>
                      <Nav>
                          <Nav.Link onClick={handleLogout} className="btn btn-danger btn-sm text-white">Cerrar sesión</Nav.Link>
                      </Nav>
                  </Navbar.Collapse>
              </Container>
          </Navbar>

          <section className="container py-5">
          <h2 className="text-center mb-4 text-success">Información del Docente</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {docente ? (
              <form className="card p-4 shadow-sm" onSubmit={handleUpdate}>
                <h3 className="text-success">{formulario.nombre} {formulario.apellido_pat} {formulario.apellido_mat}</h3>
                <p className="text-muted">Si su nombre es incorrecto, envíe un correo a soporte@universidad.edu</p>
            
                <div className="mb-3">
                  <label className="form-label">Matrícula</label>
                  <input type="text" className="form-control" value={docente.matricula} disabled />
                </div>
            
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input type="email" className="form-control" name="email" value={formulario.email} onChange={handleChange} disabled />
                </div>
            
                <div className="mb-3">
                  <label className="form-label">Afiliación al Seguro</label>
                  <input type="text" className="form-control" name="afili_seguro" value={formulario.afili_seguro} onChange={handleChange} disabled />
                </div>
            
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input type="number" className="form-control" name="num_celular" value={formulario.num_celular} onChange={handleChange} />
                </div>
            
                <div className="mb-3">
                  <label className="form-label">Contraseña (opcional)</label>
                  <input type="password" className="form-control" name="password" value={formulario.password} onChange={handleChange} placeholder="Nueva contraseña" />
                </div>
            
                <button type="submit" className="btn btn-success w-100">Actualizar Información</button>
              </form>
            ) : (
              <p className="text-center">Cargando información del docente...</p>
            )}
          </section>
        </div>
    );
}