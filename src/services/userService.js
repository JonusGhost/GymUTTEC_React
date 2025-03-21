import api from './api';

// Servicios para estudiantes
export const servicioEstudiante = {
    obtenerTalleresInscritos: (matricula) => api.get(`/inscripcion/estudiante/${matricula}`),
    obtenerDetallesTaller: (id) => api.get(`/taller/${id}`),
    verificarInscripcion: (datos) => api.get('estudiante/taller' ,datos),
    inscribirTaller: (datos) => api.post('estudiante/inscripcion', datos),
    obtenerPerfilEstudiante: (matricula) => api.get(`/estudiante/${matricula}`),
    actualizarPerfilEstudiante: (datos) => api.post('/estudiante/guardar', datos),
    cancelarInscripcion: (datos) => api.post('/estudiante/anular', datos),
    obtenerActividades: (matricula) => api.get(`/estudiante/${matricula}/actividades`)
};

// Servicios para docentes
export const servicioDocente = {
    obtenerPerfilDocente: (matricula) => api.get(`/docente/${matricula}`),
    actualizarPerfilDocente: (datos) => api.post('/docente/guardar', datos),
    obtenerTodosDocentes: () => api.get('/docentes'),
    eliminarDocente: (matricula) => api.delete(`/docente/eliminar/${matricula}`)
};

// Servicios para asistencia
export const servicioAsistencia = {
    obtenerTodasAsistencias: () => api.get('/asistencias'),
    obtenerListaAsistencia: (tallerId) => api.get(`/asistencias/${tallerId}`),
    pasarLista: (datos) => api.post('/asistencias/pasar-lista', datos)
};

// Servicios para autenticación
export const servicioAutenticacion = {
    iniciarSesion: (credenciales) => api.post('/login', credenciales),
    cerrarSesion: () => api.post('/logout'),
};

// Servicios para talleres
export const servicioTaller = {
    obtenerTalleres: () => api.get('/talleres'),
    obtenerTaller: (id) => api.get(`/taller/${id}`),
    crearTaller: (datos) => api.post('/taller/guardar', datos),
    eliminarTaller: (id) => api.delete(`/taller/eliminar/${id}`),
    obtenerHorariosTaller: (id) => api.get(`talleres/horario/${id}`)
};

// Servicios para gimnasios
export const servicioGimnasio = {
    obtenerGimnasios: () => api.get('/gimnasios'),
    obtenerGimnasio: (id) => api.get(`/gimnasio/${id}`),
    crearGimnasio: (datos) => api.post('/gimnasio/guardar', datos),
    eliminarGimnasio: (id) => api.delete(`/gimnasio/eliminar/${id}`)
};

// Servicios para administración
export const servicioAdmin = {
    obtenerAdministradores: () => api.get('/administradores'),
    crearAdministrador: (datos) => api.post('/administrador/guardar', datos),
    eliminarAdministrador: (matricula) => api.delete(`/administrador/eliminar/${matricula}`),
    obtenerAdministrador: (matricula) => api.get(`/administrador/${matricula}`),
    asignarDocenteTaller: (matricula, tallerId) => api.post(`/administrador/talleres/asignar-docente/${matricula}/${tallerId}`),
    bajaDocenteTaller: (datos) => api.post('/administrador/talleres/baja-docente', datos),
    asignarDocenteGimnasio: (datos) => api.post('/administrador/gimnasio/asignar-docente', datos),
    bajaDocenteGimnasio: (datos) => api.post('/administrador/gimnasio/baja-docente', datos),
    obtenerTodosEstudiantes: () => api.get('/estudiantes'),
    eliminarEstudiante: (matricula) => api.delete(`/estudiante/eliminar/${matricula}`),
};