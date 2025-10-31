<template>
  <div class="fila-grupo-card" :class="{ 'modo-edicion': modoEdicion }">
    
    <Transition name="slide-fade" mode="out-in">

      <div v-if="!modoEdicion" key="vista" class="vista-container">
        <div class="vista-header">
          <div class="vista-header-info">
            <i class="fas fa-layer-group"></i>
            <span class="numero-grupo">Grupo {{ grupo.nroGrupo }}</span>
          </div>
        </div>
        
        <div class="vista-body">
          <div class="info-item info-horario">
            <label>Horario</label> 
            <span>
              <i class="fas fa-clock"></i> 
              {{ formatoHora(grupo.horaInicio) }} - {{ formatoHora(grupo.horaFin) }}
            </span>
          </div>
          <div class="info-item info-dias">
            <label>Días Asignados</label>
            <span>
              <i class="fas fa-calendar-check"></i>
              {{ grupo.dias_asignados.length > 0 ? grupo.dias_asignados.length + ' día(s)' : 'Ninguno' }}
            </span>
          </div>
        </div>

        <div class="vista-footer">
            <div class="botones-fila">
              <button class="btn-fila btn-modificar" @click="activarModoEdicion">
                <i class="fas fa-pen"></i> Modificar
              </button>
              <button class="btn-fila btn-eliminar" @click="emitirEliminarGrupo">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </div>
        </div>
      </div>

      <form v-else key="edicion" class="form-edicion" @submit.prevent="guardarCambios">
        
        <div class="seccion-info-principal">
          <div class="info-item-edit nro-grupo-edit">
            <label :for="'nro-' + grupo.nroGrupo">Nro Grupo</label>
            <input 
              :id="'nro-' + grupo.nroGrupo"
              type="text" 
              v-model="grupoEditable.nroGrupo" 
              class="input-estilizado"
              title="Este dato debe ser único para cada grupo y no se puede saltear."
              aria-label="Número de Grupo, debe ser único y no puede saltearse."
            />
          </div>

          <div class="info-item-edit hora-inicio-edit">
            <label :for="'inicio-' + grupo.nroGrupo">Hora Inicio</label>
            <input 
              type="time" 
              class="input-estilizado time-input"
              step="1800" 
              v-model="horaInicioEdit"
              :id="'inicio-' + grupo.nroGrupo"
            />
          </div>
          <div class="info-item-edit hora-fin-edit">
            <label :for="'fin-' + grupo.nroGrupo">Hora Fin</label>
            <input 
              type="time" 
              class="input-estilizado time-input"
              step="1800" 
              v-model="horaFinEdit"
              :id="'fin-' + grupo.nroGrupo"
            />
          </div>
        </div>

        <div class="seccion-dias">
          <h4><i class="fas fa-calendar-alt"></i> Selección de días y cupos</h4>
          <div class="dias-contenedor">
            <div v-for="dia in diasEditables" :key="dia.nombre" class="dia-item">
              <label 
                class="dia-label" 
                :class="{ 'seleccionado': dia.seleccionado }"
              >
                <input 
                  type="checkbox" 
                  v-model="dia.seleccionado"
                  @change="limpiarCupoSiNoSeleccionado(dia)"
                />
                <span class="nombre-dia">{{ dia.nombre.substring(0, 3) }}</span>
                <i v-if="dia.seleccionado" class="fas fa-check-circle check-icon"></i>
              </label>
              <div class="cupo-input-wrapper">
                <label :for="'cupo-' + dia.nombre" class="cupo-label">Cupos</label>
                <input
                  :id="'cupo-' + dia.nombre"
                  type="number"
                  class="cupo-input"
                  v-model.number="dia.capacidadMax"
                  :disabled="!dia.seleccionado"
                  placeholder="-"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="botones-fila-edit">
          <button type="button" class="btn-fila btn-cancelar" @click="cancelarEdicion">
            Cancelar
          </button>
          <button type="submit" class="btn-fila btn-guardar">
            <i class="fas fa-save"></i> Guardar
          </button>
        </div>

      </form>
    </Transition>

  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  grupo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['guardar-grupo', 'eliminar-grupo'])

