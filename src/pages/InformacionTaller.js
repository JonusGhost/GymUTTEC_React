import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { servicioTaller } from "../services/userService";
import { servicioDocente } from "../services/userService";
import { servicioEstudiante } from "../services/userService";
import Swal from 'sweetalert2';

export default function InformacionTaller() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taller, setTaller] = useState(null);
  const [alumno, setAlumno] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [docente, setDocente] = useState(null);
  const [inscrito, setInscrito] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarInformacionTaller = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.idUsuario) {
          setError("Usuario no autenticado.");
          return;
        }
        const matricula = user.idUsuario;
        const response = await servicioEstudiante.obtenerPerfilEstudiante(matricula);
        const responseIns = await servicioEstudiante.verificarInscripcion(matricula, id);
        setInscrito(!!responseIns.data);
        
        const responseTaller = await servicioTaller.obtenerTaller(id);
        const matricula_doc = responseTaller.data.emp_docente;
        
        if (matricula_doc) {
          const responseDocente = await servicioDocente.obtenerPerfilDocente(matricula_doc);
          setDocente(responseDocente.data);
        } else {
          setDocente(null);
        }
        
        const responseHorarios = await servicioTaller.obtenerHorariosTaller(id);
        setAlumno(response.data);
        setHorarios(responseHorarios.data);
        setTaller(responseTaller.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar la información del taller");
      }
    };
  
    if (id) {
      cargarInformacionTaller();
    }
  }, [id]);

  const handleInscrp = async (e) => {
    e.preventDefault();
    try {
        await servicioEstudiante.inscribirTaller({ matricula: alumno.matricula, taller_id: taller.id });
        setInscrito(true);
        Swal.fire({
          title: '¡Inscrito!',
          text: 'Se ha inscrito correctamente.',
          confirmButtonText: 'Aceptar',
          background: '#fff',
          iconColor: '#721c24',
          confirmButtonColor: '#155724',
        });
    } catch (err) {
        setError(err.response?.data?.error || "Error al actualizar la información del alumno");
    }
  };

  const handleAnular = async (e) => {
    e.preventDefault();
    try {
      await servicioEstudiante.cancelarInscripcion({ matricula: alumno.matricula, taller_id: taller.id });
      setInscrito(false);
      Swal.fire({
        title: '¡Inscripción anulada!',
        text: 'Has anulado tu inscripción con éxito.',
        confirmButtonText: 'Aceptar',
        background: '#fff',
        iconColor: '#721c24',
        confirmButtonColor: '#155724',
      });
    } catch (err) {
      setError(err.response?.data?.error || "Error al anular la inscripción");
    }
  };

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
            <h2 className="text-success">{taller.nombre_tall}</h2>
            <p><strong>Descripción:</strong> {taller.descripcion}</p>
            <p><strong>Cupo:</strong> {taller.num_alumnos} alumnos</p>
            {inscrito && (
              <p><strong>Enlace de Grupo:</strong>
                <a href={taller.enlace_grupo} target="_blank" rel="noopener noreferrer"> Grupo</a>
              </p>
            )}
            <form onSubmit={inscrito ? handleAnular : handleInscrp} className="d-flex justify-content-start">
              {inscrito ? (
                <button type="submit" className="btn btn-danger w-50 py-3 fs-5">Anular Inscripción</button>
              ) : (
                <button type="submit" className="btn btn-success w-50 py-3 fs-5">Inscribirse</button>
              )}
            </form>

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

      <div className="row">
        <div className="col-md-12">
          <div className="border p-3 rounded shadow-sm">
            <h4>Horarios Disponibles</h4>
            <table className="table table-bordered text-center">
              <thead className="table-success">
                <tr>
                  <th>Hora</th>
                  <th>Lunes</th>
                  <th>Martes</th>
                  <th>Miércoles</th>
                  <th>Jueves</th>
                  <th>Viernes</th>
                </tr>
              </thead>
              <tbody>
                {["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((hora, idx) => (
                  <tr key={idx}>
                    <td>{hora}</td>
                    {["lunes", "martes", "miercoles", "jueves", "viernes"].map((dia, index) => (
                      <td key={index} 
                          style={{
                            backgroundColor: horarios[dia]?.includes(hora) ? '#28a745' : '#6c757d', 
                            color: '#fff'
                          }} 
                      ></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      </section>
    </div>
  );
}