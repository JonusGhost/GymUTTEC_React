import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft } from "react-icons/fa"; // Flecha para regresar


export default function InformacionTaller() {
  return (
    <div className="container-fluid p-0">
      {/* Barra de título con la flecha de regresar y el título */}
      <header className="d-flex justify-content-between align-items-center py-4 px-3 bg-success text-white"> 
        <FaArrowLeft size={24} className="cursor-pointer" />
       
        <h1 className="fs-4">Información del taller</h1>
        <div></div> {/* Espacio vacío para alinear correctamente */}
      </header>

      {/* Sección de Información del Taller */}
      <section className="container py-5">
        <div className="row">
          {/* Imagen del Taller */}
          <div className="col-md-4">
            <img
              src="https://media.gettyimages.com/id/1433136825/es/foto/una-mujer-est%C3%A1-haciendo-ejercicios-con-una-cuerda-en-el-gimnasio.jpg?s=612x612&w=0&k=20&c=Y1fkof0pxH9HlKafpQtYRb67rkeO4lz6vK1472RW_mw=" // Aquí iría la imagen del taller
              alt="Taller"
              className="img-fluid rounded"
              style={{ borderRadius: "10px" }}
            />
          </div>

          {/* Información del Taller */}
          <div className="col-md-8">
            <h2 className="text-success">Entrenamiento Funcional</h2>
            <p>
              Un entrenamiento que combina ejercicios aeróbicos, de fuerza y flexibilidad, ideal para mejorar el rendimiento físico general.
            </p>
            <div className="mb-4">
              <label className="form-label">Enlace de Grupo:</label>
              <input type="url" className="form-control" placeholder="Introduce el enlace del grupo" />
            </div>
          </div>
        </div>
        
        {/* Sección de Calendario y Horarios */}
        <div className="row mt-5">
          {/* Calendario */}
          <div className="col-md-6">
            <div className="border p-3 rounded shadow-sm">
              <h4>Calendario</h4>
              <div className="p-3" style={{ border: "1px solid #ccc" }}>
                <p>Calendario de disponibilidad del taller (Aquí iría el calendario).</p>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div className="col-md-6">
            <div className="border p-3 rounded shadow-sm">
              <h4>Horarios</h4>
              <div className="mb-3">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="horario1" />
                  <label className="form-check-label" htmlFor="horario1">Lunes 10:00 AM - 11:00 AM</label>
                </div>
                <hr />
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="horario2" />
                  <label className="form-check-label" htmlFor="horario2">Miércoles 6:00 PM - 7:00 PM</label>
                </div>
                <hr />
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="horario3" />
                  <label className="form-check-label" htmlFor="horario3">Viernes 8:00 AM - 9:00 AM</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Inscripción */}
        <div className="mt-4">
          <button className="btn btn-success w-100 py-3 fs-5">Inscribirse</button>
        </div>
      </section>
    </div>
  );
}

