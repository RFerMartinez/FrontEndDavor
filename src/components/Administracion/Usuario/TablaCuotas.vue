<template>
  <div class="tabla-completa">
    <div class="tabla-container" :class="{ 'mobile': isMobile }">
      <table v-if="!isMobile" class="tabla-cuotas">
        <thead>
          <tr>
            <th class="col-mes">MES / AÑO</th>
            <th class="col-trabajo">TRABAJO / SUSCRIPCIÓN</th>
            <th class="col-monto">MONTO</th>
            <th class="col-acciones">ACCIONES</th>
            <th class="col-estado">ESTADO</th>
            <!-- Nueva columna vacía solo para modo infoAlumno -->
            <th v-if="modo === 'infoAlumno'" class="col-adicional"></th>
          </tr>
        </thead>
        <tbody>
          <FilaCuota
            v-for="(cuota, index) in cuotasPaginadas"
            :key="index"
            :cuota="cuota"
            :is-mobile="isMobile"
            :modo="modo"
          />
        </tbody>
      </table>
      
      <!-- Vista móvil manejada por FilaCuota -->
      <div v-else class="mobile-view">
        <FilaCuota
          v-for="(cuota, index) in cuotasPaginadas"
          :key="index"
          :cuota="cuota"
          :is-mobile="isMobile"
          :modo="modo"
        />
      </div>
    </div>

    <!-- Controles de paginación inferiores - Solo navegación -->
    <div class="paginacion-inferior" v-if="totalPaginas > 1">
      <div class="paginacion-controles">
        <button 
          class="btn-paginacion" 
          :disabled="paginaActual === 1"
          @click="cambiarPagina(paginaActual - 1)"
          aria-label="Página anterior"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <div class="numeros-pagina">
          <span 
            v-for="numero in numerosPaginas" 
            :key="numero"
            class="numero-pagina"
            :class="{ 'activa': numero === paginaActual }"
            @click="cambiarPagina(numero)"
          >
            {{ numero }}
          </span>
        </div>
        
        <button 
          class="btn-paginacion" 
          :disabled="paginaActual === totalPaginas"
          @click="cambiarPagina(paginaActual + 1)"
          aria-label="Página siguiente"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import FilaCuota from './FilaCuota.vue'

const props = defineProps({
  cuotas: Array,
  elementosPorPagina: {
    type: Number,
    default: 6
  },
  modo: {
    type: String,
    default: 'cuota' // 'cuota' o 'infoAlumno'
  }
})

const isMobile = ref(false)
const paginaActual = ref(1)

// Computed properties para la paginación
const totalPaginas = computed(() => 
  Math.ceil(props.cuotas.length / props.elementosPorPagina)
)

const cuotasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * props.elementosPorPagina
  const fin = inicio + props.elementosPorPagina
  return props.cuotas.slice(inicio, fin)
})

const numerosPaginas = computed(() => {
  const total = totalPaginas.value
  const current = paginaActual.value
  const delta = 1 // Número de páginas a mostrar alrededor de la actual
  
  let range = []
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }
  
  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < total - 1) {
    range.push('...')
  }
  
  range.unshift(1)
  if (total > 1) range.push(total)
  
  return range
})

// Métodos
const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina !== '...' && nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
    // Scroll suave al principio del contenedor
    document.querySelector('.tabla-completa').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  }
}

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>

<style scoped>
.tabla-completa {
  width: 100%;
}

.tabla-container {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 0;
  overflow-x: auto;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.tabla-cuotas {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.95rem;
  min-width: 800px;
}

/* ✅ CORRECCIÓN: ENCABEZADOS CON PADDING CONSISTENTE */
.tabla-cuotas th {
  text-align: center;
  padding: 0.75rem 0.5rem;
  color: #2c3e50;
  font-weight: 700;
  font-size: 0.9rem;
  border-bottom: 2px solid #e1e8ed;
  background-color: #f8fafc;
  position: sticky;
  top: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  height: 70px;
  box-sizing: border-box;
  vertical-align: middle;
}

/* ✅ CORRECCIÓN: PADDING ESPECÍFICO PARA CADA COLUMNA */
.tabla-cuotas .col-mes {
  width: 15%;
  padding: 0.75rem 0.5rem !important;
}

.tabla-cuotas .col-trabajo {
  width: 35%;
  padding: 0.75rem 0.5rem !important;
  padding-left: 1.5rem !important;
  text-align: left;
}

.tabla-cuotas .col-monto {
  width: 15%;
  padding: 0.75rem 0.5rem !important;
  padding-right: 1.5rem !important;
  text-align: right;
}

.tabla-cuotas .col-acciones {
  width: 20%;
  padding: 0.75rem 0.5rem !important;
}

.tabla-cuotas .col-estado {
  width: 15%;
  padding: 0.75rem 0.5rem !important;
}

.tabla-cuotas .col-adicional {
  width: 10%;
  padding: 0.75rem 0.5rem !important;
}

.mobile-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Paginación inferior - Solo navegación */
.paginacion-inferior {
  margin-top: 2.5rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  border: 1px solid #dee2e6;
  display: flex;
  justify-content: center;
  align-items: center;
}

.paginacion-controles {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.btn-paginacion {
  width: 40px;
  height: 40px;
  border: 2px solid #e91e63;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #e91e63;
  font-size: 0.9rem;
}

.btn-paginacion:hover:not(:disabled) {
  background: #e91e63;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
}

.btn-paginacion:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #ccc;
  color: #ccc;
}

.numeros-pagina {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.numero-pagina {
  width: 35px;
  height: 35px;
  border: 2px solid #dee2e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #6c757d;
  font-size: 0.85rem;
}

.numero-pagina:hover {
  border-color: #e91e63;
  color: #e91e63;
  transform: scale(1.05);
}

.numero-pagina.activa {
  background: #e91e63;
  border-color: #e91e63;
  color: white;
  transform: scale(1.1);
}

/* Media queries para móvil */
@media (max-width: 768px) {
  .tabla-container {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .mobile-view {
    gap: 0.8rem;
  }
  
  .paginacion-inferior {
    margin-top: 2rem;
    padding: 1rem;
  }
  
  .btn-paginacion {
    width: 35px;
    height: 35px;
    font-size: 0.8rem;
  }
  
  .numero-pagina {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .tabla-container {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .paginacion-inferior {
    margin-top: 1.5rem;
    padding: 0.8rem;
  }
  
  .paginacion-controles {
    gap: 0.6rem;
  }
  
  .btn-paginacion {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }
  
  .numero-pagina {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
  
  .numeros-pagina {
    gap: 0.3rem;
  }
}

@media (max-width: 380px) {
  .tabla-container {
    padding: 1rem;
    border-radius: 12px;
  }
}
</style>