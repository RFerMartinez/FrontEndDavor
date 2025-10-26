// src/api/services/cuotasService.js
import apiClient from '../index'; // Importa la instancia de Axios configurada

// Ya no necesitas API_URL ni getToken aquí

/**
 * Obtiene todas las cuotas del usuario que ha iniciado sesión.
 * El token se envía automáticamente por el interceptor.
 */
export const obtenerMisCuotas = async () => {
    try {
        // Usa apiClient y la ruta relativa
        const response = await apiClient.get('/cuotas/mis-cuotas');
        return response.data;
    } catch (error) {
        console.error("Error al obtener las cuotas:", error);
        return [];
    }
};

/**
 * Obtiene las cuotas de un alumno específico por su DNI (para Staff).
 * El token se envía automáticamente por el interceptor.
 */
export const obtenerCuotasDeAlumno = async (dni) => {
    try {
        // Usa apiClient y la ruta relativa
        const response = await apiClient.get(`/cuotas/alumno/${dni}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener las cuotas del alumno ${dni}:`, error);
        return [];
    }
};