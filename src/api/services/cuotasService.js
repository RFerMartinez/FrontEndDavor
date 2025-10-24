
import axios from 'axios';
import { getToken } from '../storage/userStorage';

// URL base de tu API.
const API_URL = 'http://localhost:8000/cuotas';

/**
 * Obtiene todas las cuotas del usuario que ha iniciado sesión.
 * El token se envía para que el backend sepa de quién son las cuotas.
 */
export const obtenerMisCuotas = async () => {
    try {
        const token = getToken();
        if (!token) throw new Error('No hay token de autenticación.');

        const response = await axios.get(`${API_URL}/mis-cuotas`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        
        // La API devuelve un array de cuotas
        return response.data;
    } catch (error) {
        console.error("Error al obtener las cuotas:", error);
        // Devuelve un array vacío en caso de error para no romper la UI.
        return [];
    }
};

/**
 * Obtiene las cuotas de un alumno específico por su DNI (para Staff).
 */
export const obtenerCuotasDeAlumno = async (dni) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No hay token de autenticación.');

        // Usamos el nuevo endpoint que creaste
        const response = await axios.get(`${API_URL}/alumno/${dni}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener las cuotas del alumno ${dni}:`, error);
        return [];
    }
};

