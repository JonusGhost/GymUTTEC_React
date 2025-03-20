import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { obtenerTallerPorDocente } from "../services/api";

export default function DocenteTaller() {
    const [taller, setTaller] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "D") {
            navigate("/");
            return;
        }

        const cargarTaller = async () => {
            try {
                const response = await obtenerTallerPorDocente(user.idUsuario);
                setTaller(response.data);
            } catch (error) {
                console.error("Error al obtener el taller", error);
            }
        };

        cargarTaller();
    }, [navigate]);

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-success">Información del Taller</h1>
                <button className="btn btn-danger" onClick={cerrarSesion}>
                    Cerrar Sesión
                </button>
            </div>
            {taller ? (
                <div className="card shadow-lg p-4">
                    <h2>{taller.nombre_tall}</h2>
                    <img
                        src={`/storage/${taller.imagen}`}
                        alt="Taller"
                        className="img-fluid mb-3"
                        style={{ maxHeight: "300px" }}
                    />
                    <p>
                        <strong>Descripción:</strong> {taller.descripcion}
                    </p>
                    <p>
                        <strong>Horario:</strong> {taller.horario}
                    </p>
                    <p>
                        <strong>Enlace Grupo:</strong>{" "}
                        <a
                            href={taller.enlace_grupo}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Acceder
                        </a>
                    </p>
                    <button className="btn btn-primary w-100 mt-3">
                        Pase de Lista
                    </button>
                </div>
            ) : (
                <p>Cargando información del taller...</p>
            )}
        </div>
    );
}
