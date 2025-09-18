<template>
  <div class="lista-reclamos-container" :class="{ 'mobile': isMobile }">
    <!-- Vista para PC -->
    <table v-if="!isMobile" class="tabla-reclamos">
      <thead>
        <tr>
          <th>Nro Reclamo</th>
          <th>Fecha y Hora</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reclamo in reclamos" :key="reclamo.id" class="fila-reclamo">
          <td class="numero">#{{ reclamo.id }}</td>
          <td class="fecha-hora">
            {{ reclamo.fecha }}<br>
            <span class="hora">{{ reclamo.hora }}</span>
          </td>
          <td class="descripcion">{{ reclamo.descripcion || 'Sin descripción' }}</td>
        </tr>
      </tbody>
    </table>
    
    <!-- Vista para móviles -->
    <div v-else class="mobile-view">
      <div 
        v-for="reclamo in reclamos" 
        :key="reclamo.id" 
        class="reclamo-card"
        :class="{ 'expandida': reclamoExpandido === reclamo.id }"
      >
        <div class="card-header" @click="toggleExpandido(reclamo.id)">
          <div class="info-principal">
            <span class="numero">#{{ reclamo.id }}</span>
            <div class="fecha-hora">
              <span class="fecha">{{ reclamo.fecha }}</span>
              <span class="hora">{{ reclamo.hora }}</span>
            </div>
          </div>
          
          <div class="expand-icon">
            <i :class="reclamoExpandido === reclamo.id ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </div>
        </div>
        
        <transition name="slide">
          <div v-if="reclamoExpandido === reclamo.id" class="card-details">
            <div class="detalle-descripcion">
              <h4>Descripción:</h4>
              <p>{{ reclamo.descripcion || 'Sin descripción' }}</p>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  reclamos: Array
})

const isMobile = ref(false)
const reclamoExpandido = ref(null)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const toggleExpandido = (id) => {
  reclamoExpandido.value = reclamoExpandido.value === id ? null : id
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
.lista-reclamos-container {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  overflow-x: auto;
}

/* ESTILOS PARA PC */
.tabla-reclamos {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Poppins', sans-serif;
}

th {
  text-align: left;
  vertical-align: middle;
  font-weight: bold;
  padding: 0.75rem;
  color: #333;
  font-size: 1rem;
}

thead {
  background-color: #f2f2f2;
}

.fila-reclamo {
  height: 64px;
  border-bottom: 1px solid #ccc;
}

td {
  vertical-align: middle;
  color: #222;
  padding: 0.75rem;
}

.numero {
  font-weight: 600;
  color: #e91e63;
}

.fecha-hora {
  font-weight: 500;
}

.hora {
  color: #666;
  font-size: 0.9rem;
}

.descripcion {
  line-height: 1.4;
}

/* ESTILOS PARA MÓVIL */
.mobile-view {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.reclamo-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  background: #f8f9fa;
}

.info-principal {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.numero {
  font-weight: 600;
  color: #e91e63;
  font-size: 1.1rem;
}

.fecha-hora {
  display: flex;
  gap: 0.8rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.fecha, .hora {
  font-weight: 500;
}

.expand-icon {
  color: #6c757d;
  transition: transform 0.3s ease;
}

.reclamo-card.expandida .expand-icon {
  transform: rotate(180deg);
}

/* Animaciones */
.slide-enter-active {
  animation: slideDown 0.3s ease-out;
}

.slide-leave-active {
  animation: slideUp 0.25s ease-in;
}

@keyframes slideDown {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 200px;
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    max-height: 200px;
    opacity: 1;
  }
  to {
    max-height: 0;
    opacity: 0;
  }
}

.card-details {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.detalle-descripcion h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 600;
}

.detalle-descripcion p {
  margin: 0;
  color: #495057;
  line-height: 1.5;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 480px) {
  .lista-reclamos-container {
    padding: 0.8rem;
  }
  
  .card-header {
    padding: 0.8rem;
  }
  
  .numero {
    font-size: 1rem;
  }
  
  .fecha-hora {
    font-size: 0.85rem;
    gap: 0.5rem;
  }
  
  .card-details {
    padding: 0.8rem;
  }
  
  .detalle-descripcion h4 {
    font-size: 0.85rem;
  }
  
  .detalle-descripcion p {
    font-size: 0.85rem;
  }
}
</style>