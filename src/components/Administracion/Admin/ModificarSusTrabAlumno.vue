<template>
  <div class="contenedor-modificar-sustrab">
    <div class="tarjeta-modificacion">
      <div class="header-modificacion">
        <h2 class="titulo-modificacion">
          <i class="fas fa-sync-alt"></i>
          Modificar Suscripción y Trabajo
        </h2>
        <p class="subtitulo-modificacion">Editando suscripción de {{ alumno.nombre }} {{ alumno.apellido }}</p>
      </div>

      <div class="contenido-modificacion">
        <div class="formulario-modificacion">
          <!-- Suscripción -->
          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">Suscripción</h3>
            <div class="opciones-grid">
              <div v-for="precio in precios" :key="precio.descripcion" 
                   class="opcion-suscripcion"
                   :class="{ 'seleccionada': datosModificados.suscripcion === precio.descripcion }"
                   @click="seleccionarSuscripcion(precio.descripcion)">
                <div class="opcion-contenido">
                  <h4 class="opcion-titulo">{{ precio.descripcion }}</h4>
                  <p class="opcion-precio">{{ precio.precio }}</p>
                </div>
                <i class="fas fa-check opcion-check" v-if="datosModificados.suscripcion === precio.descripcion"></i>
              </div>
            </div>
          </div>

          <!-- Trabajo Actual -->
          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">Trabajo Actual</h3>
            <div class="opciones-grid">
              <div v-for="metodologia in metodologias" :key="metodologia.nombre" 
                   class="opcion-trabajo"
                   :class="{ 'seleccionada': datosModificados.trabajoactual === metodologia.nombre }"
                   @click="seleccionarTrabajo(metodologia.nombre)">
                <div class="opcion-contenido">
                  <h4 class="opcion-titulo">{{ metodologia.nombre }}</h4>
                </div>
                <i class="fas fa-check opcion-check" v-if="datosModificados.trabajoactual === metodologia.nombre"></i>
              </div>
            </div>
          </div>

          <!-- Horarios (solo si la suscripción cambió) -->
          <div class="seccion-formulario" v-if="suscripcionCambiada" v-show="mostrarHorarios">
            <h3 class="titulo-seccion-formulario">Horarios</h3>
            <p class="advertencia-horarios">
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

          <!-- Botones de acción -->
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

    <!-- Modal de confirmación -->
    <div v-if="mostrarConfirmacion" class="modal-overlay">
      <div class="modal-confirmacion">
        <div class="modal-header">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Confirmar Cambios</h3>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro que deseas actualizar la suscripción y trabajo del alumno?</p>
        </div>
        <div class="modal-footer">
          <button class="btn-modal btn-cancelar-modal" @click="cancelarGuardar">
            No, Cancelar
          </button>
          <button class="btn-modal btn-confirmar-modal" @click="guardarCambios">
            Sí, Guardar Cambios
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de éxito -->
    <div v-if="mostrarExito" class="modal-overlay">
      <div class="modal-exito">
        <div class="modal-header">
          <i class="fas fa-check-circle"></i>
          <h3>¡Éxito!</h3>
        </div>
        <div class="modal-body">
          <p>Suscripción y trabajo actualizados correctamente</p>
        </div>
        <div class="modal-footer">
          <button class="btn-modal btn-aceptar-modal" @click="cerrarExito">
            Aceptar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de sin cambios -->
    <div v-if="mostrarSinCambios" class="modal-overlay">
      <div class="modal-sin-cambios">
        <div class="modal-header">
          <i class="fas fa-info-circle"></i>
          <h3>Sin Cambios</h3>
        </div>
        <div class="modal-body">
          <p>No modificó ningún campo. ¿Qué desea hacer?</p>
        </div>
        <div class="modal-footer">
          <button class="btn-modal btn-volver-modal" @click="volverAEditar">
            Volver a Editar
          </button>
          <button class="btn-modal btn-cancelar-modal" @click="cancelarSinCambios">
            Cancelar y Volver
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import TablaHorarios from '../TablaHorarios.vue'

