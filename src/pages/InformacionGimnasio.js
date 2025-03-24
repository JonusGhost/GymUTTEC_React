import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { servicioGimnasio, servicioDocente, servicioEstudiante } from "../services/userService";
import Swal from 'sweetalert2';

export default function InformacionGimnasio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gimnasio, setGimnasio] = useState(null);
  const [alumno, setAlumno] = useState(null);
  const [horarios, setHorarios] = useState({});
  const [docente, setDocente] = useState(null);
  const [inscrito, setInscrito] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarInformacionGimnasio = async () => {
      try {
        setCargando(true);
        setError("");
        
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.idUsuario) {
          setError("Usuario no autenticado.");
          return;
        }
        
        const matricula = user.idUsuario;
        console.log('Cargando datos para matrícula:', matricula, 'y gimnasio ID:', id);

        // Obtener perfil del estudiante primero
        const response = await servicioEstudiante.obtenerPerfilEstudiante(matricula);
        setAlumno(response.data);

        // Verificar inscripción
        const responseIns = await servicioEstudiante.verificarInscripcion({ 
          matricula, 
          gimnasio_id: id 
        });
        console.log('Respuesta verificación inscripción:', responseIns.data);
        setInscrito(Boolean(responseIns.data?.inscrito));

        // Obtener datos del gimnasio
        const responseGimnasio = await servicioGimnasio.obtenerGimnasio(id);
        setGimnasio(responseGimnasio.data);

        // Obtener docente si existe
        const matricula_doc = responseGimnasio.data.emp_docente;
        if (matricula_doc) {
          const responseDocente = await servicioDocente.obtenerPerfilDocente(matricula_doc);
          setDocente(responseDocente.data);
        }

        // Obtener horarios
        const responseHorarios = await servicioGimnasio.obtenerHorariosGimnasio(id);
        setHorarios(responseHorarios.data || {});
        
      } catch (err) {
        console.error('Error al cargar información:', err);
        setError(err.response?.data?.error || "Error al cargar la información del Gimnasio");
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      cargarInformacionGimnasio();
    }
  }, [id]);

  const handleInscrp = async (e) => {
    e.preventDefault();
    try {
      if (!alumno || !gimnasio) return;
      
      await servicioEstudiante.inscribirGimnasio({ 
        matricula: alumno.matricula, 
        gimnasio_id: gimnasio.id 
      });
      
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
      console.error('Error al inscribir:', err);
      setError(err.response?.data?.error || "Error al inscribirse en el gimnasio");
    }
  };

  const handleAnular = async (e) => {
    e.preventDefault();
    try {
      if (!alumno || !gimnasio) return;
      
      await servicioEstudiante.cancelarInscripcionGim({ 
        matricula: alumno.matricula, 
        gimnasio_id: gimnasio.id 
      });
      
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
      console.error('Error al anular inscripción:', err);
      setError(err.response?.data?.error || "Error al anular la inscripción");
    }
  };

  if (cargando) {
    return <div className="text-center p-5">Cargando información del gimnasio...</div>;
  }

  if (!gimnasio) {
    return <div className="text-center p-5">No se pudo cargar la información del gimnasio.</div>;
  }

  return (
    <div className="container-fluid p-0">
      <header className="d-flex justify-content-between align-items-center py-4 px-3 bg-success text-white">
        <FaArrowLeft size={24} className="cursor-pointer" onClick={() => navigate(-1)} />
        <h1 className="fs-4">Información del gimnasio</h1>
        <div></div>
      </header>

      <section className="container py-5">
        <div className="row">
          <div className="col-md-4">
            <img
              src={gimnasio.imagen || "https://via.placeholder.com/300"}
              alt={gimnasio.nombre_gim}
              className="img-fluid rounded"
            />
          </div>

          <div className="col-md-8">
            <h2 className="text-success">{gimnasio.nombre_gim}</h2>
            <p><strong>Descripción:</strong> {gimnasio.descripcion}</p>
            <p><strong>Cupo:</strong> {gimnasio.num_alumnos} alumnos</p>
            {inscrito && (
              <p><strong>Enlace de Grupo:</strong>
                <a href={gimnasio.enlace_grupo} target="_blank" rel="noopener noreferrer"> Grupo</a>
              </p>
            )}
            
            <form onSubmit={inscrito ? handleAnular : handleInscrp} className="d-flex justify-content-start">
              {inscrito ? (
                <button type="submit" className="btn btn-danger w-50 py-3 fs-5">Anular Inscripción</button>
              ) : (
                <button type="submit" className="btn btn-success w-50 py-3 fs-5">Inscribirse</button>
              )}
            </form>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>

        {docente && (
          <div className="mt-4 border p-3 rounded shadow-sm">
            <h4>Docente Responsable</h4>
            <p><strong>Nombre:</strong> {docente.docente.nombre} {docente.docente.apellido_pat} {docente.docente.apellido_mat}</p>
            <p><strong>Especialidad:</strong> {docente.docente.especialidad}</p>
            <p><strong>Contacto:</strong> {docente.docente.num_celular}</p>
          </div>
        )}

        <div className="row mt-4">
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
                  {["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((hora) => (
                    <tr key={hora}>
                      <td>{hora}</td>
                      {["lunes", "martes", "miercoles", "jueves", "viernes"].map((dia) => (
                        <td key={dia} 
                            style={{
                              backgroundColor: horarios[dia]?.includes(hora) ? '#28a745' : 'transparent', 
                              color: horarios[dia]?.includes(hora) ? '#fff' : '#000'
                            }} 
                        >
                          {horarios[dia]?.includes(hora) ? "✓" : ""}
                        </td>
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