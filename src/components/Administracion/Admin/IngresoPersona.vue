<template>
  <div class="contenedor-ingreso-persona">
    <div class="encabezado-info">
      <button class="btn-volver" @click="volverPersonas">
        <i class="fas fa-arrow-left"></i>
        Volver a Personas
      </button>
      <h1 class="titulo">INGRESO DE NUEVO ALUMNO</h1>
    </div>

    <div class="tarjeta-persona" v-if="persona.dni">
      <div class="tarjeta-header">
        <div class="info-principal">
          <h2 class="nombre-completo">{{ persona.nombre }} {{ persona.apellido }}</h2>
          <p class="dni-persona">DNI: {{ persona.dni }}</p>
        </div>
      </div>

      <div class="tarjeta-contenido">
        <DetallePersona :datos="persona" />
        <div class="separador-seccion"></div>

        <div class="seccion-ingreso">
          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">
              <i class="fas fa-tags"></i>
              Seleccionar Suscripción
            </h3>
            <ListadoSuscripciones v-model="nuevaSuscripcion" />
          </div>

          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">
              <i class="fas fa-dumbbell"></i>
              Seleccionar Trabajo/Metodología
            </h3>
            <ListadoTrabajos v-model="nuevoTrabajo" />
          </div>

          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">
              <i class="fas fa-layer-group"></i> Seleccionar Nivel
            </h3>
            <ListadoNiveles v-model="nuevoNivel" />
          </div>
          <div
            class="seccion-formulario seccion-horarios"
            :class="{ 'deshabilitado': !nuevaSuscripcion || nuevaSuscripcion === 'Día Libre' }"
          >
            <h3 class="titulo-seccion-formulario">
              <i class="far fa-calendar-alt"></i>
              Asignar Horarios
            </h3>
            <p v-if="!nuevaSuscripcion" class="info-horarios">
              <i class="fas fa-info-circle"></i>
              Selecciona una suscripción para habilitar los horarios.
            </p>
            <p v-else-if="nuevaSuscripcion === 'Día Libre'" class="info-horarios">
              <i class="fas fa-info-circle"></i>
              La suscripción "Día Libre" no requiere horarios fijos.
            </p>
            <div class="contenedor-tabla-horarios">
              <TablaHorarios
                :horarios-alumno="[]"
                :suscripcion="nuevaSuscripcion"
                :modo-embebido="true"
                @horarios-actualizados="actualizarHorarios"
              />
            </div>
          </div>
        </div>

        <div class="seccion-botones">
          <div class="botones-accion">
            <button class="btn-accion btn-cancelar-ingreso" @click="volverPersonas">
              <i class="fas fa-times"></i>
              Cancelar Ingreso
            </button>
            <button
              class="btn-accion btn-confirmar-ingreso"
              @click="confirmarIngreso"
              :disabled="!formularioIngresoValido"
            >
              <i class="fas fa-check"></i>
              Confirmar Ingreso
            </button>
          </div>
          <p v-if="mostrarMensajeValidacion" class="mensaje-validacion">
             <i class="fas fa-exclamation-triangle"></i> Por favor, completa Suscripción, Trabajo, Nivel y Horarios (si aplica).
          </p>
          </div>
      </div>
    </div>

    <div v-else class="sin-persona">
       <i class="fas fa-exclamation-triangle fa-3x"></i>
       <h3>No se encontró información de la persona</h3>
       <p>Por favor, vuelve a la lista de personas</p>
       <button class="btn-volver-centrado" @click="volverPersonas">
          <i class="fas fa-arrow-left"></i>
          Volver a Personas
       </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, watch } from 'vue'; // <--- Añadido watch
import ListadoSuscripciones from './ListadoSuscripciones.vue';
import ListadoTrabajos from './ListadoTrabajos.vue';
import ListadoNiveles from './ListadoNiveles.vue';
import TablaHorarios from '../TablaHorarios.vue';
import DetallePersona from './DetallePersona.vue';

const props = defineProps({
  personaSeleccionada: Object
});

const persona = ref({
  dni: "11223344",
  nombre: "Laura",
  apellido: "Martinez",
  email: "laura@email.com",
  sexo: "F",
  telefono: "333-444",
  provincia: "Chaco",
  localidad: "Resistencia",
  Calle: "Av Italia",
  nro: "100"
}); // Inicializar vacío o con estructura base

const emit = defineEmits(['volverPersonas', 'ingresoConfirmado']);

// Refs para los datos NUEVOS de ingreso
const nuevaSuscripcion = ref('');
const nuevoTrabajo = ref('');
const nuevoNivel = ref('');
const nuevosHorarios = ref([]);
const mostrarMensajeValidacion = ref(false);

