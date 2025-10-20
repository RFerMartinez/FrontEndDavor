<template>
  <div class="contenedor-ingreso-persona">
    <div class="encabezado-info">
      <button class="btn-volver" @click="volverPersonas">
        <i class="fas fa-arrow-left"></i>
        Volver a Personas
      </button>
      <h1 class="titulo">INGRESO DE NUEVO ALUMNO</h1>
    </div>

    <div class="tarjeta-persona" v-if="persona">
      <div class="tarjeta-header">
        <div class="info-principal">
          <h2 class="nombre-completo">{{ persona.nombre }} {{ persona.apellido }}</h2>
          <p class="dni-persona">DNI: {{ persona.dni }}</p>
        </div>
      </div>

      <div class="tarjeta-contenido">
        <div class="seccion-tabla">
          <h3 class="titulo-seccion">
            <i class="fas fa-user"></i>
            Información Personal
          </h3>
          <div class="tabla-datos">
            <div class="fila-tabla">
              <div class="celda etiqueta">Nombre:</div>
              <div class="celda valor">{{ persona.nombre }}</div>
              <div class="celda etiqueta">Apellido:</div>
              <div class="celda valor">{{ persona.apellido }}</div>
            </div>
            <div class="fila-tabla">
              <div class="celda etiqueta">DNI:</div>
              <div class="celda valor">{{ persona.dni }}</div>
              <div class="celda etiqueta">Email:</div>
              <div class="celda valor">{{ persona.email || 'No especificado' }}</div>
            </div>
            <div class="fila-tabla">
              <div class="celda etiqueta">Teléfono:</div>
              <div class="celda valor">{{ persona.telefono || 'No especificado' }}</div>
              <div class="celda etiqueta"></div>
              <div class="celda valor"></div>
            </div>
          </div>
        </div>

        <div class="separador-seccion"></div>

        <div class="seccion-tabla">
          <h3 class="titulo-seccion">
            <i class="fas fa-map-marker-alt"></i>
            Dirección
          </h3>
          <div class="tabla-datos">
            <div class="fila-tabla">
              <div class="celda etiqueta">Provincia:</div>
              <div class="celda valor">{{ persona.provincia || 'No especificada' }}</div>
              <div class="celda etiqueta">Localidad:</div>
              <div class="celda valor">{{ persona.localidad || 'No especificada' }}</div>
            </div>
            <div class="fila-tabla">
              <div class="celda etiqueta">Calle:</div>
              <div class="celda valor">{{ persona.Calle || 'No especificada' }}</div>
              <div class="celda etiqueta">Número:</div>
              <div class="celda valor">{{ persona.nro || 'S/N' }}</div>
            </div>
          </div>
        </div>

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
             <i class="fas fa-exclamation-triangle"></i> Por favor, completa la suscripción, el trabajo y los horarios (si aplica).
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
import { ref, computed, defineProps, defineEmits } from 'vue';
// *** IMPORTS ***
// *** ¡ASEGÚRATE DE QUE ESTAS RUTAS SEAN CORRECTAS! ***
import ListadoSuscripciones from './ListadoSuscripciones.vue';
import ListadoTrabajos from './ListadoTrabajos.vue';
import TablaHorarios from '../TablaHorarios.vue';

const props = defineProps({
  persona: Object
});
const emit = defineEmits(['volverPersonas', 'ingresoConfirmado']);

// *** Refs para los datos de ingreso (inicializados con '') ***
const nuevaSuscripcion = ref(''); // Cambiado de null a ''
const nuevoTrabajo = ref('');     // Cambiado de null a ''
const nuevosHorarios = ref([]);
const mostrarMensajeValidacion = ref(false);

