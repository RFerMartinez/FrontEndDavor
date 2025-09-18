<template>
  <!-- Vista Desktop -->
  <tr v-if="!isMobile" class="fila-alumno desktop-view">
    <td class="col-dni">
      <div class="dni-container">
        {{ alumno.dni }}
      </div>
    </td>
    <td class="col-nombre">
      <div class="nombre-container">
        <div class="nombre-completo">{{ alumno.nombre }} {{ alumno.apellido }}</div>
      </div>
    </td>
    <td class="col-cuotas">
      <div class="cuotas-container">
        <span class="cuotas-pendientes" :class="{'ninguna': alumno.cuotasPendientes === 0}">
          {{ alumno.cuotasPendientes }}
        </span>
      </div>
    </td>
    <td class="col-estado-alumno">
      <div class="estado-container">
        <Estado :positivo="alumno.activo" :texto="alumno.activo ? 'ACTIVO' : 'INACTIVO'" />
      </div>
    </td>
    <td class="col-acciones">
      <div class="acciones-container">
        <button class="btn-info" @click="verDetalles">
          <i class="fas fa-info-circle"></i>
          Detalles
        </button>
      </div>
    </td>
  </tr>

  <!-- Vista Móvil -->
  <div v-else class="alumno-card mobile-view" :class="{ 'expandida': expandida, 'activo': alumno.activo }">
    <div class="card-header" @click="toggleExpandida">
      <div class="info-basica">
        <div class="dni-mobile">{{ alumno.dni }}</div>
        <div class="nombre-mobile">{{ alumno.nombre }} {{ alumno.apellido }}</div>
      </div>
      
      <div class="estado-cuotas-mobile">
        <span class="cuotas-mobile" :class="{'ninguna': alumno.cuotasPendientes === 0}">
          {{ alumno.cuotasPendientes }} pendientes
        </span>
        <Estado :positivo="alumno.activo" :texto="alumno.activo ? 'ACTIVO' : 'INACTIVO'" />
      </div>
      
      <div class="expand-icon">
        <i :class="expandida ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
      </div>
    </div>
    
    <transition name="slide" mode="out-in">
      <div v-if="expandida" class="card-details">
        <div class="detail-row">
          <span class="detail-label">DNI:</span>
          <span class="detail-value">{{ alumno.dni }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Nombre:</span>
          <span class="detail-value">{{ alumno.nombre }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Apellido:</span>
          <span class="detail-value">{{ alumno.apellido }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Cuotas Pendientes:</span>
          <span class="detail-value">
            <span class="cuotas-detalle" :class="{'ninguna': alumno.cuotasPendientes === 0}">
              {{ alumno.cuotasPendientes }}
            </span>
          </span>
        </div>
        
        <div class="action-container">
          <button class="btn-info-mobile" @click="verDetalles">
            <i class="fas fa-info-circle"></i>
            Ver Detalles Completos
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Estado from '../Estado.vue'

const props = defineProps({
  alumno: Object,
  isMobile: Boolean
})

const expandida = ref(false)

const toggleExpandida = () => {
  expandida.value = !expandida.value
}

const verDetalles = () => {
  console.log('Ver detalles del alumno:', props.alumno)
  // Lógica para ver detalles del alumno
}
</script>

<style scoped>
/* ESTILOS PARA VISTA DESKTOP */
.fila-alumno.desktop-view {
  height: 60px;
  border-bottom: 1px solid #eaeaea;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background-color: white;
}

.fila-alumno.desktop-view:hover {
  background-color: #f8f9fa;
}

/* ALINEACIÓN PERFECTA PARA TODAS LAS CELDAS */
.fila-alumno.desktop-view td {
  vertical-align: middle;
  padding: 1rem 0.5rem;
  height: 60px;
  box-sizing: border-box;
}

/* Contenedores para centrado perfecto */
.dni-container,
.nombre-container,
.estado-container,
.cuotas-container,
.acciones-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
}

/* Estilo para DNI - CENTRADO */
.col-dni {
  text-align: center;
  width: 15%;
  padding: 1rem 0.5rem !important;
}

.dni-container {
  align-items: center;
  font-weight: 600;
  color: #2c3e50;
}

/* Estilo para Nombre - ALINEADO IZQUIERDA */
.col-nombre {
  text-align: left;
  padding: 1rem 0.5rem !important;
  padding-left: 1.5rem !important;
  width: 35%;
}

.nombre-container {
  align-items: flex-start;
}

.nombre-completo {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

/* Estilo para Cuotas - CENTRADO */
.col-cuotas {
  text-align: center;
  width: 15%;
  padding: 1rem 0.5rem !important;
}

.cuotas-container {
  align-items: center;
}

.cuotas-pendientes {
  font-weight: 700;
  font-size: 1rem;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  min-width: 30px;
  text-align: center;
  display: inline-block;
  background-color: #fce4ec;
  color: #d81b60;
}

.cuotas-pendientes.ninguna {
  background-color: #e8f5e9;
  color: #388e3c;
}

/* Estilo para Estado - CENTRADO */
.col-estado-alumno {
  text-align: center;
  width: 15%;
  padding: 1rem 0.5rem !important;
}

/* Estilo para Acciones - CENTRADO */
.col-acciones {
  text-align: center;
  width: 20%;
  padding: 1rem 0.5rem !important;
}

.acciones-container {
  align-items: center;
  justify-content: center;
  display: flex;
}

.btn-info {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #495057;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}


.btn-info:hover {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #adb5bd;
}

/* ESTILOS PARA VISTA MÓVIL */
.alumno-card.mobile-view {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  transition: all 0.3s ease;
  border-left: 4px solid #ff4d4d;
}

.alumno-card.mobile-view.activo {
  border-left: 4px solid #47d147;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  transition: background-color 0.2s ease;
}

.card-header:hover {
  background-color: #f5f5f5;
}

.info-basica {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.dni-mobile {
  font-weight: 600;
  font-size: 0.9rem;
  color: #616161;
  margin-bottom: 0.3rem;
}

.nombre-mobile {
  font-weight: 700;
  font-size: 1rem;
  color: #212121;
}

.estado-cuotas-mobile {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 0 0.8rem;
  gap: 0.3rem;
}

.cuotas-mobile {
  font-weight: 600;
  font-size: 0.8rem;
  color: #d81b60;
}

.cuotas-mobile.ninguna {
  color: #388e3c;
}

.expand-icon {
  color: #757575;
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.alumno-card.mobile-view.expandida .expand-icon {
  transform: rotate(180deg);
}

/* Animaciones */
.slide-enter-active {
  animation: slideDown 0.4s ease-out;
}

.slide-leave-active {
  animation: slideUp 0.25s ease-in;
}

@keyframes slideDown {
  from {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    max-height: 250px;
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    max-height: 250px;
    opacity: 1;
    transform: translateY(0);
  }
  to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }
}

.card-details {
  padding: 0 1rem 1rem 1rem;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  width: 100%;
  align-items: center;
}

.detail-label {
  font-weight: 600;
  color: #616161;
  font-size: 0.9rem;
  min-width: 100px;
}

.detail-value {
  color: #212121;
  font-size: 0.9rem;
  text-align: right;
  flex: 1;
}

.cuotas-detalle {
  font-weight: 700;
  font-size: 1rem;
  color: #d81b60;
  padding: 0.3rem 0.7rem;
  border-radius: 12px;
  background-color: #fce4ec;
  min-width: 25px;
  text-align: center;
  display: inline-block;
}

.cuotas-detalle.ninguna {
  color: #388e3c;
  background-color: #e8f5e9;
}

.action-container {
  display: flex;
  justify-content: center;
  margin-top: 1.2rem;
  width: 100%;
}

.btn-info-mobile {
  padding: 0.7rem 1.2rem;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #495057;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  font-weight: 500;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}


.btn-info-mobile:hover {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #adb5bd;
}

/* Media queries para móvil */
@media (max-width: 768px) {
  .card-header {
    padding: 0.8rem;
  }
  
  .dni-mobile {
    font-size: 0.85rem;
  }
  
  .nombre-mobile {
    font-size: 0.95rem;
  }
  
  .estado-cuotas-mobile {
    margin: 0 0.6rem;
    gap: 0.2rem;
  }
  
  .cuotas-mobile {
    font-size: 0.75rem;
  }
  
  .card-details {
    padding: 0 0.8rem 0.8rem 0.8rem;
  }
  
  .detail-row {
    margin-bottom: 0.7rem;
  }
  
  .detail-label {
    font-size: 0.85rem;
    min-width: 90px;
  }
  
  .detail-value {
    font-size: 0.85rem;
  }
  
  .action-container {
    margin-top: 1rem;
  }
}

@media (max-width: 380px) {
  .card-header {
    padding: 0.7rem;
  }
  
  .dni-mobile {
    font-size: 0.8rem;
  }
  
  .nombre-mobile {
    font-size: 0.9rem;
  }
  
  .estado-cuotas-mobile {
    margin: 0 0.5rem;
  }
  
  .cuotas-mobile {
    font-size: 0.7rem;
  }
  
  .card-details {
    padding: 0 0.7rem 0.7rem 0.7rem;
  }
  
  .detail-label {
    font-size: 0.8rem;
    min-width: 80px;
  }
  
  .detail-value {
    font-size: 0.8rem;
  }
}
</style>