const props = defineProps({
  alumno: Object,
  horarioAlumno: Array
})

const emit = defineEmits(['guardar-cambios', 'cancelar'])

// Datos de precios y metodologías
const precios = ref([])
const metodologias = ref([])

const datosModificados = ref({
  suscripcion: '',
  trabajoactual: ''
})
const horariosModificados = ref([])
const suscripcionOriginal = ref('')
const trabajoOriginal = ref('')
const mostrarConfirmacion = ref(false)
const mostrarExito = ref(false)
const mostrarSinCambios = ref(false)
const datosCargados = ref(false)
const mostrarHorarios = ref(false)

const suscripcionCambiada = computed(() => {
  return datosModificados.value.suscripcion !== suscripcionOriginal.value
})

const formularioValido = computed(() => {
  // Si la suscripción es "Día Libre", no requiere horarios
  if (datosModificados.value.suscripcion === 'Día Libre') {
    return datosModificados.value.suscripcion && datosModificados.value.trabajoactual
  }
  
  // Para otras suscripciones, si cambió la suscripción, validar que hay horarios
  if (suscripcionCambiada.value) {
    return datosModificados.value.suscripcion && 
           datosModificados.value.trabajoactual && 
           horariosModificados.value.length > 0
  }
  
  // Si no cambió la suscripción, solo validar suscripción y trabajo
  return datosModificados.value.suscripcion && datosModificados.value.trabajoactual
})

const hayCambios = () => {
  return datosModificados.value.suscripcion !== suscripcionOriginal.value ||
         datosModificados.value.trabajoactual !== trabajoOriginal.value
}

// Función para normalizar el nombre del trabajo (para coincidir con los datos del JSON)
const normalizarNombreTrabajo = (nombre) => {
  if (!nombre) return nombre
  
  // Mapeo de nombres del alumno a nombres del JSON
  const mapeoNombres = {
    'Musculacion': 'Musculación',
    'Musculación': 'Musculación',
    'Funcional': 'Funcional',
    'Mantenimiento': 'Mantenimiento',
    'Rehabilitacion': 'Rehabilitación',
    'Rehabilitación': 'Rehabilitación',
    'Aerobico': 'Aeróbico',
    'Aeróbico': 'Aeróbico',
    'Preparación física para deportes': 'Preparación física para deportes'
  }
  
  return mapeoNombres[nombre] || nombre
}

// Cargar datos desde los archivos JSON
const cargarDatos = async () => {
  try {
    // Cargar precios.json
    const preciosData = await import('../../../../public/data/precios.json')
    precios.value = preciosData.default
    
    // Cargar metodologias.json
    const metodologiasData = await import('../../../../public/data/metodologias.json')
    metodologias.value = metodologiasData.default
    
    await nextTick()
    
    // Normalizar el nombre del trabajo actual del alumno
    const trabajoNormalizado = normalizarNombreTrabajo(props.alumno.trabajoactual)
    
    console.log('Datos del alumno:', {
      suscripcionOriginal: props.alumno.suscripcion,
      trabajoOriginal: props.alumno.trabajoactual,
      trabajoNormalizado: trabajoNormalizado
    })
    
    console.log('Metodologías disponibles:', metodologias.value.map(m => m.nombre))
    
    // Verificar si el trabajo normalizado existe en las metodologías
    const trabajoExiste = metodologias.value.some(m => m.nombre === trabajoNormalizado)
    console.log('¿El trabajo existe en metodologías?', trabajoExiste)
    
    // Inicializar con los datos actuales del alumno
    datosModificados.value.suscripcion = props.alumno.suscripcion
    datosModificados.value.trabajoactual = trabajoExiste ? trabajoNormalizado : props.alumno.trabajoactual
    suscripcionOriginal.value = props.alumno.suscripcion
    trabajoOriginal.value = trabajoExiste ? trabajoNormalizado : props.alumno.trabajoactual
    horariosModificados.value = props.horarioAlumno ? [...props.horarioAlumno] : []
    
    datosCargados.value = true
    
    console.log('Datos inicializados FINAL:', {
      suscripcion: datosModificados.value.suscripcion,
      trabajo: datosModificados.value.trabajoactual,
      metodologiasCargadas: metodologias.value.length
    })
    
  } catch (error) {
    console.error('Error cargando datos:', error)
    // Datos de respaldo
    precios.value = [
      { "descripcion": "5 Días a la semana", "precio": "$30.000" },
      { "descripcion": "3 Días a la semana", "precio": "$20.000" },
      { "descripcion": "2 Días a la semana", "precio": "$15.000" },
      { "descripcion": "Día Libre", "precio": "$3.000" }
    ]
    
    metodologias.value = [
      { "nombre": "Musculación" },
      { "nombre": "Funcional" },
      { "nombre": "Mantenimiento" },
      { "nombre": "Rehabilitación" },
      { "nombre": "Aeróbico" },
      { "nombre": "Preparación física para deportes" }
    ]
    
    await nextTick()
    
    // Normalizar el nombre del trabajo actual del alumno
    const trabajoNormalizado = normalizarNombreTrabajo(props.alumno.trabajoactual)
    
    datosModificados.value.suscripcion = props.alumno.suscripcion
    datosModificados.value.trabajoactual = trabajoNormalizado
    suscripcionOriginal.value = props.alumno.suscripcion
    trabajoOriginal.value = trabajoNormalizado
    horariosModificados.value = props.horarioAlumno ? [...props.horarioAlumno] : []
    datosCargados.value = true
  }
}

