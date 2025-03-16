import api from './api';

// Servicios para estudiantes
export const servicioEstudiante = {
    obtenerTalleresInscritos: (matricula) => api.get(`/inscripcion/estudiante/${matricula}`),
    obtenerDetallesTaller: (id) => api.get(`/taller/${id}`),
    inscribirTaller: (datos) => api.post('/inscripcion', datos),
    obtenerPerfilEstudiante: (matricula) => api.get(`/estudiante/${matricula}`),
    actualizarPerfilEstudiante: (matricula, datos) => api.put(`/estudiante/${matricula}`, datos)
};

// Servicios para docentes
export const servicioDocente = {
    obtenerPerfilDocente: (id) => api.get(`/docente/${id}`),
    actualizarPerfilDocente: (id, datos) => api.put(`/docente/${id}`, datos),
    obtenerTalleresAsignados: (id) => api.get(`/docente/${id}/talleres`)
};

// Servicios para asistencia
export const servicioAsistencia = {
    obtenerListaAsistencia: (tallerId) => api.get(`/taller/${tallerId}/asistencia`),
    enviarAsistencia: (datos) => api.post('/asistencia', datos)
};

// Servicios para autenticación
export const servicioAutenticacion = {
    iniciarSesion: (credenciales) => api.post('/login', credenciales),
    cerrarSesion: () => api.post('/logout')
};

// Servicios para talleres
export const servicioTaller = {
    obtenerTalleres: () => api.get('/talleres'),
    obtenerTaller: (id) => api.get(`/talleres/${id}`),
    crearTaller: (datos) => api.post('/talleres', datos),
    actualizarTaller: (id, datos) => api.put(`/talleres/${id}`, datos),
    eliminarTaller: (id) => api.delete(`/talleres/${id}`)
};