onMounted(() => {
  if (props.personaSeleccionada) {
    // Copia los datos, asegurándose de que todos los campos base existan
    persona.value = { ...persona.value, ...props.personaSeleccionada };
    console.log("Datos de personaSeleccionada copiados a ref local:", persona.value);
  } else {
    console.warn("IngresoPersona: No se recibieron datos en personaSeleccionada.");
  }
});

// --- VALIDACIÓN (sin cambios) ---
const formularioIngresoValido = computed(() => {
  const tieneSuscripcion = !!nuevaSuscripcion.value;
  const tieneTrabajo = !!nuevoTrabajo.value;
  const tieneNivel = !!nuevoNivel.value;
  let tieneHorariosValidos = true;

  if (tieneSuscripcion && nuevaSuscripcion.value !== 'Día Libre') {
    // La validación ahora depende de que nuevosHorarios tenga elementos *después*
    // de que se selecciona la suscripción (gracias al watch que limpia)
    tieneHorariosValidos = nuevosHorarios.value && nuevosHorarios.value.length > 0;
  }
  return tieneSuscripcion && tieneTrabajo && tieneNivel && tieneHorariosValidos;
});
// --- FIN VALIDACIÓN ---

// --- NUEVO WATCH PARA RESETEAR HORARIOS ---
watch(nuevaSuscripcion, (newValue, oldValue) => {
  // Si la suscripción cambia (y no es la carga inicial donde oldValue es undefined)
  // y la nueva suscripción NO es 'Día Libre' (para la cual no necesitamos horarios)
  if (oldValue !== undefined && newValue !== oldValue) {
    console.log(`Suscripción cambiada de "${oldValue}" a "${newValue}". Reseteando horarios seleccionados.`);
    nuevosHorarios.value = []; // Limpiar horarios previos
    mostrarMensajeValidacion.value = false; // Ocultar mensaje de validación previo
    // El usuario deberá volver a seleccionar horarios en TablaHorarios
  } else if (newValue === 'Día Libre') {
      // Si cambia a Día Libre, también limpiamos y ocultamos mensaje
      nuevosHorarios.value = [];
      mostrarMensajeValidacion.value = false;
  }
});
// --- FIN NUEVO WATCH ---


const volverPersonas = () => { emit('volverPersonas'); };

const actualizarHorarios = (horarios) => {
  nuevosHorarios.value = horarios || [];
  console.log("IngresoPersona: Horarios actualizados desde TablaHorarios:", nuevosHorarios.value);
  // Ocultar mensaje de validación si el formulario ahora es válido
  // (esto se recalcula automáticamente por la computed 'formularioIngresoValido')
  if (formularioIngresoValido.value) {
    mostrarMensajeValidacion.value = false;
  }
};

const confirmarIngreso = () => {
  if (!formularioIngresoValido.value) {
    console.error("Formulario de ingreso inválido. Datos actuales:", {
      suscripcion: nuevaSuscripcion.value,
      trabajo: nuevoTrabajo.value,
      nivel: nuevoNivel.value,
      horarios: nuevosHorarios.value
    });
    // Asegurarse de que el mensaje se muestre si falla la validación al hacer clic
    mostrarMensajeValidacion.value = true;
    return;
  }
  mostrarMensajeValidacion.value = false;

  const datosCompletosIngreso = {
    ...persona.value,
    suscripcion: nuevaSuscripcion.value,
    trabajoactual: nuevoTrabajo.value,
    nivel: nuevoNivel.value,
    // Asegurar que si es Día Libre, los horarios van vacíos
    horarios: nuevaSuscripcion.value === 'Día Libre' ? [] : (nuevosHorarios.value || []),
    activo: true,
    cuotasPendientes: 0,
    turno: '',
  };

  // Determinar turno
  if (datosCompletosIngreso.horarios && datosCompletosIngreso.horarios.length > 0) {
      const primerHorario = datosCompletosIngreso.horarios[0]?.horario;
      if (primerHorario && typeof primerHorario === 'string') {
          try {
              const horaInicioStr = primerHorario.split(':')[0];
              const horaInicio = parseInt(horaInicioStr);
              if (!isNaN(horaInicio)) {
                  datosCompletosIngreso.turno = horaInicio < 14 ? 'Mañana' : 'Tarde';
              } else { console.warn("No se pudo parsear hora:", primerHorario); }
          } catch (e) { console.error("Error procesando horario:", primerHorario, e); }
      }
  }

  console.log("Confirmando ingreso con datos completos:", datosCompletosIngreso);
  emit('ingresoConfirmado', datosCompletosIngreso);
};
</script>

