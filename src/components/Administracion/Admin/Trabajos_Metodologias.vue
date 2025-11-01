<template>
  <div class="contenedor-trabajos">
    <div class="encabezado-trabajos">
      <Titulo texto="TRABAJOS Y METODOLOGÍAS" />
      <p class="subtitulo">Gestiona los tipos de entrenamiento disponibles para los alumnos</p>
    </div>

    <transition name="fade-scale" @after-leave="mostrarFormularioDespuesDeBoton">
      <div v-if="!mostrarFormulario && !transicionEnProgreso" class="contenedor-boton-agregar">
        <button class="btn-agregar-global" @click="iniciarTransicionAFormulario">
          <i class="fas fa-plus"></i>
          Agregar Nueva Metodología
        </button>
      </div>
    </transition>

    <transition name="slide-down" @after-leave="transicionEnProgreso = false">
      <AgregarModificar v-if="mostrarFormulario" v-model="nuevoTrabajo" :es-edicion="trabajoEditando !== null"
        :config="configFormulario" @guardar="guardarTrabajo" @cancelar="iniciarTransicionABoton" />
    </transition>

    <Items :items="trabajos" :config="configLista" empty-message="No hay metodologías cargadas"
      empty-icon="fas fa-dumbbell" @editar="editarTrabajo" @eliminar="eliminarTrabajo" />

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
  </div>
</template>

<script setup>
// --- SCRIPT (SIN CAMBIOS) ---
import { ref, onMounted } from 'vue';
import AgregarModificar from './AgregarModificar.vue';
import Items from './Items.vue';
import Titulo from '../Titulo.vue';

import {
  obtenerTrabajos as obtenerTrabajosAPI,
  eliminarTrabajo as eliminarTrabajoAPI,
  crearTrabajo as crearTrabajoAPI,
  actualizarTrabajo as actualizarTrabajoAPI
} from '@/api/services/trabajoService';

// Configuración (ahora incluye contexto)
const configFormulario = {
  tituloSingular: 'Metodología',
  layout: 'stacked',
  contexto: 'trabajos', // <-- CONTEXTO
  campo1: { key: 'nombre', label: 'Nombre:', placeholder: 'Ej: Musculación', esTextarea: false, tipoInput: 'text', readonly: false },
  campo2: { key: 'descripcion', label: 'Descripción:', placeholder: 'Describe la metodología...', esTextarea: true, tipoInput: 'text', readonly: false }
};
const configLista = {
  contexto: 'trabajos', // <-- CONTEXTO
  key1: 'nombre',
  showKey2: false,
  key2: 'descripcion',
  styleKey2: 'descripcion'
  // formatoPrecio: false (no se necesita)
};

const trabajos = ref([]);
const mostrarFormulario = ref(false);
const trabajoEditando = ref(null);
const mensajeConfirmacion = ref('');
const transicionEnProgreso = ref(false);


const cargando = ref(true); // Para el estado de carga
const errorCarga = ref(null); // Para manejar errores de la API

const nuevoTrabajo = ref({
  nombre: '',
  descripcion: ''
});

const cargarTrabajos = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    const data = await obtenerTrabajosAPI();
    if (!Array.isArray(data)) {
      throw new Error("La API no devolvió un formato de trabajos válido.");
    }
    // Mapea la API a la UI (nombreTrabajo -> nombre)
    trabajos.value = data.map((item, index) => ({
      id: item.id || item.nombreTrabajo || index + 1, // ID para el v-for de Vue
      nombre: item.nombreTrabajo, // 'nombre' que espera la UI
      descripcion: item.descripcion || ''
    }));
    console.log('Trabajos cargados desde la API:', trabajos.value);
  } catch (error) {
    console.error('Error cargando trabajos desde la API:', error);
    errorCarga.value = "No se pudieron cargar las metodologías.";
  } finally {
    cargando.value = false;
  }
};

const scrollArribaInmediato = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const iniciarTransicionAFormulario = () => {
  nuevoTrabajo.value = { nombre: '', descripcion: '' };
  trabajoEditando.value = null;
  transicionEnProgreso.value = true;
  scrollArribaInmediato();
};

const mostrarFormularioDespuesDeBoton = () => {
  mostrarFormulario.value = true;
};

const iniciarTransicionABoton = () => {
  mostrarFormulario.value = false;
  trabajoEditando.value = null;
  nuevoTrabajo.value = { nombre: '', descripcion: '' };
};

const editarTrabajo = (trabajo) => {
  nuevoTrabajo.value = { ...trabajo };
  trabajoEditando.value = trabajo.id;
  if (!mostrarFormulario.value) {
    transicionEnProgreso.value = true;
  }
  mostrarFormulario.value = true;
  scrollArribaInmediato();
};

