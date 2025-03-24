import api from './api';

// Servicios para autenticación
export const servicioAutenticacion = {
    iniciarSesion: (credenciales) => api.post('/login', credenciales),
    cerrarSesion: () => api.post('/logout'),
};

// Servicios para estudiantes
export const servicioEstudiante = {
    inscribirTaller: (datos) => api.post('estudiante/taller/inscripcion', datos),
    cancelarInscripcion: (datos) => api.post('/estudiante/taller/anular', datos),

    inscribirGimnasio: (datos) => api.post('estudiante/gimnasio/inscripcion', datos),
    cancelarInscripcionGim: (datos) => api.post('/estudiante/gimnasio/anular', datos),

    obtenerActividades: (matricula) => api.get(`/estudiante/${matricula}/actividades`),
    
    actualizarPerfilEstudiante: (datos) => api.post('/estudiante/guardar', datos),
    verificarInscripcion: (datos) => api.get('estudiante/taller' ,datos),
    obtenerPerfilEstudiante: (matricula) => api.get(`/estudiante/${matricula}`),
    
    obtenerTalleresInscritos: (matricula) => api.get(`/inscripcion/taller/estudiante/${matricula}`),
    obtenerDetallesTaller: (id) => api.get(`/taller/${id}`),
    
    obtenerGimnasioInscritos: (matricula) => api.get(`/inscripcion/gimnasio/estudiante/${matricula}`),
    obtenerDetallesGimnasio: (id) => api.get(`/gimnasio/${id}`),
};

// Servicios para docentes
export const servicioDocente = {
    actualizarPerfilDocente: (datos) => api.post('/docente/guardar', datos),
    eliminarDocente: (matricula) => api.delete(`/docente/eliminar/${matricula}`),
    obtenerTodosDocentes: () => api.get('/docentes'),
    obtenerPerfilDocente: (matricula) => api.get(`/docente/${matricula}`),
};

// Servicios para administración
export const servicioAdmin = {
    crearAdministrador: (datos) => api.post('/administrador/guardar', datos),
    eliminarAdministrador: (matricula) => api.delete(`/administrador/eliminar/${matricula}`),
    obtenerAdministradores: () => api.get('/administradores'),
    obtenerAdministrador: (matricula) => api.get(`/administrador/${matricula}`),
    
    eliminarEstudiante: (matricula) => api.delete(`/estudiante/eliminar/${matricula}`),
    obtenerTodosEstudiantes: () => api.get('/estudiantes'),
    
    bajaDocenteTaller: (datos) => api.post('/administrador/talleres/baja-docente', datos),
    asignarDocenteTaller: (matricula, tallerId) => api.post(`/administrador/talleres/asignar-docente/${matricula}/${tallerId}`),
    
    bajaDocenteGimnasio: (datos) => api.post('/administrador/gimnasio/baja-docente', datos),
    asignarDocenteGimnasio: (matricula, tallerId) => api.post(`/administrador/gimnasio/asignar-docente/${matricula}/${tallerId}`),
};

// Servicios para asistencia
export const servicioAsistencia = {
    obtenerTodasAsistencias: () => api.get('/asistencias'),
    obtenerListaAsistencia: (tallerId) => api.get(`/asistencias/${tallerId}`),
    pasarLista: (datos) => api.post('/asistencias/pasar-lista', datos)
};

// Servicios para talleres
export const servicioTaller = {
    crearTaller: (datos) => api.post('/taller/guardar', datos),
    eliminarTaller: (id) => api.delete(`/taller/eliminar/${id}`),
    obtenerTalleres: () => api.get('/talleres'),
    obtenerTaller: (id) => api.get(`/taller/${id}`),
    obtenerHorariosTaller: (id) => api.get(`talleres/horario/${id}`)
};

// Servicios para gimnasios
export const servicioGimnasio = {
    crearGimnasio: (datos) => api.post('/gimnasio/guardar', datos),
    eliminarGimnasio: (id) => api.delete(`/gimnasio/eliminar/${id}`),
    obtenerGimnasios: () => api.get('/gimnasios'),
    obtenerGimnasio: (id) => api.get(`/gimnasio/${id}`),
    obtenerHorariosGimnasio: (id) => api.get(`gimnasios/horario/${id}`)
};