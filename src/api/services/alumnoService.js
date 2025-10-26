// src/api/services/alumnoService.js
import apiClient from '../index'; // Importa la instancia de Axios configurada

// Ya no necesitas API_URL ni getToken aquí

/**
 * Obtiene la lista completa de alumnos.
 * Requiere token de administrador (gestionado por el interceptor).
 */
export const obtenerTodosLosAlumnos = async () => {
    try {
        // Usa apiClient y la ruta relativa
        const response = await apiClient.get('/alumnos/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los alumnos:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error("Acceso no autorizado. Se requieren permisos de administrador.");
        }
        return [];
    }
};

/**
 * Obtiene la información detallada de un alumno por su DNI.
 * Requiere token de staff (gestionado por el interceptor).
 */
export const obtenerAlumnoPorDni = async (dni) => {
    try {
        // Usa apiClient y la ruta relativa
        const response = await apiClient.get(`/alumnos/${dni}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el detalle del alumno ${dni}:`, error);
        return null;
    }
};

/**
 * Obtiene los horarios de un alumno por su DNI.
 * Requiere token de staff (gestionado por el interceptor).
 */
export const obtenerHorariosPorDni = async (dni) => {
    try {
        // Usa apiClient y la ruta relativa
        const response = await apiClient.get(`/alumnos/${dni}/horarios`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener los horarios del alumno ${dni}:`, error);
        return [];
    }
};