onMounted(() => {
  cargarDatos()
})

// Watcher para debuggear la preselección
watch(datosCargados, (nuevoValor) => {
  if (nuevoValor) {
    console.log('Preselección verificada:', {
      suscripcionSeleccionada: datosModificados.value.suscripcion,
      trabajoseleccionado: datosModificados.value.trabajoactual,
      coincideSuscripcion: precios.value.some(p => p.descripcion === datosModificados.value.suscripcion),
      coincideTrabajo: metodologias.value.some(m => m.nombre === datosModificados.value.trabajoactual)
    })
  }
})

// Watcher para mostrar/ocultar horarios con animación - CORREGIDO
watch(suscripcionCambiada, (nuevoValor) => {
  if (nuevoValor && datosModificados.value.suscripcion !== 'Día Libre') {
    // Solo mostrar horarios si cambió la suscripción Y no es "Día Libre"
    setTimeout(() => {
      mostrarHorarios.value = true
    }, 100)
  } else {
    // Ocultar horarios si no hay cambio O si es "Día Libre"
    mostrarHorarios.value = false
  }
})

// Watcher adicional para detectar cambios directos a "Día Libre"
watch(() => datosModificados.value.suscripcion, (nuevaSuscripcion, suscripcionAnterior) => {
  // Si la nueva suscripción es "Día Libre", ocultar horarios inmediatamente
  if (nuevaSuscripcion === 'Día Libre') {
    mostrarHorarios.value = false
  }
  // Si cambió desde otra suscripción y no es "Día Libre", mostrar horarios
  else if (nuevaSuscripcion !== suscripcionAnterior && nuevaSuscripcion !== 'Día Libre') {
    setTimeout(() => {
      mostrarHorarios.value = true
    }, 100)
  }
})

const seleccionarSuscripcion = (suscripcion) => {
  datosModificados.value.suscripcion = suscripcion
}

const seleccionarTrabajo = (trabajo) => {
  datosModificados.value.trabajoactual = trabajo
}

const actualizarHorarios = (nuevosHorarios) => {
  console.log('Horarios actualizados desde TablaHorarios:', nuevosHorarios)
  horariosModificados.value = nuevosHorarios
}

const confirmarGuardar = () => {
  if (!hayCambios()) {
    mostrarSinCambios.value = true
    return
  }
  
  if (!formularioValido.value) {
    // Si no es "Día Libre" y no hay horarios configurados
    if (suscripcionCambiada.value && datosModificados.value.suscripcion !== 'Día Libre' && horariosModificados.value.length === 0) {
      alert('Debe configurar los horarios para la nueva suscripción')
    } else {
      alert('Por favor complete todos los campos requeridos')
    }
    return
  }
  
  mostrarConfirmacion.value = true
}

