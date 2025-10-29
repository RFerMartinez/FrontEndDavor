import api from '../index'; // Importa tu instancia de Axios configurada

/**
 * Llama al backend para crear una preferencia de pago en MercadoPago.
 * @param {number} cuotaId - El ID de la cuota a pagar.
 * @returns {Promise<object>} - La respuesta del backend, que incluye el preference_id.
 */
export const crearPreferenciaDePago = (cuotaId) => {
  // Asegúrate de que el token de autenticación se envía si el endpoint está protegido
  const token = localStorage.getItem('token'); // O donde lo tengas
    
    return api.post(`/pagos/crear-preferencia/${cuotaId}`, {}, {
        headers: {
        Authorization: `Bearer ${token}`
        }
    });
};