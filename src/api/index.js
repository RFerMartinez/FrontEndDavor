// src/api/index.js
import axios from 'axios';
import { getToken } from './storage/userStorage'; // Importa getToken

// Define la URL base de tu API en un solo lugar
export const API_BASE_URL = 'http://localhost:8000';

// Crea una instancia de Axios preconfigurada
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json', // Puedes ajustar esto si es necesario
    },
});

// Añade un interceptor para incluir el token automáticamente en las cabeceras
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
        // Asegúrate de que config.headers exista
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Para el login (que usa 'application/x-www-form-urlencoded')
        if (config.url === '/auth/login' && config.method === 'post') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Exporta la instancia configurada para usarla en los servicios
export default apiClient;

// También puedes exportar las constantes de storage si quieres centralizar todo
export * from './storage/userStorage';