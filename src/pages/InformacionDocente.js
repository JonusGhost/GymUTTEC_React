import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import { servicioDocente } from "../services/userService";

export default function InformacionDocente() {
  const [numeroEmpleado, setNumeroEmpleado] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [afiliacionSeguro, setAfiliacionSeguro] = useState("SI");
  const [celular, setCelular] = useState("");
  const [correoLaboral, setCorreoLaboral] = useState("");
  const [tallerAsignado, setTallerAsignado] = useState("");
  const [error, setError] = useState("");
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.idUsuario) {
          setError("Usuario no autenticado");
          return;
        }

        const response = await servicioDocente.obtenerPerfilDocente(user.idUsuario);
        const data = response.data;
        setTeacherData(data);
        setNumeroEmpleado(data.numero_empleado || "");
        setEspecialidad(data.especialidad || "");
        setAfiliacionSeguro(data.afiliacion_seguro || "SI");
        setCelular(data.celular || "");
        setCorreoLaboral(data.correo_laboral || "");

        // Obtener talleres asignados
        const talleresResponse = await servicioDocente.obtenerTalleresAsignados(user.idUsuario);
        setTallerAsignado(talleresResponse.data[0]?.nombre || "");
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar datos del docente");
      }
    };

    fetchTeacherData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.idUsuario) {
        setError("Usuario no autenticado");
        return;
      }

      await servicioDocente.actualizarPerfilDocente(user.idUsuario, {
        numero_empleado: numeroEmpleado,
        especialidad,
        afiliacion_seguro: afiliacionSeguro,
        celular,
        correo_laboral: correoLaboral
      });

      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Error al actualizar perfil");
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Barra de Título con icono de regreso */}
      <header className="d-flex justify-content-between align-items-center py-4 px-3 bg-success text-white">
              <h1 className="fs-3">GYMUTTEC</h1>
              <FaCog size={24} className="text-white" />
            </header>

      {/* Contenedor con fondo verde y diseño similar al Login */}
      <div className="container mt-5">
        <div
          className="d-flex justify-content-center align-items-center p-4"
          style={{
            backgroundColor: "#155724",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Imagen en Círculo */}
          <div className="me-4">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJRLiJ7unv98l8108w-3GENm9b3rGHJXaEAQ&s"
              alt="Foto Docente"
              className="rounded-circle border border-3 border-white"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          </div>

          {/* Nombre del Docente */}
          <div className="text-white">
            <h2>María López</h2>
          </div>
        </div>

        {/* Sección de Datos del Docente */}
        <section className="mt-4">
          <h3 className="text-center text-success">Datos del Docente</h3>

          <div className="mb-3">
            <label className="form-label">Número de Empleado</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese su número de empleado"
              value={numeroEmpleado}
              onChange={(e) => setNumeroEmpleado(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Especialidad</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese su especialidad"
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
            />
          </div>

          

          <div className="mb-3">
            <label className="form-label">Afiliación al Seguro</label>
            <select
              className="form-select"
              value={afiliacionSeguro}
              onChange={(e) => setAfiliacionSeguro(e.target.value)}
            >
              <option value="SI">Sí</option>
              <option value="NO">No</option>
            </select>
          </div>
        </section>

        {/* Sección de Contacto */}
        <section className="mt-4">
          <h3 className="text-center text-success">Contacto</h3>

          <div className="mb-3">
            <label className="form-label">Número de Celular</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese su número de celular"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo Laboral</label>
            <input
              type="email"
              className="form-control"
              placeholder="Ingrese su correo laboral"
              value={correoLaboral}
              onChange={(e) => setCorreoLaboral(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Taller Asignado</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese el taller asignado"
              value={tallerAsignado}
              onChange={(e) => setTallerAsignado(e.target.value)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}