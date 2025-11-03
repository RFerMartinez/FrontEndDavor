// src/api/services/authService.js
import apiClient from '../index'; // Importa la instancia de Axios configurada
import { saveUser, removeUser, getUser as getUserFromStorage } from '../storage/userStorage'; // Renombra getUser para evitar conflicto

// Ya no necesitas API_URL aquí

/**
 * Inicia sesión en la API.
 * @param {string} username - El nombre de usuario.
 * @param {string} password - La contraseña.
 */
export const login = async (username, password) => {
    removeUser();
    try {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        // Usa apiClient. Es importante que el interceptor maneje el Content-Type correcto para esta ruta
        const response = await apiClient.post('/auth/login', params); // El interceptor ajustará el Content-Type

        const { access_token } = response.data;

        // Pedimos los datos del usuario con el token obtenido
        // Creamos una solicitud directa con el token porque el interceptor aún no lo tendrá
        const userResponse = await apiClient.get('/auth/me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        // Guardamos todo en el storage
        saveUser(access_token, userResponse.data);

        return userResponse.data;
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        throw error;
    }
};

/**
 * Cierra la sesión del usuario.
 */
export const logout = () => {
    removeUser();
};

/**
 * Obtiene los datos del usuario actual (si existen en storage).
 * Esta función ahora solo lee del storage.
 */
export const getUser = () => {
    return getUserFromStorage();
};

/**
 * Verifica si el usuario actual es administrador.
 */
export const isAdmin = () => {
    const user = getUser();
    return user && user.esAdmin;
};