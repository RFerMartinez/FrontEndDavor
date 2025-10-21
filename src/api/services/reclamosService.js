// src/api/services/reclamosService.js
import axios from 'axios';
import { getToken } from '../storage/userStorage';

// URL base de tu API. Ajusta si es diferente.
const API_URL = 'http://localhost:8000/reclamos';

/**
 * Obtiene todos los reclamos del usuario autenticado.
 * El token se envía para que el backend sepa de quién son los reclamos.
 */
export const obtenerReclamos = async () => {
    try {
        const token = getToken();
        if (!token) throw new Error('No hay token de autenticación.');

        const response = await axios.get(`${API_URL}/mis-reclamos`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        
        // Asumimos que la API devuelve los reclamos en `response.data`
        return response.data;
    } catch (error) {
        console.error("Error al obtener los reclamos:", error);
        // Devuelve un array vacío en caso de error para no romper la UI
        return [];
    }
};

/**
 * Crea un nuevo reclamo para el usuario autenticado.
 * @param {string} descripcion - El texto del reclamo.
 */
export const crearReclamo = async (descripcion) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No hay token de autenticación.');

        const reclamoData = { comentario: descripcion };

        const response = await axios.post(`${API_URL}/`, reclamoData, {
        headers: { Authorization: `Bearer ${token}` },
        });

        // Devuelve el nuevo reclamo creado que la API retorna
        return response.data;
    } catch (error) {
        console.error("Error al crear el reclamo:", error);
        throw error; // Lanza el error para que el componente lo maneje
    }
};