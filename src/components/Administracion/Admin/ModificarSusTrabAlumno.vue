<template>
  <div class="contenedor-modificar-sustrab">
    <div class="tarjeta-modificacion">
      <div class="header-modificacion">
        <h2 class="titulo-modificacion">
          <i class="fas fa-sync-alt"></i>
          Modificar Suscripción, Trabajo y Nivel
          </h2>
        <p class="subtitulo-modificacion">Editando información de {{ alumno.nombre }} {{ alumno.apellido }}</p> </div>

      <div class="contenido-modificacion">
        <div class="formulario-modificacion">
          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">Suscripción</h3>
            <ListadoSuscripciones v-model="datosModificados.suscripcion" />
          </div>

          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">Trabajo Actual</h3>
            <ListadoTrabajos v-model="datosModificados.trabajoactual" />
          </div>

          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">Nivel</h3>
            <ListadoNiveles v-model="datosModificados.nivel" />
          </div>
          <div class="seccion-formulario" v-show="debeMostrarHorarios">
            <h3 class="titulo-seccion-formulario">Horarios</h3>
            <p v-if="suscripcionCambiada" class="advertencia-horarios">
              <i class="fas fa-exclamation-triangle"></i>
              La suscripción ha cambiado. Debes actualizar los horarios del alumno.
            </p>
            <div class="contenedor-tabla-horarios" @click.stop>
              <TablaHorarios
                :horarios-alumno="horariosModificados"
                :suscripcion="datosModificados.suscripcion"
                :modo-embebido="true"
                @horarios-actualizados="actualizarHorarios"
              />
            </div>
          </div>

          <div class="botones-formulario">
            <button type="button" class="btn-cancelar" @click="cancelar">
              <i class="fas fa-times"></i>
              Cancelar Operación
            </button>
            <button type="button" class="btn-guardar" @click="confirmarGuardar" :disabled="!formularioValido">
              <i class="fas fa-save"></i>
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarConfirmacion" class="modal-overlay">
      <div class="modal-confirmacion">
         <div class="modal-header"> <i class="fas fa-exclamation-triangle"></i> <h3>Confirmar Cambios</h3> </div>
         <div class="modal-body"> <p>¿Estás seguro que deseas actualizar la suscripción, trabajo y nivel del alumno?</p> </div>
         <div class="modal-footer"> <button class="btn-modal btn-cancelar-modal" @click="cancelarGuardar"> No, Cancelar </button> <button class="btn-modal btn-confirmar-modal" @click="guardarCambios"> Sí, Guardar Cambios </button> </div>
      </div>
    </div>
    <div v-if="mostrarExito" class="modal-overlay">
      <div class="modal-exito">
         <div class="modal-header"> <i class="fas fa-check-circle"></i> <h3>¡Éxito!</h3> </div>
         <div class="modal-body"> <p>Suscripción, trabajo y nivel actualizados correctamente</p> </div>
         <div class="modal-footer"> <button class="btn-modal btn-aceptar-modal" @click="cerrarExito"> Aceptar </button> </div>
      </div>
    </div>
    <div v-if="mostrarSinCambios" class="modal-overlay">
      <div class="modal-sin-cambios">
         <div class="modal-header"> <i class="fas fa-info-circle"></i> <h3>Sin Cambios</h3> </div>
         <div class="modal-body"> <p>No modificó ningún campo. ¿Qué desea hacer?</p> </div>
         <div class="modal-footer"> <button class="btn-modal btn-volver-modal" @click="volverAEditar"> Volver a Editar </button> <button class="btn-modal btn-cancelar-modal" @click="cancelarSinCambios"> Cancelar y Volver </button> </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import TablaHorarios from '../TablaHorarios.vue';
import ListadoSuscripciones from './ListadoSuscripciones.vue';
import ListadoTrabajos from './ListadoTrabajos.vue';
import ListadoNiveles from './ListadoNiveles.vue';

const props = defineProps({
  alumno: Object,
  horarioAlumno: Array
});

const emit = defineEmits(['guardar-cambios', 'cancelar']);

