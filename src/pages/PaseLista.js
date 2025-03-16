import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { servicioAsistencia } from "../services/userService";

export default function PaseLista() {
  const [asistencia, setAsistencia] = useState({});
  const [error, setError] = useState("");
  const [tallerId, setTallerId] = useState(null);
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    const fetchAttendanceList = async () => {
      try {
        // Assuming tallerId is passed through props or state
        if (!tallerId) return;

        const response = await servicioAsistencia.obtenerListaAsistencia(tallerId);
        setAlumnos(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar la lista de asistencia");
      }
    };

    fetchAttendanceList();
  }, [tallerId]);

  const toggleAsistencia = (matricula, estado) => {
    setAsistencia({ ...asistencia, [matricula]: estado });
  };

  const handleSubmitAttendance = async () => {
    try {
      await servicioAsistencia.enviarAsistencia({
        taller_id: tallerId,
        asistencias: Object.entries(asistencia).map(([matricula, estado]) => ({
          matricula,
          estado
        }))
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Error al subir la asistencia");
    }
  };

  return (
    <div className="container py-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <FaArrowLeft size={24} className="cursor-pointer" />
        <h1 className="text-success">GYMUTTEC</h1>
      </header>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card p-4 shadow-lg">
        <h2 className="text-start text-success mb-3">Pase de lista</h2>
        <h3 className="text-start text-secondary">Taller de Spinning</h3>
        
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Nombre del Alumno</th>
              <th className="text-center">Presente</th>
              <th className="text-center">Falta</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.matricula}>
                <td>{alumno.matricula}</td>
                <td>{alumno.nombre}</td>
                <td className="text-center">
                  <input
                    type="radio"
                    name={`asistencia-${alumno.matricula}`}
                    checked={asistencia[alumno.matricula] === "presente"}
                    onChange={() => toggleAsistencia(alumno.matricula, "presente")}
                  />
                </td>
                <td className="text-center">
                  <input
                    type="radio"
                    name={`asistencia-${alumno.matricula}`}
                    checked={asistencia[alumno.matricula] === "falta"}
                    onChange={() => toggleAsistencia(alumno.matricula, "falta")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button 
          className="btn btn-success w-100 mt-3"
          onClick={handleSubmitAttendance}
        >
          Subir
        </button>
      </div>
    </div>
  );
}

const alumnos = [
  { matricula: "A001", nombre: "Juan Pérez" },
  { matricula: "A002", nombre: "María López" },
  { matricula: "A003", nombre: "Carlos Hernández" },
  { matricula: "A004", nombre: "Ana Castillo" }
];
