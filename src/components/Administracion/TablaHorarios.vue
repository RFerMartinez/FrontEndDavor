<template>
  <div class="tabla-horarios">
    <!-- Header -->
    <div class="tabla-header">
      <h3 class="titulo">
        <i class="fas fa-calendar-alt"></i>
        {{ modoEdicion ? 'Horarios Disponibles' : 'Horarios Asignados' }}
      </h3>
      <div v-if="!esSuscripcionLibre" class="controles">
        <button 
          class="btn-accion"
          @click="toggleModoEdicion"
          :disabled="modoEdicion && !esSeleccionValida"
        >
          <i class="fas" :class="iconoBoton"></i>
          {{ textoBoton }}
        </button>
        
        <div v-if="modoEdicion" class="contador-seleccion">
          <span class="contador-texto">
            {{ horariosSeleccionados.length }}/{{ limiteDias }} días seleccionados
          </span>
        </div>
      </div>
    </div>

    <!-- Vista Desktop -->
    <div v-if="!isMobile" class="tabla-desktop">
      <!-- Header de días -->
      <div class="fila-header">
        <div class="celda-horario-header">
          <i class="fas fa-clock"></i>
          HORARIO
        </div>
        <div 
          v-for="dia in diasUnicos" 
          :key="dia" 
          class="celda-dia-header"
        >
          <i class="fas fa-calendar-day"></i>
          {{ dia.toUpperCase() }}
        </div>
      </div>

      <!-- Filas de horarios -->
      <div class="contenedor-filas">
        <FilaHorario
          v-for="horarioObj in horariosProcesados"
          :key="horarioObj.nroGrupo"
          :horario-obj="horarioObj"
          :dias="diasUnicos"
          :horarios-seleccionados="horariosSeleccionados"
          :modo-edicion="modoEdicion"
          @seleccionar="manejarSeleccion"
        />
      </div>
    </div>

    <!-- Vista Móvil Mejorada -->
    <div v-else class="tabla-mobile">
      <div class="mobile-contenedor">
        <div class="mobile-instructions" v-if="modoEdicion">
          <i class="fas fa-info-circle"></i>
          <p>Selecciona {{ limiteDias }} días diferentes para completar tu horario</p>
        </div>
        
        <!-- Información de selección general -->
        <div v-if="modoEdicion" class="mobile-selection-info">
          <div class="selection-count">
            <span class="count-number">{{ horariosSeleccionados.length }}</span>
            <span class="count-text">/{{ limiteDias }} días seleccionados</span>
          </div>
        </div>
        
        <div 
          v-for="dia in diasUnicos" 
          :key="dia" 
          class="dia-mobile-card"
          :class="{ 'expandido': diaExpandido === dia }"
        >
          <div class="dia-header-mobile" @click="toggleDiaMobile(dia)">
            <div class="dia-info">
              <i class="fas fa-calendar-day"></i>
              <span class="dia-nombre">{{ dia }}</span>
              <span v-if="modoEdicion" class="dia-cupos">
                • {{ obtenerTotalCuposDia(dia) }} cupos
              </span>
            </div>
            <div class="dia-estado">
              <!-- Mostrar estado diferente según el modo -->
              <span v-if="modoEdicion && obtenerSeleccionadosDia(dia).length > 0" 
                    class="seleccionados-count">
                {{ obtenerSeleccionadosDia(dia).length }} sel.
              </span>
              <span v-else-if="!modoEdicion && obtenerAsignadosDia(dia).length > 0"
                    class="asignados-count">
                {{ obtenerAsignadosDia(dia).length }} Seleccionado.
              </span>
              <i class="fas fa-chevron-down" :class="{ 'rotado': diaExpandido === dia }"></i>
            </div>
          </div>
          
          <transition name="slide">
            <div v-if="diaExpandido === dia" class="horarios-mobile-list">
              <div 
                v-for="horarioObj in horariosProcesados" 
                :key="horarioObj.nroGrupo"
                class="horario-mobile-item"
                :class="getClasesHorarioMobile(dia, horarioObj)"
                @click="manejarSeleccionMobile(dia, horarioObj.horario)"
              >
                <div class="horario-info">
                  <span class="horario-texto">{{ horarioObj.horario.replace('-', ' a ') }}</span>
                  <span class="cupos-mobile">
                    {{ obtenerCuposDia(dia, horarioObj) }} cupos
                  </span>
                </div>
                <div class="estado-mobile">
                  <i :class="getIconoHorarioMobile(dia, horarioObj)"></i>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Mensajes de estado -->
    <div v-if="modoEdicion" class="mensajes-estado">
      <div v-if="!esSeleccionValida" class="mensaje mensaje-info">
        <i class="fas fa-info-circle"></i>
        <div>
          <strong>Selecciona {{ limiteDias }} días diferentes</strong>
          <p>Elige horarios en días distintos para completar tu asignación</p>
        </div>
      </div>
      <div v-else class="mensaje mensaje-success">
        <i class="fas fa-check-circle"></i>
        <div>
          <strong>Selección completa</strong>
          <p>Puedes guardar los cambios en tu horario</p>
        </div>
      </div>
    </div>

    <!-- Leyenda solo en modo edición -->
    <div v-if="modoEdicion" class="leyenda">
      <h4>Leyenda:</h4>
      <div class="leyenda-items">
        <div class="leyenda-item">
          <i class="fas fa-plus-circle disponible"></i>
          <span>Disponible (con cupos)</span>
        </div>
        <div class="leyenda-item">
          <i class="fas fa-check-circle seleccionado"></i>
          <span>Seleccionado</span>
        </div>
        <div class="leyenda-item">
          <i class="fas fa-lock no-disponible"></i>
          <span>Sin cupos disponibles</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import FilaHorario from './FilaHorario.vue';