// Estado local
const datosModificados = ref({
  suscripcion: '',
  trabajoactual: '',
  nivel: ''
});
const horariosModificados = ref([]); // Horarios que se enviarán al guardar
const suscripcionOriginal = ref('');
const trabajoOriginal = ref('');
const nivelOriginal = ref('');
const mostrarConfirmacion = ref(false);
const mostrarExito = ref(false);
const mostrarSinCambios = ref(false);

// Bandera para saber si los horarios se confirmaron DESPUÉS de cambiar la suscripción
const horariosConfirmadosDespuesDeCambio = ref(true); // Empieza como true (válido)


const suscripcionCambiada = computed(() => {
  return datosModificados.value.suscripcion !== suscripcionOriginal.value;
});

// Computed para decidir si mostrar TablaHorarios
const debeMostrarHorarios = computed(() => {
  // Mostrar si cambió la suscripción Y la nueva NO es Día Libre
  return suscripcionCambiada.value && datosModificados.value.suscripcion !== 'Día Libre';
});

// --- VALIDACIÓN FORMULARIO PADRE REVISADA ---
const formularioValido = computed(() => {
  const baseValido = datosModificados.value.suscripcion &&
                     datosModificados.value.trabajoactual &&
                     datosModificados.value.nivel;

  if (!baseValido) return false;

  // Si la nueva suscripción es Día Libre, no requiere horarios.
  if (datosModificados.value.suscripcion === 'Día Libre') {
    return true;
  }

  // Si la suscripción CAMBIÓ (y no es Día Libre)...
  if (suscripcionCambiada.value) {
    // ...requiere que los horarios hayan sido confirmados DESPUÉS del cambio.
    return horariosConfirmadosDespuesDeCambio.value;
  }

  // Si la suscripción NO cambió, el formulario base es suficiente
  // (asumimos que los horarios originales ya eran válidos).
  return true;
});
// --- FIN VALIDACIÓN ---


const hayCambios = () => {
  // Comparamos también si los horarios modificados son diferentes a los originales
  // Usamos JSON.stringify para comparar arrays de objetos (simple pero efectivo aquí)
  // Ordenamos para que el orden no afecte la comparación
  const sortFn = (a, b) => a.dia.localeCompare(b.dia) || a.horario.localeCompare(b.horario);
  const horariosModificadosSorted = JSON.stringify([...horariosModificados.value].sort(sortFn));
  const horariosOriginalesSorted = JSON.stringify([...props.horarioAlumno].sort(sortFn));

  return datosModificados.value.suscripcion !== suscripcionOriginal.value ||
         datosModificados.value.trabajoactual !== trabajoOriginal.value ||
         datosModificados.value.nivel !== nivelOriginal.value ||
         // Considera cambio si los horarios son diferentes solo si la suscripción NO cambió
         // Si la suscripción SÍ cambió, el cambio principal es la suscripción, y los horarios deben revalidarse.
         (!suscripcionCambiada.value && horariosModificadosSorted !== horariosOriginalesSorted);
};


const normalizarNombreTrabajo = (nombre) => { /* ... sin cambios ... */
  if (!nombre) return nombre;
  const mapeoNombres = {
    'Musculacion': 'Musculación', 'Musculación': 'Musculación', 'Funcional': 'Funcional',
    'Mantenimiento': 'Mantenimiento', 'Rehabilitacion': 'Rehabilitación',
    'Rehabilitación': 'Rehabilitación', 'Aerobico': 'Aeróbico', 'Aeróbico': 'Aeróbico',
    'Preparación física para deportes': 'Preparación física para deportes'
  };
  return mapeoNombres[nombre] || nombre;
};