// Computada para validar el formulario de ingreso
const formularioIngresoValido = computed(() => {
  // Ahora chequeamos que no sean strings vacíos
  const tieneSuscripcion = !!nuevaSuscripcion.value;
  const tieneTrabajo = !!nuevoTrabajo.value;
  let tieneHorariosValidos = true;

  if (tieneSuscripcion && nuevaSuscripcion.value !== 'Día Libre') {
    tieneHorariosValidos = nuevosHorarios.value && nuevosHorarios.value.length > 0;
  }

  return tieneSuscripcion && tieneTrabajo && tieneHorariosValidos;
});

const volverPersonas = () => {
  emit('volverPersonas');
};

// Función para recibir horarios actualizados
const actualizarHorarios = (horarios) => {
  nuevosHorarios.value = horarios || [];
  if (formularioIngresoValido.value) {
      mostrarMensajeValidacion.value = false;
  }
};

const confirmarIngreso = () => {
  if (!formularioIngresoValido.value) {
    console.error("Formulario de ingreso inválido. Datos actuales:", {
      suscripcion: nuevaSuscripcion.value,
      trabajo: nuevoTrabajo.value,
      horarios: nuevosHorarios.value
    });
    mostrarMensajeValidacion.value = true;
    return;
  }
  mostrarMensajeValidacion.value = false;

  // Asegurarnos de que no pasamos props reactivas directamente
  const personaData = props.persona ? { ...props.persona } : {};

  const datosCompletosIngreso = {
    ...personaData,
    suscripcion: nuevaSuscripcion.value,
    trabajoactual: nuevoTrabajo.value,
    horarios: nuevosHorarios.value || [],
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
        } else {
          console.warn("No se pudo parsear hora:", primerHorario);
        }
      } catch (e) {
        console.error("Error procesando horario:", primerHorario, e);
      }
    }
  }

  console.log("Confirmando ingreso con datos completos:", datosCompletosIngreso);
  emit('ingresoConfirmado', datosCompletosIngreso);
};
</script>

<style scoped>
/* Estilos generales */
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

/* Encabezado */
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
.btn-volver:hover {
  background: #e91e63;
  color: white;
  transform: translateY(-1px);
}
.titulo {
  font-size: 2rem;
  color: #e91e63;
  text-align: right;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  margin: 0;
  min-width: 200px;
}

/* Tarjeta Persona */
.tarjeta-persona {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.tarjeta-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
}
.nombre-completo {
  font-size: 1.6rem;
  color: #2c3e50;
  margin: 0 0 0.3rem 0;
  font-weight: 600;
}
.dni-persona {
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
  font-weight: 500;
}
.tarjeta-contenido {
  padding: 2rem;
}

