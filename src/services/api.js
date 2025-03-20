import axios from 'axios';

// Configuración base de axios
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para manejar errores
api.interceptors.response.use(
    respuesta => respuesta,
    error => {
        console.error('Error en la petición:', error);
        return Promise.reject(error);
    }
);

// Servicios de autenticación
export const servicioAutenticacion = {
    iniciarSesion: (credenciales) => api.post('/login', credenciales),
    cerrarSesion: () => api.post('/logout')
};

export const obtenerTallerPorDocente = async (matricula) => {
    const { data: docente } = await api.get(`/docente/${matricula}`);
    return await api.get(`/talleres/${docente.emp_docente}`);
};


export const servicioTaller = {
    obtenerTalleres: () => api.get('/talleres'),
    obtenerTaller: (id) => api.get(`/talleres/${id}`),
    crearTaller: (datos) => api.post('/talleres', datos),
    actualizarTaller: (id, datos) => api.put(`/talleres/${id}`, datos),
    eliminarTaller: (id) => api.delete(`/talleres/${id}`)
};
export default api;

