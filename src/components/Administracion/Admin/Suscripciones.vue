<template>
  <div class="contenedor-suscripciones">
    <div class="encabezado-suscripciones">
      <Titulo texto="SUSCRIPCIONES" />
      <p class="subtitulo">Gestiona las suscripciones disponibles para los alumnos</p>
    </div>

    <transition name="fade-scale" @after-leave="mostrarFormularioDespuesDeBotón">
      <div v-if="!mostrarFormulario && !transicionEnProgreso" class="contenedor-boton-agregar">
        <button class="btn-agregar-global" @click="iniciarTransicionAFormulario">
      <i class="fas fa-plus"></i>
          Agregar Nueva Suscripción
        </button>
      </div>
    </transition>

    <transition name="slide-down" @after-leave="transicionEnProgreso = false">
      <AgregarModificar
        v-if="mostrarFormulario"
        v-model="datosFormulario" :es-edicion="suscripcionEditando !== null"
        :config="configFormularioComputada" @guardar="guardarSuscripcion"
        @cancelar="iniciarTransicionABoton"
      />
    </transition>

    <Items
      :items="suscripciones"
      :config="configLista"
      empty-message="No hay suscripciones cargadas"
      empty-icon="fas fa-info-circle"
      @editar="editarSuscripcion"
      @eliminar="eliminarSuscripcion"
    />

    <transition name="slide-in">
      <div v-if="mensajeConfirmacion" class="mensaje-confirmacion-global">
        <div class="contenido-mensaje-global">
      <i class="fas fa-check-circle"></i>
          <span>{{ mensajeConfirmacion }}</span>
          <button class="btn-cerrar-mensaje-global" @click="mensajeConfirmacion = ''">
          <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </transition>

    <div v-if="suscripcionNuevaGuardada" style="margin-top: 2rem; padding: 1rem; border: 1px dashed blue; background: #eef;">
        <strong>Suscripción Nueva Guardada (Temporal):</strong>
        <pre>{{ suscripcionNuevaGuardada }}</pre>
    </div>

  </div>
</template>

<script setup>
// --- SCRIPT (SIN CAMBIOS) ---
import { ref, computed, onMounted } from 'vue';
import AgregarModificar from './AgregarModificar.vue';
import Items from './Items.vue';
import Titulo from '../Titulo.vue';

import {
  obtenerSuscripciones,
  eliminarSuscripcion as eliminarSuscripcionAPI
} from '@/api/services/suscripcionesService';

const configFormBase = {
  tituloSingular: 'Suscripción',
  layout: 'inline',
  contexto: 'suscripciones',
};
const configLista = ref({
  contexto: 'suscripciones',
  key1: 'descripcion',
  showKey2: true,
  key2: 'precio',
  styleKey2: 'precio',
  formatoPrecio: true
});

const suscripciones = ref([]);
const mostrarFormulario = ref(false);
const suscripcionEditando = ref(null);
const mensajeConfirmacion = ref('');
const transicionEnProgreso = ref(false);
const datosFormulario = ref({ descripcion: '', precio: '' });
const suscripcionNuevaGuardada = ref(null);

const cargando = ref(true); // Para saber cuándo mostrar un spinner (si lo deseas)
const errorCarga = ref(null); // Para almacenar un mensaje de error

const configFormularioComputada = computed(() => {
  const esEdicion = suscripcionEditando.value !== null;
  return {
    ...configFormBase,
    campo1: esEdicion
      ? { key: 'descripcion', label: 'Descripción:', placeholder: 'Descripción (No editable)', esTextarea: false, tipoInput: 'text', readonly: true }
      : { key: 'descripcion', label: 'Días por semana:', placeholder: 'Ej: 3', esTextarea: false, tipoInput: 'number', min: '1', readonly: false },
    campo2: { key: 'precio', label: 'Precio (número):', placeholder: 'Ej: 20000', esTextarea: false, tipoInput: 'number', min: '0', readonly: false }
  };
});

const parsePriceString = (priceString) => {
    if (typeof priceString !== 'string') return NaN;
    const cleanedString = priceString.replace(/\./g, '').replace(',', '.');
    const number = parseFloat(cleanedString);
    return isNaN(number) ? NaN : number;
};