<style scoped>
/* ESTILOS ORIGINALES COMPLETOS */
.contenedor-ingreso-persona {
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

.encabezado-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.btn-volver {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  border: 2px solid #e91e63;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #e91e63;
  text-decoration: none;
  flex-shrink: 0;
}
.btn-volver:hover { background: #e91e63; color: white; transform: translateY(-1px); }
.titulo { font-size: 2rem; color: #e91e63; text-align: right; font-family: 'Poppins', sans-serif; font-weight: 600; margin: 0; min-width: 200px; }

.tarjeta-persona { background: white; border-radius: 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden; }
.tarjeta-header { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #dee2e6; }
.nombre-completo { font-size: 1.6rem; color: #2c3e50; margin: 0 0 0.3rem 0; font-weight: 600; }
.dni-persona { font-size: 1rem; color: #6c757d; margin: 0; font-weight: 500; }
.tarjeta-contenido { padding: 2rem; }

/* IMPORTANTE: Los estilos para .seccion-tabla, .titulo-seccion, etc. */
/* ahora deberían estar definidos DENTRO de DetallePersona.vue */
.separador-seccion { height: 1px; background: linear-gradient(to right, transparent, #e0e0e0, transparent); margin: 2rem 0; }

.seccion-ingreso { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e0e0e0; }
.seccion-formulario { margin-bottom: 2.5rem; }
.titulo-seccion-formulario { font-size: 1.3rem; color: #2c3e50; margin-bottom: 1.5rem; border-bottom: 2px solid #e91e63; padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.8rem; }
.titulo-seccion-formulario i { color: #e91e63; }
.seccion-horarios.deshabilitado { opacity: 0.5; pointer-events: none; }
.info-horarios { font-size: 0.9rem; color: #6c757d; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; background-color: #f8f9fa; padding: 0.8rem 1rem; border-radius: 6px; border: 1px solid #e9ecef; }
.info-horarios i { color: #17a2b8; }
.contenedor-tabla-horarios { border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; background: #fafafa; }

.seccion-botones { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e0e0e0; }
.botones-accion { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.btn-accion { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.9rem 1.2rem; border: none; border-radius: 8px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.3s ease; }
.btn-cancelar-ingreso { background: #f44336; color: white; }
.btn-cancelar-ingreso:hover { background: #D32F2F; transform: translateY(-2px); }
.btn-confirmar-ingreso { background: #4CAF50; color: white; }
.btn-confirmar-ingreso:hover:not(:disabled) { background: #388E3C; transform: translateY(-2px); }
.btn-confirmar-ingreso:disabled { background: #cccccc; cursor: not-allowed; transform: none; }
.mensaje-validacion { color: #d32f2f; font-size: 0.9rem; margin-top: 1rem; text-align: right; display: flex; align-items: center; justify-content: flex-end; gap: 0.3rem; }

.sin-persona { text-align: center; padding: 4rem 2rem; color: #6c757d; }
.sin-persona i { margin-bottom: 1.5rem; color: #e9ecef; }
.sin-persona h3 { margin-bottom: 1rem; color: #495057; font-size: 1.5rem; }
.sin-persona p { margin-bottom: 2rem; font-size: 1rem; }
.btn-volver-centrado { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1.5rem; border: 2px solid #e91e63; background: white; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; font-family: 'Poppins', sans-serif; font-weight: 500; color: #e91e63; text-decoration: none; }
.btn-volver-centrado:hover { background: #e91e63; color: white; transform: translateY(-1px); }

@media (max-width: 768px) {
  .contenedor-ingreso-persona { padding: 1.5rem; }
  .encabezado-info { flex-direction: column; text-align: center; align-items: stretch; }
  .btn-volver { justify-content: center; margin-bottom: 1rem; }
  .titulo { font-size: 1.6rem; width: 100%; text-align: center; }
  .tarjeta-header { padding: 1.5rem; flex-direction: column; gap: 0.5rem; text-align: center; }
  .nombre-completo { font-size: 1.5rem; }
  .tarjeta-contenido { padding: 1.5rem; }
  /* Los estilos responsive para tablas ahora están en DetallePersona */
  .separador-seccion { margin: 1.5rem 0; }
  .botones-accion { grid-template-columns: 1fr; }
  .btn-accion { padding: 0.8rem 1rem; font-size: 0.9rem; }
  .mensaje-validacion { justify-content: center; text-align: center; }
}
@media (max-width: 480px) {
  .contenedor-ingreso-persona { padding: 1rem; }
  .tarjeta-header { padding: 1rem; }
  .nombre-completo { font-size: 1.3rem; }
  .tarjeta-contenido { padding: 1rem; }
  /* Los estilos responsive para tablas ahora están en DetallePersona */
  .separador-seccion { margin: 1rem 0; }
}
</style>