/* Secciones y Tablas */
.seccion-tabla { margin-bottom: 2rem; }
.titulo-seccion { display: flex; align-items: center; gap: 0.8rem; font-size: 1.3rem; color: #2c3e50; margin-bottom: 1.5rem; font-weight: 600; border-bottom: 2px solid #e91e63; padding-bottom: 0.5rem; }
.titulo-seccion i { color: #e91e63; }
.tabla-datos { border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background: white; }
.fila-tabla { display: flex; border-bottom: 1px solid #f0f0f0; background: white; }
.fila-tabla:last-child { border-bottom: none; }
.celda { padding: 1rem 1.2rem; display: flex; align-items: center; }
.etiqueta { font-weight: 600; color: #495057; background-color: #f8f9fa; border-right: 1px solid #e0e0e0; min-width: 150px; width: 150px; font-size: 0.95rem; justify-content: flex-start; }
.valor { font-weight: 500; color: #2c3e50; background-color: white; font-size: 1rem; flex: 1; justify-content: flex-start; padding-left: 1.5rem; border-left: 1px solid #f0f0f0; word-break: break-word; }
.fila-tabla .celda:nth-child(2) { border-right: 1px solid #e0e0e0; }
.fila-tabla .celda:nth-child(3) { border-right: none; }
.separador-seccion { height: 1px; background: linear-gradient(to right, transparent, #e0e0e0, transparent); margin: 2rem 0; }

/* Sección de Ingreso */
.seccion-ingreso {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}
.seccion-formulario {
  margin-bottom: 2.5rem;
}
.titulo-seccion-formulario {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e91e63;
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.titulo-seccion-formulario i {
    color: #e91e63;
}
/* Deshabilitar Horarios */
.seccion-horarios.deshabilitado {
  opacity: 0.5;
  pointer-events: none;
}
.info-horarios {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f8f9fa;
  padding: 0.8rem 1rem;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}
.info-horarios i {
    color: #17a2b8;
}
.contenedor-tabla-horarios {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
}

/* Botones y Mensaje Validación */
.seccion-botones { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e0e0e0; }
.botones-accion { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.btn-accion { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.9rem 1.2rem; border: none; border-radius: 8px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.3s ease; }
.btn-cancelar-ingreso { background: #f44336; color: white; }
.btn-cancelar-ingreso:hover { background: #D32F2F; transform: translateY(-2px); }
.btn-confirmar-ingreso { background: #4CAF50; color: white; }
.btn-confirmar-ingreso:hover:not(:disabled) { background: #388E3C; transform: translateY(-2px); }
.btn-confirmar-ingreso:disabled { background: #cccccc; cursor: not-allowed; transform: none; }
.mensaje-validacion {
    color: #d32f2f;
    font-size: 0.9rem;
    margin-top: 1rem;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.3rem;
}

/* Sin Persona */
.sin-persona { text-align: center; padding: 4rem 2rem; color: #6c757d; }
.sin-persona i { margin-bottom: 1.5rem; color: #e9ecef; }
.sin-persona h3 { margin-bottom: 1rem; color: #495057; font-size: 1.5rem; }
.sin-persona p { margin-bottom: 2rem; font-size: 1rem; }
.btn-volver-centrado { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1.5rem; border: 2px solid #e91e63; background: white; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; font-family: 'Poppins', sans-serif; font-weight: 500; color: #e91e63; text-decoration: none; }
.btn-volver-centrado:hover { background: #e91e63; color: white; transform: translateY(-1px); }

/* Responsive */
@media (max-width: 768px) {
  .contenedor-ingreso-persona { padding: 1.5rem; }
  .encabezado-info {
      flex-direction: column;
      text-align: center;
      align-items: stretch;
  }
  .btn-volver {
      justify-content: center;
      margin-bottom: 1rem;
  }
  .titulo {
      font-size: 1.6rem;
      width: 100%;
      text-align: center; /* Centrado en móvil */
  }
  .tarjeta-header { padding: 1.5rem; flex-direction: column; gap: 0.5rem; text-align: center; }
  .nombre-completo { font-size: 1.5rem; }
  .tarjeta-contenido { padding: 1.5rem; }
  .fila-tabla { flex-direction: column; border-bottom: 1px solid #e0e0e0; }
  .celda { padding: 0.8rem 1rem; width: 100% !important; min-width: auto !important; border-right: none !important; border-bottom: 1px solid #f0f0f0; justify-content: space-between; }
  .celda:last-child { border-bottom: none; }
  .etiqueta { background-color: #f8f9fa; font-weight: 600; border-right: none; }
  .valor { border-left: none; padding-left: 1rem; justify-content: flex-end; text-align: right; }
  .separador-seccion { margin: 1.5rem 0; }
  .botones-accion { grid-template-columns: 1fr; }
  .btn-accion { padding: 0.8rem 1rem; font-size: 0.9rem; }
  .mensaje-validacion { justify-content: center; text-align: center; } /* Centrar mensaje en móvil */
}
@media (max-width: 480px) {
  .contenedor-ingreso-persona { padding: 1rem; }
  .tarjeta-header { padding: 1rem; }
  .nombre-completo { font-size: 1.3rem; }
  .tarjeta-contenido { padding: 1rem; }
  .celda { padding: 0.7rem; font-size: 0.9rem; }
  .valor { font-size: 0.95rem; }
  .separador-seccion { margin: 1rem 0; }
}
</style>