const guardarTrabajo = async (datosRecibidos) => {
  // 1. Validación (Sin cambios)
  if (!datosRecibidos.nombre) {
    mensajeConfirmacion.value = 'Por favor completa el campo Nombre';
    setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
    return;
  }

  try {
    let mensaje = '';

    // 2. Prepara el body para la API (usando 'nombreTrabajo' como espera la API)
    const datosParaAPI = {
      nombreTrabajo: datosRecibidos.nombre,
      descripcion: datosRecibidos.descripcion
    };

    if (trabajoEditando.value) {
      // --- LÓGICA DE ACTUALIZACIÓN (PUT) ---
      const index = trabajos.value.findIndex(t => t.id === trabajoEditando.value);
      if (index === -1) throw new Error("No se encontró el trabajo original.");

      const nombreOriginal = trabajos.value[index].nombre; // El 'jobName' (nombre actual)

      await actualizarTrabajoAPI(nombreOriginal, datosParaAPI);
      mensaje = 'Metodología actualizada correctamente';

    } else {
      // --- LÓGICA DE CREACIÓN (POST) ---
      // Validación de duplicados (se mantiene)
      if (trabajos.value.some(t => t.nombre.toLowerCase() === datosRecibidos.nombre.toLowerCase())) {
        // ... (tu lógica de error de duplicado) ...
        return;
      }

      await crearTrabajoAPI(datosParaAPI);
      mensaje = 'Metodología creada correctamente';
    }

    // --- Lógica de éxito (común para ambos) ---
    iniciarTransicionABoton(); // Cierra el formulario
    mensajeConfirmacion.value = mensaje; // Muestra el toast
    setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);

    // 3. ¡LA LÍNEA CLAVE! Refresca la lista desde la API.
    await cargarTrabajos();

  } catch (error) {
    console.error("Error al guardar el trabajo:", error);
    const errorMsg = error.response?.data?.detail || 'No se pudo guardar la metodología.';
    alert(`Error: ${errorMsg}`);
  }
};

const eliminarTrabajo = async (id) => {
  // 1. Encontrar el trabajo para obtener su nombre (el ID de la API)
  const trabajoAEliminar = trabajos.value.find(t => t.id === id);

  if (!trabajoAEliminar) {
    alert("Error: No se pudo encontrar el trabajo.");
    return;
  }

  const nombreParaAPI = trabajoAEliminar.nombre;
  alert(`ALERTA: ${nombreParaAPI}`)
  // 2. Confirmar con el usuario
  if (confirm(`¿Estás seguro de que quieres eliminar la metodología "${nombreParaAPI}"?`)) {
    try {
      // 3. Llamar a la API
      await eliminarTrabajoAPI(nombreParaAPI);

      // 4. Mostrar mensaje de éxito
      mensajeConfirmacion.value = 'Metodología eliminada correctamente';
      setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);

      // 5. ¡LA LÍNEA CLAVE! Refresca la lista desde la API.
      await cargarTrabajos();

    } catch (error) {
      // 6. Manejar errores de API
      console.error("Error al eliminar el trabajo:", error);
      const errorMsg = error.response?.data?.detail || 'No se pudo eliminar la metodología.';
      alert(`Error: ${errorMsg}`);
    }
  }
};

onMounted(cargarTrabajos);
</script>

<style scoped>
/* --- ESTILOS LOCALES (Limpiados) --- */

.contenedor-trabajos {
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

.encabezado-trabajos {
  text-align: center;
  margin-bottom: 2rem;
}

.subtitulo {
  color: #666;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* Estilos para .contenedor-boton-agregar, .btn-agregar,
  .mensaje-confirmacion, .contenido-mensaje, .btn-cerrar-mensaje
  AHORA ESTÁN EN EL CSS GLOBAL.
*/

/* Animaciones secuenciales */
.fade-scale-enter-active {
  transition: all 0.2s ease-out;
}

.fade-scale-leave-active {
  transition: all 0.2s ease-in;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.slide-down-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-down-leave-active {
  transition: all 0.25s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-15px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Animación mensaje confirmación */
.slide-in-enter-active {
  transition: all 0.25s ease-out;
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
  .contenedor-trabajos {
    padding: 1.5rem;
  }

  /* .mensaje-confirmacion (global) ya es responsive */
}

@media (max-width: 480px) {
  .contenedor-trabajos {
    padding: 1rem;
  }

  /* .btn-agregar (global) ya es responsive */
}
</style>