const props = defineProps({
  horariosAlumno: {
    type: Array,
    default: () => []
  },
  suscripcion: {
    type: String,
    default: ''
  },
  modoEmbebido: {
      type: Boolean,
      default: false
  }
});

const emit = defineEmits(['horarios-actualizados']);

// Datos y estado
const datosGrupos = ref([]);
const isMobile = ref(false);
const modoEdicion = ref(props.modoEmbebido); // Correcto: empieza en edición si está embebido
const horariosSeleccionados = ref([]); // Estado interno para la selección
const diaExpandido = ref(null);

// --- WATCH REVISADO ---
// Este watch asegura que horariosSeleccionados se inicialice la primera vez
// que props.horariosAlumno tenga datos, y también actualiza si las props
// cambian DESDE AFUERA mientras NO estamos editando.
watch(() => props.horariosAlumno, (nuevosHorariosProp) => {
    // Si NO estamos en modo edición O si es la carga inicial y aún no tenemos horarios seleccionados
    if (!modoEdicion.value || (modoEdicion.value && horariosSeleccionados.value.length === 0 && nuevosHorariosProp.length > 0)) {
        console.log("TablaHorarios Watch (props.horariosAlumno): Actualizando/Inicializando horariosSeleccionados.");
        horariosSeleccionados.value = JSON.parse(JSON.stringify(nuevosHorariosProp || []));
    }
}, { deep: true, immediate: true }); // 'immediate' es clave para la carga inicial
// --- FIN WATCH REVISADO ---


const cargarDatos = async () => { /* ... sin cambios ... */
  try {
    const response = await import('../../../public/data/grupos.json');
    datosGrupos.value = response.default;
  } catch (error) {
    console.error('Error cargando grupos:', error);
  }
};

// --- COMPUTED PROPERTIES (sin cambios) ---
const esSuscripcionLibre = computed(() => props.suscripcion.toLowerCase().includes('libre'));
const limiteDias = computed(() => { /* ... sin cambios ... */
    if (esSuscripcionLibre.value) return 0;
    const match = props.suscripcion.match(/\d+/);
    return match ? parseInt(match[0]) : 3;
});
const diasUnicos = computed(() => { /* ... sin cambios ... */
    if (datosGrupos.value.length === 0) return [];
    return datosGrupos.value[0]?.dias_asignados?.map(d => d.dia) || [];
});
const horariosProcesados = computed(() => { /* ... sin cambios ... */
    return datosGrupos.value.map(grupo => ({
        nroGrupo: grupo.nroGrupo,
        horario: `${grupo.horaInicio.slice(0, 5)}-${grupo.horaFin.slice(0, 5)}`,
        dias_asignados: grupo.dias_asignados || []
    }));
});
const textoBoton = computed(() => modoEdicion.value ? 'Guardar Cambios' : 'Modificar Horarios');
const iconoBoton = computed(() => modoEdicion.value ? 'fa-save' : 'fa-edit');
const esSeleccionValida = computed(() => {
    if (!modoEdicion.value) return true; // No aplica validación si no estamos editando
    return horariosSeleccionados.value.length === limiteDias.value;
});

