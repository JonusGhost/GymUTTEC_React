import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser } from "react-icons/fa";
import { servicioEstudiante } from "../services/userService";
import Swal from 'sweetalert2';

export default function InformacionAlumno() {
    const navigate = useNavigate();
    const [alumno, setAlumno] = useState(null);
    const [error, setError] = useState("");
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

                setFormulario({
                    nombre: response.data.nombre || "",
                    apellido_pat: response.data.apellido_pat || "",
                    apellido_mat: response.data.apellido_mat || "",
                    num_celular: response.data.num_celular || "",
                    afili_seguro: response.data.afili_seguro || "",
                    grado: response.data.grado || "",
                    sit_academica: response.data.sit_academica || "",
                    email: response.data.users?.email || "",
                    password: "",
                });

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
        setFormulario((prevFormulario) => ({
            ...prevFormulario,
            [name]: value,
        }));
    };    

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const datosActualizados = {
                matricula: alumno.matricula,
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

            console.log(datosActualizados);

            await servicioEstudiante.actualizarPerfilEstudiante(datosActualizados);
            Swal.fire({
                title: "¡Actualización exitosa!",
                text: "La información ha sido actualizada correctamente.",
                icon: "success",
                confirmButtonText: 'Aceptar',
                background: '#fff',
                iconColor: '#721c24',
                confirmButtonColor: '#155724',
            });

            setAlumno((prevAlumno) => ({
                ...prevAlumno,
                ...datosActualizados,
            }));

            setFormulario((prev) => ({ ...prev, password: "" }));

        } catch (err) {
            setError(err.response?.data?.error || "Error al actualizar la información del alumno");
        }
    };

    return (
        <div className="container-fluid p-0">
            <header className="d-flex justify-content-between align-items-center py-4 px-3 bg-success text-white">
                <a href="/AlumnoTalleres" className="fs-3" style={{ textDecoration: 'none', color: 'inherit' }}>GYMUTTEC</a>
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
                    <h3 className="text-success">{formulario.nombre} {formulario.apellido_pat} {formulario.apellido_mat}</h3>
                    <p className="text-muted">Si su nombre es incorrecto, envíe un correo a soporte@universidad.edu</p>
                
                    <div className="mb-3">
                        <label className="form-label">Matrícula</label>
                        <input type="text" className="form-control" value={alumno.matricula} disabled />
                    </div>
                
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" className="form-control" name="nombre" value={formulario.nombre} onChange={handleChange} disabled/>
                    </div>
                
                    <div className="mb-3">
                        <label className="form-label">Apellido Paterno</label>
                        <input type="text" className="form-control" name="apellido_pat" value={formulario.apellido_pat} onChange={handleChange} disabled/>
                    </div>
                
                    <div className="mb-3">
                        <label className="form-label">Apellido Materno</label>
                        <input type="text" className="form-control" name="apellido_mat" value={formulario.apellido_mat} onChange={handleChange} disabled/>
                    </div>
                
                    <div className="mb-3">
                        <label className="form-label">Correo</label>
                        <input type="email" className="form-control" name="email" value={formulario.email} onChange={handleChange} disabled/>
                    </div>
                
                    <div className="mb-3">
                        <label className="form-label">Afiliación al Seguro</label>
                        <input type="text" className="form-control" name="afili_seguro" value={formulario.afili_seguro} onChange={handleChange} disabled/>
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Grado</label>
                        <input type="text" className="form-control" name="grado" value={formulario.grado} onChange={handleChange} disabled/>
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Situación Académica</label>
                        <input type="text" className="form-control" name="sit_academica" value={formulario.sit_academica} onChange={handleChange} disabled/>
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
                    <p className="text-center">Cargando información del alumno...</p>
                )}
            </section>
        </div>
    );
}