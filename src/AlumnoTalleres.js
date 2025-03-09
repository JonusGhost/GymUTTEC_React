import "bootstrap/dist/css/bootstrap.min.css";
import { FaCog } from "react-icons/fa"; // Ícono de configuración

export default function AlumnoTalleres() {
  return (
    <div className="container-fluid p-0">
      {/* Barra de título con el logo y los puntos de configuración */}
      <header className="d-flex justify-content-between align-items-center py-4 px-3 bg-success text-white">
        <h1 className="fs-3">GYMUTTEC</h1>
        <FaCog size={24} className="text-white" />
      </header>

      {/* Subtítulo de Talleres Inscritos */}
      <section className="container py-5">
        <h2 className="text-center mb-4 text-success">Talleres donde estás inscrito</h2>
        
        {/* Lista horizontal de Talleres Inscritos */}
        <div className="d-flex overflow-auto">
          {talleresInscritos.map((taller, index) => (
            <div key={index} className="card me-3" style={{ width: "200px", border: "none" }}>
              <img 
                src={taller.imagen} 
                alt={taller.nombre} 
                className="card-img-top" 
                style={{ height: "150px", objectFit: "cover", borderRadius: "50%" }} 
              />
              <div className="card-body text-center">
                <h5 className="card-title text-success">{taller.nombre}</h5>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección separada de Talleres por Explorar */}
      <section className="container py-5 bg-light">
        <h2 className="text-center mb-4 text-success">Talleres por explorar</h2>
        
        {/* Lista de Talleres por Explorar */}
        <div className="row g-4">
          {talleresExplorar.map((taller, index) => (
            <div key={index} className="col-md-6">
              <div className="d-flex bg-white p-3 rounded shadow-sm">
                <img 
                  src={taller.imagen} 
                  alt={taller.nombre} 
                  className="rounded me-3" 
                  style={{ width: "150px", height: "150px", objectFit: "cover" }} 
                />
                <div>
                  <h4 className="text-success">{taller.nombre}</h4>
                  <p>{taller.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const talleresInscritos = [
  { nombre: "Yoga", imagen: "https://blog.marti.mx/wp-content/uploads/2022/11/yoga-y-sus-beneficios..jpg" },
  { nombre: "Entrenamiento Funcional", imagen: "https://universidadeuropea.com/resources/media/images/entrenamiento_funcional_og.original.jpg" },
  { nombre: "Spinning", imagen: "https://as01.epimg.net/deporteyvida/imagenes/2019/09/03/portada/1567536855_286772_1567537023_noticia_normal.jpg" }
];

const talleresExplorar = [
  { nombre: "Boxeo", descripcion: "Aprende técnicas de boxeo y mejora tu resistencia física.", imagen: "https://entrenaenbarcelona.com/wp-content/uploads/2023/12/6A7A1305-scaled.jpg" },
  { nombre: "Pilates", descripcion: "Mejora tu fuerza, flexibilidad y equilibrio con Pilates.", imagen: "https://media.gettyimages.com/id/1483989758/es/foto/diversos-participantes-de-la-clase-de-yoga-haciendo-una-tabla-lateral-en-sus-colchonetas-de.jpg?s=612x612&w=0&k=20&c=fqX5W0ymqiVKtqnDkkzuFYXEOHnPj3B55hAwIYKRi08=" },
  { nombre: "HIIT", descripcion: "Entrenamiento de alta intensidad para quemar grasa y mejorar la resistencia.", imagen: "https://media.gettyimages.com/id/1332405544/es/foto/asi%C3%A1tico-indio-medio-adulto-macho-hombre-practicando-cuerda-de-batalla-en-el-gimnasio.jpg?s=612x612&w=0&k=20&c=ydTpxxEBMTFRRKZT_XYXwmMriOVJQzXZR8lrZonkzUw=" }
];
