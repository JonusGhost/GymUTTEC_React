import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser } from "react-icons/fa";
import { servicioEstudiante } from "../services/userService";

export default function InformacionAlumno() {
    const navigate = useNavigate();
    const [alumno, setAlumno] = useState(null);
    const [error, setError] = useState("");
    const [formulario, setFormulario] = useState({});

    useEffect(() => {
        const fetchAlumno = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.idUsuario) {
                    setError("Usuario no autenticado.");
                    return;
                }

                const matricula = user.idUsuario;
                const response = await servicioEstudiante.obtenerPerfilEstudiante(matricula);
                setAlumno(response.data);
                setFormulario(response.data);
            } catch (err) {
                setError(err.response?.data?.error || "Error al cargar la información del alumno");
            }
        };

        fetchAlumno();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario({ ...formulario, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await servicioEstudiante.actualizarPerfilEstudiante(formulario);
            alert("Información actualizada correctamente");
        } catch (err) {
            setError(err.response?.data?.error || "Error al actualizar la información del alumno");
        }
    };

    return (
        <div className="container-fluid p-0">
            <header className="d-flex justify-content-between align-items-center py-4 px-3 bg-success text-white">
                <h1 className="fs-3">GYMUTTEC</h1>
                <div className="d-flex align-items-center">
                    <button className="btn btn-outline-light me-2">
                        <FaUser size={24} />
                    </button>
                    <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
                </div>
            </header>

            <section className="container py-5">
                <h2 className="text-center mb-4 text-success">Información del Alumno</h2>
                {error && <div className="alert alert-danger">{error}</div>}

                {alumno ? (
                    <form className="card p-4 shadow-sm" onSubmit={handleUpdate}>
                        <h3 className="text-success">{alumno.nombre} {alumno.apellido_pat}</h3>
                        <div className="mb-3">
                            <label className="form-label">Correo</label>
                            <input 
                                type="email"
                                className="form-control"
                                name="correo"
                                value={formulario.correo || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Carrera</label>
                            <input 
                                type="text"
                                className="form-control"
                                name="carrera"
                                value={formulario.carrera || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100">Actualizar Información</button>
                    </form>
                ) : (
                    <p className="text-center">Cargando información del alumno...</p>
                )}
            </section>
        </div>
    );
}