// const cargarSuscripciones = async () => {
//   try {
//     const preciosData = await import('../../../../public/data/precios.json');
//     suscripciones.value = preciosData.default.map((item, index) => {
//         const precioNum = parsePriceString(item.precio);
//         if (isNaN(precioNum)) { console.warn(`Precio inválido en JSON para "${item.descripcion}": ${item.precio}`); }
//         return { id: index + 1, descripcion: item.descripcion, precio: isNaN(precioNum) ? 0 : precioNum };
//     });
//     console.log('Suscripciones cargadas (precio como número):', suscripciones.value);
//   } catch (error) {
//     console.error('Error cargando suscripciones:', error);
//     suscripciones.value = [
//         { id: 1, descripcion: '1 Día a la semana', precio: 10000 },
//         { id: 2, descripcion: '2 Días a la semana', precio: 15000 },
//         { id: 3, descripcion: '3 Días a la semana', precio: 20000 },
//         { id: 4, descripcion: 'Día Libre', precio: 3000 }
//      ];
//   }
// };


const cargarSuscripciones = async () => {
  // 1. Establecer estado de carga
  cargando.value = true;
  errorCarga.value = null;
  
  try {
    // 2. Llamar al servicio de la API
    const data = await obtenerSuscripciones();

    // 3. Validar que la respuesta sea un array
    if (!Array.isArray(data)) {
      throw new Error("La respuesta de la API no es un array de suscripciones.");
    }

    // 4. Mapear la respuesta de la API a la estructura interna del componente
    suscripciones.value = data.map((item, index) => {
      
      // Valida que el precio sea un número
      const precioNum = (typeof item.precio === 'number' && !isNaN(item.precio)) 
        ? item.precio 
        : 0;
      
      // Valida que el nombre exista
      const descripcionApi = item.nombreSuscripcion || 'Suscripción sin nombre';

      // Crea el objeto que espera el componente (usando 'descripcion')
      return { 
        // Si la API no provee un ID único, usamos la descripción (si es única) o el índice
        id: item.idSuscripcion || descripcionApi || index + 1, 
        descripcion: descripcionApi, // <-- Aquí está el mapeo clave
        precio: precioNum 
      };
    });

    console.log('Suscripciones cargadas (mapeadas) desde la API:', suscripciones.value);

  } catch (error) {
    // 5. Manejar errores
    console.error('Error cargando suscripciones desde la API:', error);
    errorCarga.value = 'No se pudieron cargar las suscripciones.';
    
  } finally {
    // 6. Finalizar la carga
    cargando.value = false;
  }
};



const iniciarTransicionAFormulario = () => {
  datosFormulario.value = { descripcion: '', precio: '' };
  suscripcionEditando.value = null;
  suscripcionNuevaGuardada.value = null;
  transicionEnProgreso.value = true;
};

const mostrarFormularioDespuesDeBotón = () => { mostrarFormulario.value = true; };

const iniciarTransicionABoton = () => {
  mostrarFormulario.value = false;
  suscripcionEditando.value = null;
  datosFormulario.value = { descripcion: '', precio: '' };
};

const editarSuscripcion = (suscripcion) => {
  datosFormulario.value = {
      descripcion: suscripcion.descripcion,
      precio: suscripcion.precio
  };
  suscripcionEditando.value = suscripcion.id;
  suscripcionNuevaGuardada.value = null;
  if (!mostrarFormulario.value) { transicionEnProgreso.value = true; }
  mostrarFormulario.value = true;
};

const guardarSuscripcion = (datosRecibidos) => {
  const claveCampo1 = configFormularioComputada.value.campo1.key;
  const claveCampo2 = configFormularioComputada.value.campo2.key;
  const valorCampo1 = datosRecibidos[claveCampo1];
  const valorCampo2 = datosRecibidos[claveCampo2];

  if (valorCampo1 === '' || valorCampo1 === null || valorCampo1 === undefined ||
      valorCampo2 === '' || valorCampo2 === null || valorCampo2 === undefined) {
    mensajeConfirmacion.value = 'Por favor completa todos los campos';
    setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
    return;
  }
  const precioNum = parseFloat(valorCampo2);
  if (isNaN(precioNum) || precioNum < 0) {
      mensajeConfirmacion.value = 'El precio debe ser un número válido mayor o igual a 0.';
      setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
      return;
  }

  if (suscripcionEditando.value !== null) {
    const index = suscripciones.value.findIndex(s => s.id === suscripcionEditando.value);
    if (index !== -1) {
      suscripciones.value[index].precio = precioNum;
      console.log("Llamando a API para ACTUALIZAR suscripción:", suscripciones.value[index]);
      mensajeConfirmacion.value = 'Precio de suscripción actualizado';
    }
  } else {
    const diasNum = parseInt(valorCampo1);
     if (isNaN(diasNum) || diasNum <= 0) {
        mensajeConfirmacion.value = 'La cantidad de días debe ser un número entero mayor a 0.';
        setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
        return;
    }
    const descripcionFormateada = `${diasNum} ${diasNum === 1 ? 'Día' : 'Días'} a la semana`;
    if (suscripciones.value.some(s => s.descripcion === descripcionFormateada)) {
        mensajeConfirmacion.value = `La suscripción "${descripcionFormateada}" ya existe.`;
        setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
        return;
    }
    const nuevoId = Math.max(...suscripciones.value.map(s => s.id), 0) + 1;
    const nuevaSub = { id: nuevoId, descripcion: descripcionFormateada, precio: precioNum };
    suscripcionNuevaGuardada.value = { ...nuevaSub };
    suscripciones.value.push(nuevaSub);
    console.log("Llamando a API para CREAR suscripción:", nuevaSub);
    mensajeConfirmacion.value = 'Suscripción creada correctamente';
  }
  iniciarTransicionABoton();
  setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
};