// --- MÉTODOS MOBILE (sin cambios lógicos) ---
const getClasesHorarioMobile = (dia, horarioObj) => { /* ... igual que antes ... */
    const cupos = obtenerCuposDia(dia, horarioObj);
    const estaSeleccionadoActual = horariosSeleccionados.value.some(h => h.dia === dia && h.horario === horarioObj.horario);

    if (!modoEdicion.value) {
        return { 'asignado': estaSeleccionadoActual, 'no-asignado': !estaSeleccionadoActual };
    } else {
        return {
            'seleccionado': estaSeleccionadoActual,
            'disponible': cupos > 0 && !estaSeleccionadoActual,
            'no-disponible': cupos === 0 && !estaSeleccionadoActual
        };
    }
};
const getIconoHorarioMobile = (dia, horarioObj) => { /* ... igual que antes ... */
    const cupos = obtenerCuposDia(dia, horarioObj);
    const estaSeleccionadoActual = horariosSeleccionados.value.some(h => h.dia === dia && h.horario === horarioObj.horario);

    if (!modoEdicion.value) {
        return estaSeleccionadoActual ? 'fas fa-check asignado' : 'fas fa-minus no-asignado';
    } else {
        if (estaSeleccionadoActual) return 'fas fa-check-circle seleccionado';
        if (cupos === 0) return 'fas fa-lock no-disponible';
        return 'fas fa-plus-circle disponible';
    }
};
const obtenerAsignadosDia = (dia) => { return horariosSeleccionados.value.filter(h => h.dia === dia); };
const estaAsignadoOriginal = (dia, horario) => { return props.horariosAlumno.some(h => h.dia === dia && h.horario === horario); };


// --- toggleModoEdicion (sin cambios respecto a la última versión) ---
const toggleModoEdicion = () => {
  if (modoEdicion.value) {
    if (esSeleccionValida.value) {
      console.log("TablaHorarios: Guardando y emitiendo horarios actualizados:", horariosSeleccionados.value);
      emit('horarios-actualizados', JSON.parse(JSON.stringify(horariosSeleccionados.value)));
      // Siempre salimos del modo edición después de guardar exitosamente
      modoEdicion.value = false;
      console.log("TablaHorarios: Cambios guardados, volviendo a modo visualización.");
    } else {
        alert(`Debes seleccionar exactamente ${limiteDias.value} días diferentes.`);
    }
  } else {
    // Entrando en modo edición (solo si no está embebido)
    horariosSeleccionados.value = JSON.parse(JSON.stringify(props.horariosAlumno));
    modoEdicion.value = true;
    console.log("TablaHorarios: Entrando en modo edición, horarios copiados:", horariosSeleccionados.value);
  }
};

// --- MÉTODOS DE SELECCIÓN (sin cambios lógicos) ---
const manejarSeleccion = (horario, seleccionado) => { /* ... igual que antes ... */
    if (!modoEdicion.value) return;
    const dia = horario.dia;
    const horarioStr = horario.horario;
    const yaSeleccionado = estaSeleccionado(dia, horarioStr);

    if (yaSeleccionado) {
        horariosSeleccionados.value = horariosSeleccionados.value.filter(h => !(h.dia === dia && h.horario === horarioStr));
    } else {
        horariosSeleccionados.value = horariosSeleccionados.value.filter(h => h.dia !== dia);
        if (horariosSeleccionados.value.length < limiteDias.value) {
            horariosSeleccionados.value.push({ dia, horario: horarioStr });
        }
    }
};
const manejarSeleccionMobile = (dia, horario) => { /* ... igual que antes ... */
    if (!modoEdicion.value) return;
    const horarioObjCompleto = horariosProcesados.value.find(h => h.horario === horario);
    if (!horarioObjCompleto) return;
    const cupos = obtenerCuposDia(dia, horarioObjCompleto);
    const yaSeleccionado = estaSeleccionado(dia, horario);

    if (cupos === 0 && !yaSeleccionado) return;

    if (yaSeleccionado) {
        horariosSeleccionados.value = horariosSeleccionados.value.filter(h => !(h.dia === dia && h.horario === horario));
    } else {
        horariosSeleccionados.value = horariosSeleccionados.value.filter(h => h.dia !== dia);
        if (horariosSeleccionados.value.length < limiteDias.value) {
            horariosSeleccionados.value.push({ dia, horario });
        }
    }
};
const toggleDiaMobile = (dia) => { diaExpandido.value = diaExpandido.value === dia ? null : dia; };
const obtenerCuposDia = (dia, horarioObj) => { /* ... igual que antes ... */
    if (!horarioObj || !horarioObj.dias_asignados) return 0;
    const diaInfo = horarioObj.dias_asignados.find(d => d.dia === dia);
    return diaInfo ? (diaInfo.capacidadMax || 0) - (diaInfo.alumnos_inscritos || 0) : 0;
};
const obtenerTotalCuposDia = (dia) => { /* ... igual que antes ... */
     return horariosProcesados.value.reduce((total, horario) => {
        const diaInfo = horario.dias_asignados?.find(d => d.dia === dia);
        return total + (diaInfo ? obtenerCuposDia(dia, horario) : 0);
    }, 0);
};
const obtenerSeleccionadosDia = (dia) => { return horariosSeleccionados.value.filter(h => h.dia === dia); };
const estaSeleccionado = (dia, horario) => { /* ... igual que antes ... */
    return horariosSeleccionados.value.some(h => h.dia === dia && h.horario === horario);
};
const checkIsMobile = () => { isMobile.value = window.innerWidth <= 768; };