const modoEdicion = ref(false)
const grupoEditable = ref(null) 
const diasEditables = ref([]) 
const nroGrupoOriginal = ref(null); 

const horaInicioEdit = ref('00:00')
const horaFinEdit = ref('00:00')

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

// Función para inicializar el formulario de edición
const activarModoEdicion = () => {
  grupoEditable.value = JSON.parse(JSON.stringify(props.grupo))
  nroGrupoOriginal.value = props.grupo.nroGrupo; 

  horaInicioEdit.value = props.grupo.horaInicio.substring(0, 5)
  horaFinEdit.value = props.grupo.horaFin.substring(0, 5)

  const diasNuevos = []
  diasSemana.forEach(nombreDia => {
    const diaExistente = props.grupo.dias_asignados.find(d => d.dia === nombreDia)
    if (diaExistente) {
      diasNuevos.push({
        ...diaExistente,
        nombre: nombreDia, 
        seleccionado: true
      })
    } else {
      diasNuevos.push({
        nombre: nombreDia,
        seleccionado: false,
        capacidadMax: null,
        alumnos_inscritos: 0, 
        empleado: null 
      })
    }
  })
  diasEditables.value = diasNuevos
  modoEdicion.value = true
}

// Lógica para el botón Guardar
const guardarCambios = () => {
  const nuevosDiasAsignados = diasEditables.value
    .filter(dia => dia.seleccionado) 
    .map(dia => {
      return {
        dia: dia.nombre,
        capacidadMax: dia.capacidadMax || 0,
        alumnos_inscritos: dia.alumnos_inscritos, 
        empleado: dia.empleado 
      }
    })

  const grupoActualizado = {
    ...grupoEditable.value,
    horaInicio: horaInicioEdit.value + ':00', 
    horaFin: horaFinEdit.value + ':00',
    dias_asignados: nuevosDiasAsignados,
    originalNroGrupo: nroGrupoOriginal.value 
  }
  
  if (props.grupo._isNew) {
      grupoActualizado._isNew = true;
      delete grupoActualizado.originalNroGrupo; 
  }

  emit('guardar-grupo', grupoActualizado)
  modoEdicion.value = false
}

// Lógica para el botón Cancelar
const cancelarEdicion = () => {
  if (props.grupo._isNew) {
    emit('eliminar-grupo', props.grupo)
  }
  modoEdicion.value = false
}

// Lógica para el botón Eliminar
const emitirEliminarGrupo = () => {
  emit('eliminar-grupo', props.grupo)
}

// Helper para limpiar el cupo si se des-selecciona un día
const limpiarCupoSiNoSeleccionado = (dia) => {
  if (!dia.seleccionado) {
    dia.capacidadMax = null
  }
}

// Helper para mostrar HH:MM
const formatoHora = (horaCompleta) => {
  if (!horaCompleta || typeof horaCompleta !== 'string') return '--:--'
  return horaCompleta.substring(0, 5)
}

// Watcher para activar el modo edición si es un grupo nuevo
watchEffect(() => {
  if (props.grupo._isNew) {
    activarModoEdicion()
  }
})
</script>

<style scoped>
/* --- ESTILO DE FICHA (TARJETA) PROFESIONAL --- */
.fila-grupo-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
  transition: all 0.3s ease-in-out; 
  overflow: hidden; 
  /* Borde inicial sutil */
  border: 1px solid #eee;
}

/* --- EFECTO HOVER (MÁS NOTORIO) --- */
.fila-grupo-card:not(.modo-edicion):hover {
  transform: translateY(-4px); /* Lo levantamos un poco más */
  /* Sombra roja sutil para el efecto "neon" */
  box-shadow: 0 8px 25px rgba(0,0,0,0.1), 0 0 20px rgba(220, 53, 69, 0.2); 
  border-color: #dc3545; /* Borde rojo */
}

