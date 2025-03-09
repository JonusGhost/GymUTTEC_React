import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-success">
      <div className="card p-5 shadow-lg" style={{ width: "700px", backgroundColor: "#155724" }}>
        <div className="card-body text-center">
          <h2 className="text-white mb-4 fs-1">GYMUTTEC</h2>
          <div className="mb-4">
            <img src="https://media.istockphoto.com/id/1391410249/photo/sports-and-gym-activities.jpg?s=612x612&w=0&k=20&c=1S-hAmT-CkRtdYV_hcKi1lZdQkXAN_mCy3ebIXlUEnE=" alt="Logo Gimnasio" className="img-fluid rounded" style={{ width: "700px", height: "400px" }} />
          </div>
          <div className="mb-4 input-group">
            <span className="input-group-text bg-success text-white fs-4"><FaUser /></span>
            <input
              type="email"
              className="form-control border-success fs-5"
              placeholder="Matrícula"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
