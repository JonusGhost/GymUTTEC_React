import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser } from "react-icons/fa";
import { servicioEstudiante } from "../services/userService";
import { servicioTaller } from "../services/api";

export default function AlumnoTalleres() {
  const navigate = useNavigate();
  const [talleresInscritos, setTalleresInscritos] = useState([]);
  const [talleresExplorar, setTalleresExplorar] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTalleres = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!user || !user.idUsuario) {
          setError("Usuario no autenticado.");
          return;
        }

        const matricula = user.idUsuario;

        // Obtener los talleres en los que está inscrito el alumno
        const responseInscritos = await servicioEstudiante.obtenerTalleresInscritos(matricula);
        const dataInscritos = responseInscritos.data;

        // Obtener los detalles de los talleres inscritos
        const talleresInscritosData = await Promise.all(
          dataInscritos.map(async (inscripcion) => {
            const responseTaller = await servicioEstudiante.obtenerDetallesTaller(inscripcion.taller_id);
            return responseTaller.data;
          })
        );

        setTalleresInscritos(talleresInscritosData);

        // Obtener los talleres disponibles para explorar
        const responseExplorar = await servicioTaller.obtenerTalleres();
        setTalleresExplorar(responseExplorar.data);

      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar los talleres");
      }
    };

    fetchTalleres();
  }, []);

  return (
    <div className="container-fluid p-0">
      {/* Barra de título con el logo y usuario */}
      <header className="d-flex justify-content-between align-items-center py-4 px-3 bg-success text-white">
        <h1 className="fs-3">GYMUTTEC</h1>
        <button className="btn btn-outline-light" onClick={() => navigate("/perfilAlumno")}>
          <FaUser size={24} />
        </button>
      </header>

      {/* Subtítulo de Talleres Inscritos */}
      <section className="container py-5">
        <h2 className="text-center mb-4 text-success">Talleres donde estás inscrito</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex overflow-auto">
          {talleresInscritos.length > 0 ? (
            talleresInscritos.map((taller, index) => (
              <div key={index} className="card me-3" style={{ width: "200px", border: "none" }}>
                <img 
                  src={`http://localhost:8000/storage/${taller.imagen}`} 
                  alt={taller.nombre_tall} 
                  className="card-img-top" 
                  style={{ height: "150px", objectFit: "cover", borderRadius: "50%" }} 
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-success">{taller.nombre_tall}</h5>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No estás inscrito en ningún taller.</p>
          )}
        </div>
      </section>

      {/* Sección de Talleres por Explorar */}
      <section className="container py-5 bg-light">
        <h2 className="text-center mb-4 text-success">Talleres por explorar</h2>
        <div className="row g-4">
          {talleresExplorar.length > 0 ? (
            talleresExplorar.map((taller, index) => (
              <div key={index} className="col-md-6">
                <div className="d-flex bg-white p-3 rounded shadow-sm">
                  <img 
                    src={`http://localhost:8000/storage/${taller.imagen}`} 
                    alt={taller.nombre_tall} 
                    className="rounded me-3" 
                    style={{ width: "150px", height: "150px", objectFit: "cover" }} 
                  />
                  <div>
                    <h4 className="text-success">{taller.nombre_tall}</h4>
                    <p>{taller.descripcion}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No hay talleres disponibles para explorar.</p>
          )}
        </div>
      </section>
    </div>
  );
}