.fila-grupo-card.modo-edicion {
  border-color: #dc3545; 
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.15); 
}

/* --- MODO VISTA (Rediseñado con Grid) --- */
/* Contenedor para la animación */
.vista-container {
  display: grid;
  grid-template-columns: 1fr auto; 
  grid-template-areas:
    "header buttons"
    "body   buttons";
  align-items: start;
}

.vista-header {
  grid-area: header;
  padding: 1.5rem 0 0.5rem 1.5rem; 
}
.vista-header-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.vista-header-info i {
  color: #dc3545; 
  font-size: 1.2rem;
}
.vista-header-info .numero-grupo {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

/* --- AJUSTE DE LAYOUT (COLUMNAS JUNTAS) --- */
.vista-body {
  grid-area: body;
  display: grid;
  grid-template-columns: auto auto; 
  justify-content: flex-start; 
  padding: 0.5rem 1.5rem 1.5rem 1.5rem; 
  gap: 2rem; 
}
.info-item {
  display: flex;
  flex-direction: column;
}
.info-item label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #888;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
}
.info-item span {
  font-size: 1rem; 
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.info-item span i {
  color: #555;
  font-size: 0.9rem;
}

/* El footer contiene los botones en desktop */
.vista-footer {
  grid-area: buttons;
  padding: 1.5rem 1.5rem 1.5rem 1rem;
  display: flex;
  align-items: center; 
  height: 100%;
  border-left: 1px solid #f0f0f0;
}
.botones-fila {
  display: flex;
  flex-direction: column; 
  gap: 0.5rem;
  width: 100%;
}


/* --- MODO EDICIÓN --- */
.form-edicion {
  display: flex;
  flex-direction: column;
  gap: 2rem; 
  padding: 1.5rem;
}

/* Sección de Nro Grupo y Horarios */
.seccion-info-principal {
  display: grid;
  grid-template-columns: 1fr auto auto; 
  gap: 1.5rem;
  align-items: flex-end; 
}

.info-item-edit {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.info-item-edit.nro-grupo-edit {
  width: 100%;
}
.info-item-edit.hora-inicio-edit,
.info-item-edit.hora-fin-edit {
  width: auto; 
}


.info-item-edit label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

/* Input y Selects Estilizados */
.input-estilizado {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background: #fdfdfd;
  font-family: 'Poppins', sans-serif;
  transition: border-color 0.2s, box-shadow 0.2s;
  -webkit-appearance: none; 
}

.input-estilizado:focus {
  outline: none;
  border-color: #dc3545; 
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15); 
}
.input-estilizado[type="text"] {
  max-width: 200px; 
}
.input-estilizado:disabled {
  background: #f0f0f0;
  color: #999;
  cursor: not-allowed;
  border-color: #eee;
}

/* Campos de tiempo más estrechos */
.time-input {
  max-width: 150px; 
  min-width: 130px; 
}

/* --- SECCIÓN DÍAS Y CUPOS --- */
.seccion-dias h4 {
  margin: 0 0 1rem 0;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.seccion-dias h4 i {
  color: #dc3545; 
}

.dias-contenedor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(85px, 1fr)); 
  gap: 0.8rem; 
}

.dia-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

/* Botón de día (Checkbox) */
.dia-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem; 
  padding: 0.6rem 0.4rem; 
  border: 2px solid #ccc; 
  border-radius: 8px;
  width: 100%;
  min-height: 60px; /* Alto fijo */
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  position: relative;
  box-sizing: border-box; 
  background-color: #f8f8f8; 
}
.dia-label input[type="checkbox"] {
  display: none; 
}
.dia-label .nombre-dia {
  font-size: 1rem; 
  font-weight: 700; 
  color: #555; 
}

