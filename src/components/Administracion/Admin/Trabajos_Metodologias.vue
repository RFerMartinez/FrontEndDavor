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
      <AgregarModificar
        v-if="mostrarFormulario"
        v-model="nuevoTrabajo"
        :es-edicion="trabajoEditando !== null"
        :config="configFormulario"
        @guardar="guardarTrabajo"
        @cancelar="iniciarTransicionABoton"
      />
    </transition>

    <Items
      :items="trabajos"
      :config="configLista"
      empty-message="No hay metodologías cargadas"
      empty-icon="fas fa-dumbbell"
      @editar="editarTrabajo"
      @eliminar="eliminarTrabajo"
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
  </div>
</template>

<script setup>
// --- SCRIPT (SIN CAMBIOS) ---
import { ref, onMounted } from 'vue';
import AgregarModificar from './AgregarModificar.vue';
import Items from './Items.vue';
import Titulo from '../Titulo.vue';

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

const nuevoTrabajo = ref({
  nombre: '',
  descripcion: ''
});

const cargarTrabajos = async () => {
  try {
    const metodologiasData = await import('../../../../public/data/metodologias.json');
    trabajos.value = metodologiasData.default.map((item, index) => ({
      id: index + 1,
      nombre: item.nombre,
      descripcion: item.descripcion || '' // Asegurar que descripción exista
    }));
    console.log('Trabajos cargados:', trabajos.value);
  } catch (error) {
    console.error('Error cargando trabajos:', error);
    trabajos.value = [
      { id: 1, nombre: "Musculación", descripcion: "Entrenamiento centrado en el desarrollo de la masa muscular y fuerza con cargas progresivas." },
      { id: 2, nombre: "Funcional", descripcion: "Ejercicios que imitan movimientos de la vida diaria, mejorando la movilidad y estabilidad general." }
    ];
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

const guardarTrabajo = (datosRecibidos) => { // Recibe datos de AgregarModificar
  if (!datosRecibidos.nombre) { // Solo validar nombre aquí
    mensajeConfirmacion.value = 'Por favor completa el campo Nombre';
    setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
    return;
  }
  
  if (trabajoEditando.value) {
    const index = trabajos.value.findIndex(t => t.id === trabajoEditando.value);
    if (index !== -1) {
      trabajos.value[index] = { ...datosRecibidos, id: trabajoEditando.value };
      mensajeConfirmacion.value = 'Metodología actualizada correctamente';
    }
  } else {
    // Validar si ya existe
    if (trabajos.value.some(t => t.nombre.toLowerCase() === datosRecibidos.nombre.toLowerCase())) {
        mensajeConfirmacion.value = `La metodología "${datosRecibidos.nombre}" ya existe.`;
        setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
        return;
    }
    const nuevoId = Math.max(...trabajos.value.map(t => t.id), 0) + 1;
    trabajos.value.push({ id: nuevoId, ...datosRecibidos });
    mensajeConfirmacion.value = 'Metodología creada correctamente';
  }
  iniciarTransicionABoton();
  setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
};

const eliminarTrabajo = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta metodología?')) {
    trabajos.value = trabajos.value.filter(t => t.id !== id);
    mensajeConfirmacion.value = 'Metodología eliminada correctamente';
    setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
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