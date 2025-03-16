import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser } from "react-icons/fa";

export default function AlumnoTalleres() {
  const navigate = useNavigate();
  const [talleresInscritos, setTalleresInscritos] = useState([]);
  const [talleresExplorar, setTalleresExplorar] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTalleres = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.idUsuario) {
          setError("Usuario no autenticado.");
          return;
        }

        const matricula = user.idUsuario;

        const responseInscritos = await fetch(
          `http://localhost:8000/api/inscripcion/estudiante/${matricula}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const dataInscritos = await responseInscritos.json();

        if (!responseInscritos.ok || dataInscritos.error) {
          throw new Error(dataInscritos.error || "Error al cargar los talleres");
        }

        const talleresInscritosData = await Promise.all(
          dataInscritos.map(async (inscripcion) => {
            const responseTaller = await fetch(
              `http://localhost:8000/api/taller/${inscripcion.taller_id}`
            );
            const taller = await responseTaller.json();
            return taller;
          })
        );

        setTalleresInscritos(talleresInscritosData);

        const responseExplorar = await fetch("http://localhost:8000/api/talleres", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const dataExplorar = await responseExplorar.json();

        if (!responseExplorar.ok || dataExplorar.error) {
          throw new Error(dataExplorar.error || "Error al cargar los talleres");
        }

        setTalleresExplorar(dataExplorar);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTalleres();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container-fluid p-0">
      <header className="d-flex justify-content-between align-items-center py-4 px-3 bg-success text-white">
        <h1 className="fs-3">GYMUTTEC</h1>
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-light me-2" onClick={() => navigate("/perfilAlumno")}>
            <FaUser size={24} />
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="container py-5">
        <h2 className="text-center mb-4 text-success">Talleres donde estás inscrito</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex overflow-auto">
          {talleresInscritos.length > 0 ? (
            talleresInscritos.map((taller, index) => (
              <div
                key={index}
                className="card me-3"
                style={{ width: "200px", border: "none", cursor: "pointer" }}
                onClick={() => navigate(`/detalleTaller/${taller.id}`)}
              >
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

      <section className="container py-5 bg-light">
        <h2 className="text-center mb-4 text-success">Talleres por explorar</h2>
        <div className="row g-4">
          {talleresExplorar.length > 0 ? (
            talleresExplorar.map((taller, index) => (
              <div key={index} className="col-md-6">
                <div
                  className="d-flex bg-white p-3 rounded shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/detalleTaller/${taller.id}`)}
                >
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