.dia-label:hover {
  background: #f0f0f0;
  border-color: #bbb;
}

.dia-label.seleccionado {
  border-color: #28a745; 
  background: #F0F8F0; 
  color: #1a7a2e; 
}
.dia-label.seleccionado .nombre-dia {
  color: #1a7a2e; 
}
.check-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #28a745; 
  font-size: 0.9rem;
}

/* Wrapper para el Input de Cupo con Label */
.cupo-input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
}

.cupo-label {
  font-size: 0.75rem; 
  font-weight: 600;
  color: #777;
}

/* Input de Cupo - Más estrecho */
.cupo-input {
  width: 100%;
  max-width: 60px; 
  padding: 0.4rem; 
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  box-sizing: border-box; 
  -moz-appearance: textfield; 
}
.cupo-input::-webkit-outer-spin-button,
.cupo-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.cupo-input::placeholder {
  color: #aaa;
}
.cupo-input:disabled {
  background: #f0f0f0;
  color: #ccc;
  cursor: not-allowed;
  border-color: #eee;
}

/* Botones de Edición (Guardar/Cancelar) */
.botones-fila-edit {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
  flex-wrap: wrap; 
}

/* --- Botones Comunes --- */
.btn-fila {
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 20px; 
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap; 
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.btn-fila:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}

.btn-modificar { background: #007bff; color: white; } 
.btn-modificar:hover { background: #0069d9; }

.btn-eliminar { background: #dc3545; color: white; } 
.btn-eliminar:hover { background: #c82333; }

.btn-cancelar { background: #6c757d; color: white; } 
.btn-cancelar:hover { background: #5a6268; }

.btn-guardar { background: #28a745; color: white; } 
.btn-guardar:hover { background: #218838; }

/* Responsive */
@media (max-width: 768px) {
  .vista-body {
    grid-template-columns: 1fr; 
    gap: 1rem;
  }
  .seccion-info-principal {
    grid-template-columns: 1fr 1fr; 
  }
  .info-item-edit.nro-grupo-edit {
    grid-column: 1 / -1; 
  }
  .dias-contenedor {
    grid-template-columns: repeat(auto-fit, minmax(75px, 1fr)); 
  }
  .time-input {
    max-width: 100%; 
  }
}

/* --- CORRECCIÓN MÓVIL (max-width: 480px) --- */
@media (max-width: 480px) {
  /* En móvil, volvemos a un layout de bloque/flujo */
  .vista-container {
    display: block; /* Anula el grid */
  }
  
  .vista-header {
    grid-area: unset; 
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .vista-body {
    grid-area: unset; 
    padding: 1.25rem 1.5rem;
    grid-template-columns: 1fr;
  }

  .vista-footer {
    grid-area: unset; 
    padding: 0 1.5rem 1.5rem 1.5rem;
    border-left: none; 
  }

  .botones-fila {
    flex-direction: column; 
  }
  
  .btn-fila {
    width: 100%;
    justify-content: center;
    padding: 0.8rem;
  }
  
  /* --- Estilos de Edición en Móvil --- */
  .form-edicion {
    padding: 1rem;
  }
  .seccion-info-principal {
    grid-template-columns: 1fr; /* 1 columna */
  }
  .input-estilizado[type="text"] {
    max-width: 100%; 
  }
  .time-input {
    max-width: 100%;
  }
  .dias-contenedor {
    grid-template-columns: repeat(3, 1fr); 
    gap: 0.5rem;
  }
  .dia-label {
    min-height: 55px; 
    padding: 0.6rem 0.3rem;
  }
  .dia-label .nombre-dia {
    font-size: 0.9rem; 
  }
  .botones-fila-edit {
    flex-direction: column;
  }
}

/* --- ESTILOS DE TRANSICIÓN (Animación) --- */
/* Animación de deslizamiento y difuminado */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>