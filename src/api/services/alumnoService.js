// src/api/services/alumnoService.js
import apiClient from '../index'; // Importa la instancia de Axios configurada

/**
 * Reemplaza (PUT) la lista completa de horarios de un alumno activo.
 * Requiere token de staff (gestionado por el interceptor).
 * @param {string} dni - El DNI del alumno a modificar.
 * @param {Array} horarios - El nuevo array de horarios. Ej: [{ dia: "Lunes", nroGrupo: "1" }]
 */

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

export const actualizarHorariosAlumno = async (dni, horarios) => {
    try {
        // 1. Prepara el 'body' tal como lo especificaste: { "horarios": [...] }
        const payload = {
        horarios: horarios || [] // Asegura que sea un array, aunque esté vacío
        };

        // 2. Llama al endpoint PUT con la ruta relativa y el payload
        const response = await apiClient.put(`/alumnos/${dni}/horarios`, payload);
        
        // 3. Devuelve la respuesta (probablemente los horarios actualizados o un mensaje de éxito)
        return response.data;

    } catch (error) {
        // 4. Maneja el error
        console.error(`Error al actualizar los horarios del alumno ${dni}:`, error.response?.data || error.message);
        // Vuelve a lanzar el error para que el componente que llama (InfoAlumno.vue)
        // sepa que la actualización falló y pueda mostrar un mensaje al usuario.
        throw error;
    }
};

export const actualizarPerfilAlumno = async (dni, datosModificados) => {
    try {
        const payload = datosModificados || {};

        const response = await apiClient.put(`/alumnos/${dni}`, payload);

        return response.data;
    } catch (error) {
        console.error(`Error al actualizar el perfil del Alumno ${dni}:`, error.response?.data || error.message);
        throw error;
    }
}

export const obtenerDataCurrentUser = async () => {
    try {
        const response = await apiClient.get('/alumnos/mi-perfil');
        return response.data;
    } catch (error) {
        console.error("Error obteniendo datos del alumno:", error.response?.data || error.message);
        return null;
    }
}

export const obtenerHorarioCurrentUser = async () => {
    try {
        const response = await apiClient.get('/alumnos/mi-horario');
        return response.data;
    } catch (error) {
        console.error("Error obteniendo los horarios del alumno:", error.response?.data || error.message);
        return null;
    }
}