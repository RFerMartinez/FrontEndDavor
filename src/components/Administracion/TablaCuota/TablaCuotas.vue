<template>
  <div class="tabla-container" :class="{ 'mobile': isMobile }">
    <table v-if="!isMobile" class="tabla-cuotas">
      <thead>
        <tr>
          <th>Mes / Año</th>
          <th>Trabajo / Suscripción</th>
          <th>Monto</th>
          <th></th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <FilaCuota
          v-for="(cuota, index) in cuotas"
          :key="index"
          :cuota="cuota"
        />
      </tbody>
    </table>
    
    <div v-else class="mobile-view">
      <div 
        v-for="(cuota, index) in cuotas" 
        :key="index" 
        class="cuota-card"
        :class="{ 'expandida': cuotaExpandida === index, 'pagada': cuota.pagada }"
      >
        <div class="card-header" @click="toggleExpandida(index)">
          <div class="mes-anio">
            <span class="mes">{{ obtenerNombreMes(cuota.mes) }}</span>
            <span class="anio">{{ cuota.anio }}</span>
          </div>
          
          <div class="monto-estado">
            <span class="monto">${{ cuota.monto.toLocaleString('es-AR') }}</span>
            <EstadoPago :pagada="cuota.pagada" />
          </div>
          
          <div class="expand-icon">
            <i :class="cuotaExpandida === index ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </div>
        </div>
        
        <div v-if="cuotaExpandida === index" class="card-details">
          <div class="detail-row">
            <span class="detail-label">Trabajo:</span>
            <span class="detail-value">{{ cuota.trabajo }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Suscripción:</span>
            <span class="detail-value">{{ cuota.suscripcion }}</span>
          </div>
          
          <div class="action-container">
            <BotonAccion :pagada="cuota.pagada" :is-mobile="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import FilaCuota from './FilaCuota.vue'
import BotonAccion from './BotonAccion.vue'
import EstadoPago from './EstadoPago.vue'

defineProps({
  cuotas: Array
})

const isMobile = ref(false)
const cuotaExpandida = ref(null)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const toggleExpandida = (index) => {
  cuotaExpandida.value = cuotaExpandida.value === index ? null : index
}

const obtenerNombreMes = (mes) => {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return meses[mes - 1] || mes
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
.tabla-container {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  margin: 0;
  overflow-x: auto;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
}

.tabla-cuotas {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.05rem;
}

.tabla-cuotas th {
  text-align: center;
  padding: 1rem;
  color: #333;
  font-size: 1.1rem;
}

.tabla-cuotas thead {
  background-color: #f2f2f2;
}

.mobile-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cuota-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
}

.cuota-card.pagada {
  opacity: 0.9;
  border-left: 4px solid #4caf50;
}

.cuota-card:not(.pagada) {
  border-left: 4px solid #ff4d4d;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.mes-anio {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.mes {
  font-weight: 600;
  font-size: 1.1rem;
  color: #2c3e50;
}

.anio {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-top: 0.2rem;
}

.monto-estado {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 0 1rem;
}

.monto {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.3rem;
}

.expand-icon {
  color: #95a5a6;
  font-size: 0.9rem;
}

.card-details {
  padding: 0 1.2rem 1.2rem 1.2rem;
  border-top: 1px solid #f1f1f1;
  margin-top: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  width: 100%;
}

.detail-label {
  font-weight: 600;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.detail-value {
  color: #2c3e50;
  font-size: 0.9rem;
  text-align: right;
  margin-left: 1rem;
  flex: 1;
}

.action-container {
  display: flex;
  justify-content: center;
  margin-top: 1.2rem;
  width: 100%;
}

@media (max-width: 768px) {
  .tabla-container {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .mobile-view {
    gap: 0.8rem;
  }
  
  .card-header {
    padding: 1rem;
  }
  
  .mes {
    font-size: 1rem;
  }
  
  .monto {
    font-size: 1rem;
  }
  
  .monto-estado {
    margin: 0 0.8rem;
  }
  
  .card-details {
    padding: 0 1rem 1rem 1rem;
  }
}

@media (max-width: 380px) {
  .tabla-container {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .card-header {
    padding: 0.8rem;
  }
  
  .mes {
    font-size: 0.95rem;
  }
  
  .anio {
    font-size: 0.8rem;
  }
  
  .monto {
    font-size: 0.95rem;
  }
  
  .monto-estado {
    margin: 0 0.5rem;
  }
  
  .card-details {
    padding: 0 0.8rem 0.8rem 0.8rem;
  }
  
  .detail-label, .detail-value {
    font-size: 0.85rem;
  }
}
</style>