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