
export function formatDateTimeNative(isoString) {
    if (!isoString) return { fecha: 'N/A', hora: 'N/A' };
    
    const date = new Date(isoString);

    // Opciones para formatear en español de Argentina
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };

    const fecha = date.toLocaleDateString('es-AR', optionsDate);
    const hora = `${date.toLocaleTimeString('es-AR', optionsTime)} hs`;

    return { fecha, hora };
}

/**
 * Formatea los strings de fecha y hora que vienen de la API de reclamos.
 * @param {string} fechaStr - La fecha en formato "YYYY-MM-DD".
 * @param {string} horaStr - La hora en formato "HH:MM:SS.micros".
 * @returns {{fecha: string, hora: string}}
 */
export function formatReclamoDateTime(fechaStr, horaStr) {
    // Si no vienen los datos, devuelve un valor por defecto.
    if (!fechaStr || !horaStr) {
        return { fecha: 'N/A', hora: 'N/A' };
    }
    
    // 1. Unimos la fecha y la hora en un formato que JavaScript entiende.
    //    Tomamos solo la parte HH:MM:SS de la hora.
    const dateTimeString = `${fechaStr}T${horaStr.substring(0, 8)}`;
    const date = new Date(dateTimeString);

    // Verificación por si la fecha creada es inválida.
    if (isNaN(date)) {
        return { fecha: 'Fecha inválida', hora: '' };
    }

    // 2. Opciones para formatear la fecha como dd/mm/aa
    const optionsDate = { day: '2-digit', month: '2-digit', year: '2-digit' };
    const fechaFormateada = date.toLocaleDateString('es-AR', optionsDate); // -> 21/07/24

    // 3. Opciones para formatear la hora como HH:mm hs
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    const horaFormateada = `${date.toLocaleTimeString('es-AR', optionsTime)} hs`; // -> 13:08 hs

    return { 
        fecha: fechaFormateada, 
        hora: horaFormateada 
    };
}