// --- onMounted (simplificado) ---
onMounted(() => {
  cargarDatos();
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
  // La inicialización ahora la maneja principalmente el watch con immediate: true
  // Podemos dejar una verificación por si acaso, pero el watch debería ser suficiente
  if (horariosSeleccionados.value.length === 0 && props.horariosAlumno.length > 0) {
     console.log("TablaHorarios onMounted: Backup - Inicializando horariosSeleccionados desde props.");
     horariosSeleccionados.value = JSON.parse(JSON.stringify(props.horariosAlumno));
  }
  console.log("TablaHorarios: Montado. Modo Edición inicial:", modoEdicion.value);
});
// --- FIN onMounted ---

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile);
});
</script>

<style scoped>
.tabla-horarios {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.tabla-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.titulo {
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.titulo i {
  color: #e91e63;
}

.controles {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-accion {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.btn-accion:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.btn-accion:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
  box-shadow: none;
}

.contador-seleccion {
  background: #e3f2fd;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.contador-texto {
  font-weight: 600;
}

/* Vista Desktop */
.tabla-desktop {
  width: 100%;
  overflow-x: auto;
}

.fila-header {
  display: grid;
  grid-template-columns: 150px repeat(6, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.celda-horario-header {
  background: linear-gradient(135deg, #e91e63, #d33838);
  color: white;
  padding: 1rem 0.5rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.celda-dia-header {
  background: linear-gradient(135deg, #78909c, #546e7a);
  color: white;
  padding: 1rem 0.5rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.contenedor-filas {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* VISTA MÓVIL MEJORADA */
.tabla-mobile {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-instructions {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
}

.mobile-instructions i {
  color: #1976d2;
  font-size: 1.1rem;
  margin-top: 0.1rem;
}

.mobile-instructions p {
  margin: 0;
  color: #1976d2;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* Información de selección general */
.mobile-selection-info {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.selection-count {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
}

.count-number {
  font-size: 1.5rem;
  color: #e91e63;
}

.count-text {
  font-size: 1rem;
  color: #6c757d;
}

.dia-mobile-card {
  background: white;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.dia-mobile-card.expandido {
  border-color: #e91e63;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.15);
}

.dia-header-mobile {
  padding: 1rem;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-height: 60px;
}

.dia-header-mobile:hover {
  background: #e9ecef;
}

.dia-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
  flex-wrap: wrap;
}

.dia-info i {
  color: #e91e63;
  font-size: 1rem;
}

.dia-nombre {
  font-size: 1rem;
  min-width: 80px;
}

.dia-cupos {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: normal;
}

.dia-estado {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.asignados-count {
  font-size: 0.8rem;
  color: #4caf50;
  font-weight: 500;
  white-space: nowrap;
}

.seleccionados-count {
  font-size: 0.8rem;
  color: #2196f3;
  font-weight: 500;
  white-space: nowrap;
}

.fa-chevron-down {
  transition: transform 0.3s ease;
  color: #6c757d;
  font-size: 0.9rem;
}

.fa-chevron-down.rotado {
  transform: rotate(180deg);
}

.horarios-mobile-list {
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.horario-mobile-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;
}

/* ESTILOS PARA MODO VISUALIZACIÓN (NO EDITABLE) */
.horario-mobile-item.asignado {
  background: #e8f5e9;
  border-color: #4caf50;
  cursor: default;
}

.horario-mobile-item.no-asignado {
  background: #fafafa;
  border-color: #e0e0e0;
  cursor: default;
  opacity: 0.6;
}

/* ESTILOS PARA MODO EDICIÓN (SELECCIONABLE) */
.horario-mobile-item.seleccionado {
  background: #e3f2fd;
  border-color: #2196f3;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
  cursor: pointer;
}

.horario-mobile-item.disponible {
  background: #f8f9fa;
  border-color: #dee2e6;
  cursor: pointer;
}

.horario-mobile-item.disponible:hover {
  background: #e3f2fd;
  border-color: #2196f3;
}

.horario-mobile-item.no-disponible {
  background: #f5f5f5;
  border-color: #e0e0e0;
  cursor: not-allowed;
  opacity: 0.6;
}

.horario-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.horario-texto {
  font-weight: 600;
  font-size: 0.9rem;
  color: #2c3e50;
}

.cupos-mobile {
  font-size: 0.75rem;
  color: #6c757d;
}

.estado-mobile i {
  font-size: 1.1rem;
}

/* ICONOS PARA MODO VISUALIZACIÓN */
.estado-mobile .asignado {
  color: #4caf50;
}

.estado-mobile .no-asignado {
  color: #bdbdbd;
}

/* ICONOS PARA MODO EDICIÓN */
.estado-mobile .seleccionado {
  color: #2196f3;
}

.estado-mobile .no-disponible {
  color: #6c757d;
}

.estado-mobile .disponible {
  color: #28a745;
}

/* Mensajes de estado */
.mensajes-estado {
  margin-top: 1.5rem;
}

.mensaje {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.2rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.mensaje-info {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  color: #e91e63;
}

.mensaje-success {
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  color: #2e7d32;
}

.mensaje i {
  font-size: 1.3rem;
  margin-top: 0.1rem;
}

.mensaje strong {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 1rem;
}

.mensaje p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Leyenda */
.leyenda {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.leyenda h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1rem;
}

.leyenda-items {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.leyenda-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #546e7a;
}

.leyenda-item i {
  font-size: 1rem;
}

.leyenda-item .disponible {
  color: #28a745;
}

.leyenda-item .seleccionado {
  color: #2196f3;
}

.leyenda-item .no-disponible {
  color: #6c757d;
}

/* Animaciones */
@keyframes pulse {
  0% { border-color: #90caf9; }
  50% { border-color: #42a5f5; }
  100% { border-color: #90caf9; }
}

.slide-enter-active {
  transition: all 0.3s ease-out;
}

.slide-leave-active {
  transition: all 0.2s ease-in;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

/* RESPONSIVE MEJORADO */
@media (max-width: 768px) {
  .tabla-horarios {
    padding: 1rem;
  }
  
  .tabla-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: 0.8rem;
  }
  
  .controles {
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.8rem;
  }
  
  .titulo {
    font-size: 1.2rem;
    justify-content: center;
  }
  
  .btn-accion {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .contador-seleccion {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
  }
  
  .leyenda-items {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  /* MEJORAS ESPECÍFICAS PARA MÓVIL */
  .dia-header-mobile {
    padding: 0.8rem;
    min-height: 50px;
  }
  
  .dia-info {
    gap: 0.3rem;
  }
  
  .dia-nombre {
    font-size: 0.9rem;
    min-width: 70px;
  }
  
  .dia-cupos {
    font-size: 0.75rem;
  }
  
  .asignados-count,
  .seleccionados-count {
    font-size: 0.75rem;
  }
  
  .horario-mobile-item {
    padding: 0.6rem;
    min-height: 50px;
  }
  
  .horario-texto {
    font-size: 0.85rem;
  }
  
  .cupos-mobile {
    font-size: 0.7rem;
  }
  
  .mobile-instructions {
    padding: 0.8rem;
  }
  
  .mobile-instructions p {
    font-size: 0.85rem;
  }
  
  .mensaje {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  /* Estilos específicos para texto en móvil */
  .horario-mobile-item.asignado .horario-texto {
    font-weight: 600;
    color: #2e7d32;
  }
  
  .horario-mobile-item.seleccionado .horario-texto {
    font-weight: 600;
    color: #1976d2;
  }
}

@media (max-width: 480px) {
  .dia-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
  }
  
  .dia-nombre {
    min-width: auto;
  }
  
  .selection-count {
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }
  
  .count-number {
    font-size: 1.3rem;
  }
  
  .count-text {
    font-size: 0.9rem;
  }
  
  .horario-mobile-item {
    padding: 0.5rem;
    min-height: 45px;
  }
  
  .horario-texto {
    font-size: 0.8rem;
  }
  
  .cupos-mobile {
    font-size: 0.65rem;
  }
  
  .estado-mobile i {
    font-size: 1rem;
  }
}
</style>