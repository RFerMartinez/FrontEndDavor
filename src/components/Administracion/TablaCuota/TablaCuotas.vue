<template>
  <div class="tabla-container" :class="{ 'mobile': isMobile }">
    <table v-if="!isMobile" class="tabla-cuotas">
      <thead>
        <tr>
          <th class="col-mes">MES / AÑO</th>
          <th class="col-trabajo">TRABAJO / SUSCRIPCIÓN</th>
          <th class="col-monto">MONTO</th>
          <th class="col-acciones">ACCIONES</th>
          <th class="col-estado">ESTADO</th>
        </tr>
      </thead>
      <tbody>
        <FilaCuota
          v-for="(cuota, index) in cuotas"
          :key="index"
          :cuota="cuota"
          :is-mobile="isMobile"
        />
      </tbody>
    </table>
    
    <!-- Vista móvil manejada por FilaCuota -->
    <div v-else class="mobile-view">
      <FilaCuota
        v-for="(cuota, index) in cuotas"
        :key="index"
        :cuota="cuota"
        :is-mobile="isMobile"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import FilaCuota from './FilaCuota.vue'

defineProps({
  cuotas: Array
})

const isMobile = ref(false)

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
  padding: 0.75rem 0.5rem; /* ✅ Cambiado de 1.2rem a 0.75rem para igualar celdas */
  color: #2c3e50;
  font-weight: 700;
  font-size: 0.9rem;
  border-bottom: 2px solid #e1e8ed;
  background-color: #f8fafc;
  position: sticky;
  top: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  height: 70px; /* ✅ Misma altura que las celdas */
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
  padding-left: 1.5rem !important; /* ✅ Igual que las celdas */
  text-align: left;
}

.tabla-cuotas .col-monto {
  width: 15%;
  padding: 0.75rem 0.5rem !important;
  padding-right: 1.5rem !important; /* ✅ Igual que las celdas */
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

.mobile-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
}

@media (max-width: 380px) {
  .tabla-container {
    padding: 1rem;
    border-radius: 12px;
  }
}
</style>