import axios from 'axios';
import { getToken } from '../storage/userStorage';

// URL base de tu API.
const API_URL = 'http://localhost:8000/alumnos';

/**
 * Obtiene la lista completa de alumnos.
 * Requiere token de administrador.
 */
export const obtenerTodosLosAlumnos = async () => {
    try {
        const token = getToken();
        if (!token) {
        // Si no hay token, no tiene sentido hacer la llamada.
        throw new Error('No hay token de autenticación.');
        }

        const response = await axios.get(`${API_URL}/`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        
        // La API devuelve un array de alumnos.
        return response.data;
    } catch (error) {
        console.error("Error al obtener los alumnos:", error);
        // Manejo de errores: si es un 403 (prohibido) o 401 (no autorizado),
        // podríamos redirigir al login en el futuro.
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.error("Acceso no autorizado. Se requieren permisos de administrador.");
        }
        return []; // Devuelve un array vacío para no romper la UI.
    }
};

/**
 * Obtiene la información detallada de un alumno por su DNI.
 * Requiere token de staff.
 */
export const obtenerAlumnoPorDni = async (dni) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No hay token de autenticación.');

        const response = await axios.get(`${API_URL}/${dni}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el detalle del alumno ${dni}:`, error);
        return null; // Devuelve null para que el componente pueda manejar el error.
    }
};

/**
 * Obtiene los horarios de un alumno por su DNI.
 * Requiere token de staff.
 */
export const obtenerHorariosPorDni = async (dni) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No hay token de autenticación.');

        const response = await axios.get(`${API_URL}/${dni}/horarios`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener los horarios del alumno ${dni}:`, error);
        return []; // Devuelve un array vacío en caso de error.
    }
};

