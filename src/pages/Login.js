import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaLock } from "react-icons/fa";
import { servicioAutenticacion } from "../services/userService";

export default function LoginPage() {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      const response = await servicioAutenticacion.iniciarSesion({ matricula, password });
      const data = response.data;

      // Guardar token y usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ idUsuario: matricula, role: data.rolUsuario }));

      // Redirigir según el rol del usuario
      switch (data.rolUsuario) {
        case "E":
          navigate(`/AlumnoTalleres`);
          break;
        case "A":
          navigate("/admin");
          break;
        case "D":
          navigate("/DocenteTaller");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-success">
      <div className="card p-5 shadow-lg" style={{ width: "700px", backgroundColor: "#155724" }}>
        <div className="card-body text-center">
          <h2 className="text-white mb-4 fs-1">GYMUTTEC</h2>
          <div className="mb-4">
            <img 
              src="https://media.istockphoto.com/id/1391410249/photo/sports-and-gym-activities.jpg?s=612x612&w=0&k=20&c=1S-hAmT-CkRtdYV_hcKi1lZdQkXAN_mCy3ebIXlUEnE="
              alt="Logo Gimnasio" 
              className="img-fluid rounded"
              style={{ width: "700px", height: "400px" }}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-4 input-group">
            <span className="input-group-text bg-success text-white fs-4"><FaUser /></span>
            <input
              type="text"
              className="form-control border-success fs-5"
              placeholder="Matrícula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
            />
          </div>
          <div className="mb-4 input-group">
            <span className="input-group-text bg-success text-white fs-4"><FaLock /></span>
            <input
              type="password"
              className="form-control border-success fs-5"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-success w-100 fs-5 py-2" onClick={handleLogin}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
