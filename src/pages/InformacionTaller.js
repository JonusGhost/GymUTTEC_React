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
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarInformacionTaller = async () => {
      try {
        const responseTaller = await servicioTaller.obtenerTaller(id);
        setTaller(responseTaller.data);

        const responseHorarios = await servicioTaller.obtenerHorariosTaller(id);
        setHorarios(responseHorarios.data);
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
              src={taller.imagen || "https://media.gettyimages.com/id/1433136825/es/foto/una-mujer-est%C3%A1-haciendo-ejercicios-con-una-cuerda-en-el-gimnasio.jpg?s=612x612&w=0&k=20&c=Y1fkof0pxH9HlKafpQtYRb67rkeO4lz6vK1472RW_mw="}
              alt={taller.nombre}
              className="img-fluid rounded"
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="col-md-8">
            <h2 className="text-success">{taller.nombre}</h2>
            <p>{taller.descripcion}</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-4">
              <label className="form-label">Enlace de Grupo:</label>
              <input 
                type="url" 
                className="form-control" 
                placeholder="Introduce el enlace del grupo" 
                value={taller.enlace_grupo || ""}
                readOnly
              />
            </div>
          </div>
        </div>
        
        <div className="row mt-5">
          <div className="col-md-6">
            <div className="border p-3 rounded shadow-sm">
              <h4>Calendario</h4>
              <div className="p-3" style={{ border: "1px solid #ccc" }}>
                <p>Calendario de disponibilidad del taller</p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="border p-3 rounded shadow-sm">
              <h4>Horarios</h4>
              <div className="mb-3">
                {horarios.map((horario, index) => (
                  <div key={index}>
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id={`horario${index}`} />
                      <label className="form-check-label" htmlFor={`horario${index}`}>
                        {horario.dia} {horario.hora_inicio} - {horario.hora_fin}
                      </label>
                    </div>
                    {index < horarios.length - 1 && <hr />}
                  </div>
                ))}
              </div>
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

