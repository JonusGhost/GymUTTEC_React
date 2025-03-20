import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { servicioTaller } from "../services/userService";

export default function InformacionTaller() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taller, setTaller] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [docente, setDocente] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarInformacionTaller = async () => {
      try {
        const responseTaller = await servicioTaller.obtenerTaller(id);
        setTaller(responseTaller.data);

        const responseHorarios = await servicioTaller.obtenerHorariosTaller(id);
        setHorarios(responseHorarios.data);

        if (responseTaller.data.docente_matricula) {
          const responseDocente = await servicioTaller.obtenerDocente(responseTaller.data.docente_matricula);
          setDocente(responseDocente.data);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar la información del taller");
      }
    };

    if (id) {
      cargarInformacionTaller();
    }
  }, [id]);

  if (!taller) {
    return <div className="text-center p-5">Cargando información del taller...</div>;
  }

  return (
    <div className="container-fluid p-0">
      <header className="d-flex justify-content-between align-items-center py-4 px-3 bg-success text-white"> 
        <FaArrowLeft size={24} className="cursor-pointer" onClick={() => navigate(-1)} />
        <h1 className="fs-4">Información del taller</h1>
        <div></div>
      </header>

      <section className="container py-5">
        <div className="row">
          <div className="col-md-4">
            <img
              src={taller.imagen || "https://via.placeholder.com/300"}
              alt={taller.nombre}
              className="img-fluid rounded"
            />
          </div>

          <div className="col-md-8">
            <h2 className="text-success">{taller.nombre}</h2>
            <p><strong>Descripción:</strong> {taller.descripcion}</p>
            <p><strong>Cupo:</strong> {taller.num_alumnos} alumnos</p>
            <p><strong>Enlace de Grupo:</strong> <a href={taller.enlace_grupo} target="_blank" rel="noopener noreferrer">Acceder</a></p>
            {error && <div className="alert alert-danger">{error}</div>}
          </div>
        </div>

        {docente && (
          <div className="mt-4 border p-3 rounded shadow-sm">
            <h4>Docente Responsable</h4>
            <p><strong>Nombre:</strong> {docente.nombre} {docente.apellido_pat} {docente.apellido_mat}</p>
            <p><strong>Especialidad:</strong> {docente.especialidad}</p>
            <p><strong>Contacto:</strong> {docente.num_celular}</p>
          </div>
        )}

        <div className="row mt-4">
          <div className="col-md-6">
            <div className="border p-3 rounded shadow-sm">
              <h4>Horarios Disponibles</h4>
              {horarios.length > 0 ? (
                horarios.map((horario, index) => (
                  <p key={index}>{horario.dia}: {horario.hora_inicio} - {horario.hora_fin}</p>
                ))
              ) : (
                <p>No hay horarios disponibles.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button className="btn btn-success w-100 py-3 fs-5">Inscribirse</button>
        </div>
      </section>
    </div>
  );
}
