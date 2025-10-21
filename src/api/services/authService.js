// src/api/services/authService.js
import axios from 'axios';
import { saveUser, removeUser, getUser } from '../storage/userStorage';

// Asegúrate de que esta URL base apunte a tu backend de FastAPI
const API_URL = 'http://localhost:8000/auth';

/**
 * Inicia sesión en la API.
 * @param {string} username - El nombre de usuario.
 * @param {string} password - La contraseña.
 */
export const login = async (username, password) => {
    try {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        // Hacemos la petición al endpoint /auth/login
        const response = await axios.post(`${API_URL}/login`, params);

        const { access_token } = response.data;

        // Ahora, pedimos los datos del usuario con el token obtenido
        const userResponse = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
        });
        
        // Guardamos todo en el storage
        saveUser(access_token, userResponse.data);

        return userResponse.data;
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        // Lanza el error para que el componente de login lo maneje
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
 * Verifica si el usuario actual es administrador.
 */
export const isAdmin = () => {
    const user = getUser();
    return user && user.esAdmin;
};