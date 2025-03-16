import api from './api';

// Servicios para estudiantes
export const servicioEstudiante = {
    obtenerTalleresInscritos: (matricula) => api.get(`/inscripcion/estudiante/${matricula}`),
    obtenerDetallesTaller: (id) => api.get(`/taller/${id}`),
    inscribirTaller: (datos) => api.post('/inscripcion', datos),
    obtenerPerfilEstudiante: (matricula) => api.get(`/estudiante/${matricula}`),
    actualizarPerfilEstudiante: (matricula, datos) => api.put(`/estudiante/${matricula}`, datos),
    cancelarInscripcion: (inscripcionId) => api.delete(`/inscripcion/${inscripcionId}`),
    obtenerHorarios: (tallerId) => api.get(`/taller/${tallerId}/horarios`),
    obtenerAsistencias: (matricula) => api.get(`/estudiante/${matricula}/asistencias`)
};

// Servicios para docentes
export const servicioDocente = {
    obtenerPerfilDocente: (id) => api.get(`/docente/${id}`),
    actualizarPerfilDocente: (id, datos) => api.put(`/docente/${id}`, datos),
    obtenerTalleresAsignados: (id) => api.get(`/docente/${id}/talleres`),
    obtenerAlumnosInscritos: (tallerId) => api.get(`/taller/${tallerId}/alumnos`),
    registrarAsistencia: (datos) => api.post('/asistencia/registrar', datos),
    obtenerHistorialAsistencia: (tallerId) => api.get(`/taller/${tallerId}/historial-asistencia`)
};

// Servicios para asistencia
export const servicioAsistencia = {
    obtenerListaAsistencia: (tallerId) => api.get(`/taller/${tallerId}/asistencia`),
    enviarAsistencia: (datos) => api.post('/asistencia', datos),
    obtenerReporteAsistencia: (tallerId, fecha) => api.get(`/taller/${tallerId}/asistencia/${fecha}`),
    modificarAsistencia: (asistenciaId, datos) => api.put(`/asistencia/${asistenciaId}`, datos)
};

// Servicios para autenticación
export const servicioAutenticacion = {
    iniciarSesion: (credenciales) => api.post('/login', credenciales),
    cerrarSesion: () => api.post('/logout'),
};

// Servicios para talleres
export const servicioTaller = {
    obtenerTalleres: () => api.get('/talleres'),
    obtenerTaller: (id) => api.get(`/talleres/${id}`),
    crearTaller: (datos) => api.post('/talleres', datos),
    actualizarTaller: (id, datos) => api.put(`/talleres/${id}`, datos),
    eliminarTaller: (id) => api.delete(`/talleres/${id}`),
    obtenerHorariosTaller: (id) => api.get(`/talleres/${id}/horarios`),
    actualizarHorarios: (id, datos) => api.put(`/talleres/${id}/horarios`, datos),
    obtenerEstadisticas: (id) => api.get(`/talleres/${id}/estadisticas`),
    buscarTalleres: (filtros) => api.get('/talleres/buscar', { params: filtros })
};

// Servicios para administración
export const servicioAdmin = {
    obtenerUsuarios: () => api.get('/usuarios'),
    crearUsuario: (datos) => api.post('/usuarios', datos),
    actualizarUsuario: (id, datos) => api.put(`/usuarios/${id}`, datos),
    eliminarUsuario: (id) => api.delete(`/usuarios/${id}`),
    obtenerEstadisticasGenerales: () => api.get('/estadisticas'),
    generarReportes: (filtros) => api.get('/reportes', { params: filtros })
};