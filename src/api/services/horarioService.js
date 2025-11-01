
import api from '../index';

export const obtenerHorariosCompletos = async () => {
    try {
        // Llama al endpoint GET /horarios/ de tu API
        const response = await api.get('/horarios/');
        
        // Devuelve el array con los datos de los horarios
        return response.data;
    } catch (error) {
        console.error("Error al obtener los horarios completos:", error.response?.data || error.message);
        // Devuelve un array vacío en caso de error para que la UI no falle
        return []; 
    }
};

/**
 * Elimina un grupo de horario por su nroGrupo.
 * @param {string|number} nroGrupo - El número del grupo a eliminar.
 * @returns {boolean} - Devuelve true si la eliminación fue exitosa (status 204).
 * @throws {Error} - Lanza un error si la API falla (ej: 404, 400).
 */
export const eliminarHorarioGrupo = async (nroGrupo) => {
    try {
        // Llama al endpoint DELETE /horarios/{nroGrupo}
        const response = await api.delete(`/horarios/${nroGrupo}`);
        
        // Si la API devuelve 204 (No Content), significa que se eliminó con éxito.
        // Devolvemos true para que el componente sepa que la operación funcionó.
        return response.status === 204;

    } catch (error) {
        // Capturamos y mostramos el error
        console.error(`Error al eliminar el grupo ${nroGrupo}:`, error.response?.data || error.message);
        
        // Lanzamos el error para que el componente (quien llamó a esta función)
        // pueda manejarlo y mostrar un mensaje al usuario (ej: "404: Grupo no encontrado").
        throw error; 
    }
};