<template>
  <div class="fila-horario">
    <!-- Celda de horario -->
    <div class="celda-horario">
      <span class="horario-texto">{{ horarioFormateado }}</span>
    </div>
    
    <!-- Celdas de días -->
    <div 
      v-for="dia in dias" 
      :key="dia" 
      class="celda-dia"
    >
      <DiaHora
        :dia="dia"
        :horario="props.horarioObj.horario"
        :cuposDisponibles="obtenerCupos(dia)"
        :seleccionado="estaSeleccionado(dia)"
        :modo-edicion="modoEdicion"
        :disponible="estaDisponible(dia)"
        @seleccionar="onSeleccionar"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DiaHora from './DiaHora.vue'

const props = defineProps({
  horarioObj: Object,
  dias: Array,
  horariosSeleccionados: Array,
  modoEdicion: Boolean
})

const emit = defineEmits(['seleccionar'])

const horarioFormateado = computed(() => {
  const [inicio, fin] = props.horarioObj.horario.split('-')
  return `${inicio} a ${fin}`
})

const obtenerCupos = (dia) => {
  const diaInfo = props.horarioObj.dias_asignados.find(d => d.dia === dia)
  return diaInfo ? diaInfo.capacidadMax - diaInfo.alumnos_inscritos : 0
}

const estaDisponible = (dia) => {
  return obtenerCupos(dia) > 0
}

const estaSeleccionado = (dia) => {
  return props.horariosSeleccionados.some(h => 
    h.dia === dia && h.horario === props.horarioObj.horario
  )
}

const onSeleccionar = (dia, horario, seleccionado) => {
  emit('seleccionar', { dia, horario }, seleccionado);
}
</script>

<style scoped>
.fila-horario {
  display: grid;
  grid-template-columns: 150px repeat(6, 1fr);
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.celda-horario {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 1rem 0.5rem;
  text-align: center;
  font-weight: 600;
  color: #495057;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.horario-texto {
  font-weight: 500;
}

.celda-dia {
  height: 80px;
}

/* Responsive mejorado */
@media (max-width: 768px) {
  .fila-horario {
    grid-template-columns: 120px repeat(6, 1fr);
    gap: 0.3rem;
    margin-bottom: 0.3rem;
  }
  
  .celda-horario {
    height: 70px;
    padding: 0.5rem 0.3rem;
    font-size: 0.8rem;
  }
  
  .celda-dia {
    height: 70px;
  }
}

/* Para pantallas muy pequeñas */
@media (max-width: 480px) {
  .fila-horario {
    grid-template-columns: 100px repeat(6, 1fr);
    gap: 0.2rem;
  }
  
  .celda-horario {
    height: 60px;
    padding: 0.3rem 0.2rem;
    font-size: 0.75rem;
  }
  
  .celda-dia {
    height: 60px;
  }
}

/* Mejora para tablets */
@media (min-width: 769px) and (max-width: 1024px) {
  .fila-horario {
    grid-template-columns: 140px repeat(6, 1fr);
  }
  
  .celda-horario {
    font-size: 0.85rem;
  }
}
</style>