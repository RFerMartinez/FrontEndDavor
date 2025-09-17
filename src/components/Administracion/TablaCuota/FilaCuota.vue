<template>
  <!-- Vista Desktop -->
  <tr v-if="!isMobile" class="fila-cuota desktop-view">
    <td class="col-mes-anio">
      <div class="mes-anio-container">
        <span class="mes-td">{{ obtenerNombreMes(cuota.mes) }}</span>
        <span class="anio-td">{{ cuota.anio }}</span>
      </div>
    </td>
    <td class="col-trabajo-suscripcion">
      <div class="trabajo-suscripcion-container">
        <div class="trabajo">{{ cuota.trabajo }}</div>
        <div class="suscripcion">{{ cuota.suscripcion }}</div>
      </div>
    </td>
    <td class="col-monto">
      <div class="monto-container">
        ${{ cuota.monto.toLocaleString('es-AR') }}
      </div>
    </td>
    <td class="col-accion">
      <div class="accion-container">
        <BotonAccion :pagada="cuota.pagada" />
      </div>
    </td>
    <td class="col-estado">
      <div class="estado-container">
        <EstadoPago :pagada="cuota.pagada" />
      </div>
    </td>
  </tr>

  <!-- Vista Móvil -->
  <div v-else class="cuota-card mobile-view" :class="{ 'expandida': expandida, 'pagada': cuota.pagada }">
    <div class="card-header" @click="toggleExpandida">
      <div class="mes-anio">
        <span class="mes">{{ obtenerNombreMes(cuota.mes) }}</span>
        <span class="anio">{{ cuota.anio }}</span>
      </div>
      
      <div class="monto-estado">
        <span class="monto">${{ cuota.monto.toLocaleString('es-AR') }}</span>
        <EstadoPago :pagada="cuota.pagada" />
      </div>
      
      <div class="expand-icon">
        <i :class="expandida ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
      </div>
    </div>
    
    <transition name="slide" mode="out-in">
      <div v-if="expandida" class="card-details">
        <div class="detail-row first-detail">
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
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BotonAccion from './BotonAccion.vue'
import EstadoPago from './EstadoPago.vue'

const props = defineProps({
  cuota: Object,
  isMobile: Boolean
})

const expandida = ref(false)

const toggleExpandida = () => {
  expandida.value = !expandida.value
}

const obtenerNombreMes = (mes) => {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return meses[mes - 1] || mes
}
</script>

<style scoped>
/* ESTILOS PARA VISTA DESKTOP - CORREGIDOS */
.fila-cuota.desktop-view {
  height: 70px;
  border-bottom: 1px solid #eee;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.fila-cuota.desktop-view:hover {
  background-color: #f8fafc;
}

/* ALINEACIÓN PERFECTA PARA TODAS LAS CELDAS */
.fila-cuota.desktop-view td {
  vertical-align: middle;
  padding: 0.75rem 0.5rem;
  height: 70px;
  box-sizing: border-box;
}

/* Contenedores para centrado perfecto */
.mes-anio-container,
.trabajo-suscripcion-container,
.monto-container,
.accion-container,
.estado-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
}

/* Estilo para Mes/Año - CENTRADO PERFECTO */
.col-mes-anio {
  text-align: center;
  width: 15%;
  padding: 0.75rem 0.5rem !important; /* ✅ Igual padding que encabezados */
}

.mes-td {
  font-weight: 700;
  font-size: 1rem;
  color: #2c3e50;
  line-height: 1.2;
  text-align: center;
}

.anio-td {
  font-size: 0.85rem;
  color: #718096;
  margin-top: 0.3rem;
  line-height: 1.2;
  text-align: center;
}

/* ✅ CORRECCIÓN: Trabajo/Suscripción - ALINEADO CON ENCABEZADO */
.col-trabajo-suscripcion {
  text-align: left;
  padding: 0.75rem 0.5rem !important; /* ✅ Mismo padding que encabezado */
  width: 35%;
  padding-left: 1.5rem !important; /* ✅ Padding adicional izquierdo */
}

.trabajo-suscripcion-container {
  justify-content: center;
  align-items: flex-start;
}

.trabajo {
  font-weight: 700;
  font-size: 1rem;
  color: #2c3e50;
  line-height: 1.2;
  text-align: left;
  width: 100%;
}

.suscripcion {
  font-size: 0.85rem;
  color: #718096;
  margin-top: 0.3rem;
  line-height: 1.2;
  text-align: left;
  width: 100%;
}

/* ✅ CORRECCIÓN: Monto - ALINEADO CON ENCABEZADO */
.col-monto {
  text-align: right;
  padding: 0.75rem 0.5rem !important; /* ✅ Mismo padding que encabezado */
  padding-right: 1.5rem !important; /* ✅ Padding adicional derecho */
  font-weight: 600;
  color: #2c3e50;
  width: 15%;
}

.monto-container {
  align-items: flex-end;
  justify-content: center;
  text-align: right;
  font-weight: 600;
}

/* Estilo para Acciones - CENTRADO PERFECTO */
.col-accion {
  text-align: center;
  width: 20%;
  padding: 0.75rem 0.5rem !important; /* ✅ Mismo padding que encabezados */
}

.accion-container {
  align-items: center;
  justify-content: center;
  display: flex;
}

/* Estilo para Estado - CENTRADO PERFECTO */
.col-estado {
  text-align: center;
  width: 15%;
  padding: 0.75rem 0.5rem !important; /* ✅ Mismo padding que encabezados */
}

.estado-container {
  align-items: center;
  justify-content: center;
  display: flex;
}

/* ESTILOS PARA VISTA MÓVIL (sin cambios) */
.cuota-card.mobile-view {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  transition: all 0.3s ease;
}

.cuota-card.mobile-view.pagada {
  opacity: 0.9;
  border-left: 4px solid #4caf50;
}

.cuota-card.mobile-view:not(.pagada) {
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
  transition: background-color 0.2s ease;
}

.card-header:hover {
  background-color: #f8f9fa;
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
  gap: 0.3rem;
}

.monto {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2c3e50;
}

.expand-icon {
  color: #95a5a6;
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.cuota-card.mobile-view.expandida .expand-icon {
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
    max-height: 200px;
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    max-height: 200px;
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
  padding: 0 1.2rem 1.2rem 1.2rem;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  width: 100%;
  align-items: flex-start;
}

.first-detail {
  margin-top: 1.2rem;
}

.detail-label {
  font-weight: 600;
  color: #7f8c8d;
  font-size: 0.9rem;
  min-width: 80px;
}

.detail-value {
  color: #2c3e50;
  font-size: 0.9rem;
  text-align: right;
  margin-left: 1rem;
  flex: 1;
  line-height: 1.4;
}

.action-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  width: 100%;
}

/* Media queries para móvil */
@media (max-width: 768px) {
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
    gap: 0.2rem;
  }
  
  .card-details {
    padding: 0 1rem 1rem 1rem;
  }
  
  .detail-row {
    margin-bottom: 0.9rem;
  }
  
  .first-detail {
    margin-top: 1rem;
  }
  
  .action-container {
    margin-top: 1.2rem;
  }
}

@media (max-width: 380px) {
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
  
  .detail-row {
    margin-bottom: 0.8rem;
  }
  
  .first-detail {
    margin-top: 0.8rem;
  }
  
  .action-container {
    margin-top: 1rem;
  }
}
</style>