const guardarCambios = () => {
  mostrarConfirmacion.value = false
  
  try {
    // Si la suscripción es "Día Libre", enviar horarios vacíos
    const horariosAEnviar = datosModificados.value.suscripcion === 'Día Libre' ? [] : horariosModificados.value
    
    const datosEnviar = {
      alumno: {
        suscripcion: datosModificados.value.suscripcion,
        trabajoactual: datosModificados.value.trabajoactual
      },
      horarios: horariosAEnviar
    }
    
    console.log('Guardando cambios:', datosEnviar)
    emit('guardar-cambios', datosEnviar)
    mostrarExito.value = true
    
  } catch (error) {
    console.error('Error al guardar cambios:', error)
    alert('Error al guardar los cambios. Por favor, intenta nuevamente.')
  }
}

const cancelarGuardar = () => {
  mostrarConfirmacion.value = false
}

const cerrarExito = () => {
  mostrarExito.value = false
}

const volverAEditar = () => {
  mostrarSinCambios.value = false
}

const cancelarSinCambios = () => {
  mostrarSinCambios.value = false
  emit('cancelar')
}

const cancelar = () => {
  emit('cancelar')
}
</script>

<style scoped>
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

.opciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.opcion-suscripcion, .opcion-trabajo {
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.opcion-suscripcion:hover, .opcion-trabajo:hover {
  border-color: #FF9800;
  transform: translateY(-2px);
}

.opcion-suscripcion.seleccionada, .opcion-trabajo.seleccionada {
  border-color: #FF9800;
  background: #FFF3E0;
  transform: scale(1.02);
}

.opcion-contenido {
  flex: 1;
}

.opcion-titulo {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.opcion-precio {
  font-size: 1.2rem;
  font-weight: 700;
  color: #FF9800;
  margin: 0;
  margin-top: 0.5rem;
}

.opcion-check {
  color: #FF9800;
  font-size: 1.2rem;
  margin-left: 1rem;
}

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

/* Transición suave para la sección de horarios */
.seccion-formulario {
  transition: all 0.3s ease-in-out;
}

.seccion-formulario:last-of-type {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.botones-formulario {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.btn-cancelar, .btn-guardar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancelar {
  background: #f44336;
  color: white;
}

.btn-cancelar:hover {
  background: #d32f2f;
  transform: translateY(-1px);
}

.btn-guardar {
  background: #4caf50;
  color: white;
}

.btn-guardar:hover:not(:disabled) {
  background: #388e3c;
  transform: translateY(-1px);
}

.btn-guardar:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
}

/* Estilos para los modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-confirmacion, .modal-exito, .modal-sin-cambios {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: modalAppear 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.modal-header i {
  font-size: 2rem;
}

.modal-confirmacion .modal-header i {
  color: #ff9800;
}

.modal-exito .modal-header i {
  color: #4caf50;
}

.modal-sin-cambios .modal-header i {
  color: #2196F3;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.modal-body {
  margin-bottom: 2rem;
}

.modal-body p {
  margin: 0;
  font-size: 1.1rem;
  color: #495057;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-modal {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancelar-modal {
  background: #f44336;
  color: white;
}

.btn-cancelar-modal:hover {
  background: #d32f2f;
}

.btn-confirmar-modal {
  background: #4caf50;
  color: white;
}

.btn-confirmar-modal:hover {
  background: #388e3c;
}

.btn-aceptar-modal {
  background: #2196F3;
  color: white;
}

.btn-aceptar-modal:hover {
  background: #1976D2;
}

.btn-volver-modal {
  background: #2196F3;
  color: white;
}

.btn-volver-modal:hover {
  background: #1976D2;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .contenedor-modificar-sustrab {
    padding: 1rem;
  }
  
  .opciones-grid {
    grid-template-columns: 1fr;
  }
  
  .botones-formulario {
    flex-direction: column;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-confirmacion, .modal-exito, .modal-sin-cambios {
    padding: 1.5rem;
    margin: 1rem;
  }
}
</style>