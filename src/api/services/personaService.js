// src/api/services/personaService.js
import api from '../index'; // <--- 1. Importa la instancia centralizada de Axios

/**
 * Activa a una persona como alumno en el sistema.
 * Requiere token de staff.
 * @param {object} datosActivacion - Objeto con los datos para la activación.
 */
export const activarAlumno = async (datosActivacion) => {
    try {
        // 2. Usa 'api.post' directamente. La URL base y el token se manejan en 'index.js'
        //    El endpoint relativo es '/alumnos/activar'
        const response = await api.post('/alumnos/activar', datosActivacion);
        return response.data;
    } catch (error) {
        console.error("Error al activar el alumno:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Obtiene la lista de personas.
 * Requiere token de staff.
 */
export const listarPersonas = async () => {
    try {
        // 2. Usa 'api.get'. El endpoint relativo es '/personas/'
        const response = await api.get('/personas/');
        return response.data;
    } catch (error) {
        console.error("Error al listar las personas:", error.response?.data || error.message);
        return []; 
    }
};

/**
 * Obtiene los detalles completos de una persona específica por su DNI.
 * Requiere token de staff.
 * @param {string} dni - DNI de la persona a buscar.
 */
export const obtenerPersonaPorDni = async (dni) => {
    try {
        // 2. Usa 'api.get'. El endpoint relativo es '/personas/{dni}'
        const response = await api.get(`/personas/${dni}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener los detalles de la persona ${dni}:`, error.response?.data || error.message);
        // Podrías verificar si el error es 404 y devolver null específicamente para eso
        if (error.response && error.response.status === 404) {
            console.warn(`Persona con DNI ${dni} no encontrada.`);
            return null;
        }
        return null; // Devuelve null para otros errores también
    }
};

/**
 * Elimina a una persona del sistema (solo si no es alumno, empleado o admin).
 * Requiere token de administrador.
 * @param {string} dni - DNI de la persona a eliminar.
 */
export const eliminarPersona = async (dni) => {
    try {
        // 3. Usa 'api.delete'. El endpoint relativo es '/personas/{dni}'
        // Esta llamada devuelve 204 No Content, por lo que response.data será undefined.
        const response = await api.delete(`/personas/${dni}`);
        return response.data; // Devuelve undefined en caso de éxito
    } catch (error) {
        // 4. Si falla (ej: 403, 404, 400 por regla de negocio), lanza el error
        console.error(`Error al eliminar la persona ${dni}:`, error.response?.data || error.message);
        throw error; // Lanza el error para que el componente Vue pueda mostrar una alerta
    }
};