onMounted(() => {
  if (props.alumno) {
      const trabajoNormalizado = normalizarNombreTrabajo(props.alumno.trabajoactual);
      datosModificados.value.suscripcion = props.alumno.suscripcion;
      datosModificados.value.trabajoactual = trabajoNormalizado;
      datosModificados.value.nivel = props.alumno.nivel || '';
      suscripcionOriginal.value = props.alumno.suscripcion;
      trabajoOriginal.value = trabajoNormalizado;
      nivelOriginal.value = props.alumno.nivel || '';
  }
  if (props.horarioAlumno) {
      // Inicializar horariosModificados con los originales
      horariosModificados.value = JSON.parse(JSON.stringify(props.horarioAlumno));
  }
  // Estado inicial es válido
  horariosConfirmadosDespuesDeCambio.value = true;
});

// --- WATCH MODIFICADO: AHORA RESETEA LOS HORARIOS ---
watch(() => datosModificados.value.suscripcion, (nuevaSuscripcion, viejaSuscripcion) => {
  // Si cambia respecto al original Y no es la carga inicial
  if (viejaSuscripcion !== undefined && nuevaSuscripcion !== suscripcionOriginal.value) {
    console.log('Suscripción cambiada -> Reseteando horarios y requiriendo confirmación.');
    horariosConfirmadosDespuesDeCambio.value = false;
    // VACIAR los horarios para forzar nueva selección en TablaHorarios
    horariosModificados.value = [];
  } else if (nuevaSuscripcion === suscripcionOriginal.value && viejaSuscripcion !== undefined) {
      // Si vuelve a la original, también requiere confirmar (podría haber tocado horarios antes)
      // y reseteamos a los horarios originales de la prop para empezar desde ahí.
      console.log('Suscripción volvió a la original -> Reseteando a horarios originales y requiriendo confirmación.')
      horariosConfirmadosDespuesDeCambio.value = false;
      horariosModificados.value = JSON.parse(JSON.stringify(props.horarioAlumno)); // Volver a los originales
  }
});
// --- FIN WATCH ---


const actualizarHorarios = (nuevosHorarios) => {
  console.log('Horarios actualizados y confirmados desde TablaHorarios:', nuevosHorarios);
  horariosModificados.value = JSON.parse(JSON.stringify(nuevosHorarios));
  // Marcar como confirmados porque se presionó "Guardar" en TablaHorarios
  // Esto habilitará el botón "Guardar Cambios" del padre si el resto es válido
  horariosConfirmadosDespuesDeCambio.value = true;
};


// --- CONFIRMAR GUARDAR REVISADO ---
const confirmarGuardar = () => {
  // 1. ¿Hubo cambios?
  if (!hayCambios()) {
    mostrarSinCambios.value = true;
    return;
  }
  // 2. ¿El formulario es válido AHORA?
  if (!formularioValido.value) {
    // Dar mensaje específico si el problema son los horarios no confirmados
    if (suscripcionCambiada.value && !horariosConfirmadosDespuesDeCambio.value && datosModificados.value.suscripcion !== 'Día Libre') {
         alert('La suscripción cambió. Debes seleccionar y guardar los nuevos horarios usando el botón "Guardar Cambios" dentro de la tabla de horarios.');
    } else if (!datosModificados.value.suscripcion || !datosModificados.value.trabajoactual || !datosModificados.value.nivel) {
         alert('Por favor, completa los campos de Suscripción, Trabajo Actual y Nivel.');
    } else {
         // Otro caso (poco probable si la lógica es correcta)
         alert('El formulario no es válido. Revisa los campos requeridos.');
    }
    return; // Detener si no es válido
  }
  // 3. Si hubo cambios y es válido -> Mostrar confirmación
  mostrarConfirmacion.value = true;
};
// --- FIN CONFIRMAR GUARDAR ---

const guardarCambios = () => { /* ... sin cambios ... */
  mostrarConfirmacion.value = false;
  try {
    const horariosAEnviar = datosModificados.value.suscripcion === 'Día Libre' ? [] : horariosModificados.value;
    const datosEnviar = {
      alumno: {
        suscripcion: datosModificados.value.suscripcion,
        trabajoactual: datosModificados.value.trabajoactual,
        nivel: datosModificados.value.nivel
      },
      horarios: horariosAEnviar
    };
    console.log('Guardando cambios:', datosEnviar);
    emit('guardar-cambios', datosEnviar);
    mostrarExito.value = true;
  } catch (error) {
    console.error('Error al guardar cambios:', error);
    alert('Error al guardar los cambios. Por favor, intenta nuevamente.');
  }
};