// const eliminarSuscripcion = (id) => {
//   if (confirm('¿Estás seguro de que quieres eliminar esta suscripción?')) {
//       console.log("Llamando a API para ELIMINAR suscripción con ID:", id);
//       suscripciones.value = suscripciones.value.filter(s => s.id !== id);
//       mensajeConfirmacion.value = 'Suscripción eliminada correctamente';
//       setTimeout(() => {
//         mensajeConfirmacion.value = ''
//       }, 3000);
//   }
// };

const eliminarSuscripcion = async (id) => {
  alert(JSON.stringify(id, null, 2));
  // 2a. Encontrar el objeto suscripción usando el ID
  const suscripcionAEliminar = suscripciones.value.find(s => s.id === id);

  if (!suscripcionAEliminar) {
    console.error("No se encontró la suscripción a eliminar con ID:", id);
    alert("Error: No se pudo encontrar la suscripción.");
    return;
  }

  // 2b. Obtener el nombre que espera la API (que es la 'descripcion' en tu UI)
  const nombreParaAPI = suscripcionAEliminar.descripcion;

  if (confirm(`¿Estás seguro de que quieres eliminar la suscripción "${nombreParaAPI}"?`)) {
    
    // (Opcional: puedes activar un estado de carga específico para este ítem)

    try {
      console.log(`Llamando a API para ELIMINAR suscripción: ${nombreParaAPI}`);
      
      // 2c. Llamar a la API con el nombre/descripción
      const exito = await eliminarSuscripcionAPI(nombreParaAPI);

      // 2d. Si la API responde con éxito (true / 204)
      if (exito) {
        // Actualizar la UI (filtrar la lista local)
        // suscripciones.value = suscripciones.value.filter(s => s.id !== id);
        
        // Mostrar mensaje de éxito
        mensajeConfirmacion.value = 'Suscripción eliminada correctamente';
        setTimeout(() => {
          mensajeConfirmacion.value = '';
        }, 3000);
      } else {
        console.warn("La API de eliminar no devolvió un estado de éxito esperado (ej: 204).");
        alert("La suscripción no se pudo eliminar, respuesta inesperada del servidor.");
      }

    } catch (error) {
      // 2e. Manejar errores si la API falla (ej: 404, 500)
      console.error("Error al eliminar la suscripción:", error);
      const errorMsg = error.response?.data?.detail || 'No se pudo eliminar la suscripción.';
      alert(`Error: ${errorMsg}`); // Muestra el error de la API
    } finally {
      // (Opcional: desactivar el estado de carga)
    }
  }
};

onMounted(cargarSuscripciones);
</script>


<style scoped>
/* --- ESTILOS LOCALES (Limpiados) --- */

.contenedor-suscripciones {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
}

.encabezado-suscripciones {
  text-align: center;
  margin-bottom: 2rem;
}

.subtitulo {
  color: #666;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* Los estilos para .contenedor-boton-agregar, .btn-agregar,
  .mensaje-confirmacion, .contenido-mensaje, .btn-cerrar-mensaje
  y sus :hover AHORA ESTÁN EN EL CSS GLOBAL.
*/

/* Animaciones secuenciales */
.fade-scale-enter-active {
  transition: all 0.3s ease-out;
}
.fade-scale-leave-active {
  transition: all 0.3s ease-in;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.slide-down-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Animación mensaje confirmación */
.slide-in-enter-active {
  transition: all 0.3s ease-out;
}
.slide-in-leave-active {
  transition: all 0.2s ease-in;
}
.slide-in-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-in-leave-to {
  transform: translateX(100%);
  opacity: 0;
}


/* Responsive */
@media (max-width: 768px) {
  .contenedor-suscripciones {
    padding: 1.5rem;
  }
  
  /* .mensaje-confirmacion (global) ya es responsive */
}

@media (max-width: 480px) {
  .contenedor-suscripciones {
    padding: 1rem;
  }
  
  /* .btn-agregar (global) ya es responsive */
}
</style>