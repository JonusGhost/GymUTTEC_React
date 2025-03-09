import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
  return (
    <div className="container-fluid p-0">
      {/* Título del Gimnasio */}
      <header className="text-center py-4 bg-success text-white">
        <h1 className="display-4">Gimnasio UTT</h1>
      </header>
      
      {/* Imagen Principal */}
      <div>
        <img src="https://media.gettyimages.com/id/1296308226/es/foto/sport-and-fitness-equipment.jpg?s=612x612&w=0&k=20&c=8gcDFFbHcXcSIPxJ9Nb2w-48AUgxIO4gYKQmQWixNcU=" alt="Gimnasio" className="img-fluid w-100" style={{ maxHeight: "400px", objectFit: "cover" }} />
      </div>

      {/* Sección de Talleres */}
      <section className="container py-5">
        <h2 className="text-center mb-4 text-success">Talleres</h2>
        <p className="text-center">Explora los diferentes talleres que ofrecemos para mejorar tu condición física y bienestar.</p>

        {/* Lista de Talleres */}
        <div className="row g-4">
          {talleres.map((taller, index) => (
            <div key={index} className="col-md-6">
              <div className="d-flex bg-light p-3 rounded shadow-sm">
                <img src={taller.imagen} alt={taller.nombre} className="rounded me-3" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
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

const talleres = [
  { nombre: "Yoga", descripcion: "Mejora tu flexibilidad y equilibrio con nuestras clases de yoga.", imagen: "https://blog.marti.mx/wp-content/uploads/2022/11/yoga-y-sus-beneficios..jpg" },
  { nombre: "Entrenamiento Funcional", descripcion: "Rutinas dinámicas para fortalecer todo el cuerpo.", imagen: "https://universidadeuropea.com/resources/media/images/entrenamiento_funcional_og.original.jpg" },
  { nombre: "Spinning", descripcion: "Ejercita tu resistencia cardiovascular en nuestras clases de spinning.", imagen: "https://as01.epimg.net/deporteyvida/imagenes/2019/09/03/portada/1567536855_286772_1567537023_noticia_normal.jpg" },
  { nombre: "Boxeo", descripcion: "Aprende técnicas de boxeo y mejora tu resistencia física.", imagen: "https://entrenaenbarcelona.com/wp-content/uploads/2023/12/6A7A1305-scaled.jpg" }
];