// Funciones modales (sin cambios)
const cancelarGuardar = () => { mostrarConfirmacion.value = false; };
const cerrarExito = () => { mostrarExito.value = false; };
const volverAEditar = () => { mostrarSinCambios.value = false; };
const cancelarSinCambios = () => { mostrarSinCambios.value = false; emit('cancelar'); };
const cancelar = () => { emit('cancelar'); };

</script>

<style scoped>
/* Estilos generales del componente (sin cambios) */
.contenedor-modificar-sustrab {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
}
.tarjeta-modificacion {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.header-modificacion {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  padding: 2rem;
  color: white;
}
.titulo-modificacion {
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.subtitulo-modificacion {
  margin: 0;
  opacity: 0.9;
}
.contenido-modificacion {
  padding: 2rem;
}
.seccion-formulario {
  margin-bottom: 2.5rem;
}
.titulo-seccion-formulario {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #FF9800;
  padding-bottom: 0.5rem;
}

/* *** ESTILOS MOVIDOS A LOS HIJOS: *** */
/* .opciones-grid, .opcion-trabajo, .opcion-suscripcion, .opcion-contenido, */
/* .opcion-titulo, .opcion-precio, .opcion-check, .seleccionada */

/* Estilos de Horarios, Botones y Modales (sin cambios) */
.advertencia-horarios {
  background: #FFF3E0;
  border: 1px solid #FF9800;
  border-radius: 8px;
  padding: 1rem;
  color: #E65100;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.contenedor-tabla-horarios {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
}
.seccion-formulario {
  transition: all 0.3s ease-in-out;
}
.seccion-formulario:last-of-type {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.botones-formulario {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}
.btn-cancelar, .btn-guardar { display: flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1.5rem; border: none; border-radius: 8px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; }
.btn-cancelar { background: #f44336; color: white; }
.btn-cancelar:hover { background: #d32f2f; transform: translateY(-1px); }
.btn-guardar { background: #4caf50; color: white; }
.btn-guardar:hover:not(:disabled) { background: #388e3c; transform: translateY(-1px); }
.btn-guardar:disabled { background: #cccccc; cursor: not-allowed; transform: none; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-confirmacion, .modal-exito, .modal-sin-cambios { background: white; border-radius: 15px; padding: 2rem; max-width: 400px; width: 90%; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); animation: modalAppear 0.3s ease; }
.modal-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.modal-header i { font-size: 2rem; }
.modal-confirmacion .modal-header i { color: #ff9800; }
.modal-exito .modal-header i { color: #4caf50; }
.modal-sin-cambios .modal-header i { color: #2196F3; }
.modal-header h3 { margin: 0; color: #2c3e50; }
.modal-body { margin-bottom: 2rem; }
.modal-body p { margin: 0; font-size: 1.1rem; color: #495057; }
.modal-footer { display: flex; gap: 1rem; justify-content: flex-end; }
.btn-modal { padding: 0.8rem 1.5rem; border: none; border-radius: 8px; font-family: 'Poppins', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.btn-cancelar-modal { background: #f44336; color: white; }
.btn-cancelar-modal:hover { background: #d32f2f; }
.btn-confirmar-modal { background: #4caf50; color: white; }
.btn-confirmar-modal:hover { background: #388e3c; }
.btn-aceptar-modal { background: #2196F3; color: white; }
.btn-aceptar-modal:hover { background: #1976D2; }
.btn-volver-modal { background: #2196F3; color: white; }
.btn-volver-modal:hover { background: #1976D2; }
@keyframes modalAppear { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
@media (max-width: 768px) { .contenedor-modificar-sustrab { padding: 1rem; } .opciones-grid { grid-template-columns: 1fr; } .botones-formulario { flex-direction: column; } .modal-footer { flex-direction: column; } .modal-confirmacion, .modal-exito, .modal-sin-cambios { padding: 1.5rem; margin: 1rem; } }
</style>  