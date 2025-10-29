// src/api/services/horarioService.js
import api from '../index'; // Importa la instancia centralizada de Axios

/**
 * Obtiene la lista completa de horarios con sus días asignados,
 * capacidad, empleados y alumnos inscritos.
 * Requiere token de staff/admin (según tu API).
 */
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

// --- Futuras funciones ---
// Aquí podrías añadir más funciones si necesitas interactuar
// con otros endpoints de horarios, como:
// - obtenerHorariosPorDia(dia) -> GET /horarios/dia/{dia}
// - crearHorario(data) -> POST /horarios/
// - asignarDiaAGrupo(data) -> POST /horarios/asignar-dia
// etc.
// -------------------------