// src/api/services/reclamosService.js
import apiClient from '../index'; // Importa la instancia de Axios configurada

// Ya no necesitas API_URL ni getToken aquí

/**
 * Obtiene todos los reclamos del usuario autenticado.
 * El token se envía automáticamente por el interceptor.
 */
export const obtenerReclamos = async () => {
    try {
        // Usa apiClient y la ruta relativa
        const response = await apiClient.get('/reclamos/mis-reclamos');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los reclamos:", error);
        return [];
    }
};

/**
 * Crea un nuevo reclamo para el usuario autenticado.
 * @param {string} descripcion - El texto del reclamo.
 * El token se envía automáticamente por el interceptor.
 */
export const crearReclamo = async (descripcion) => {
    try {
        const reclamoData = { comentario: descripcion };
        // Usa apiClient y la ruta relativa
        const response = await apiClient.post('/reclamos/', reclamoData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el reclamo:", error);
        throw error;
    }
};
