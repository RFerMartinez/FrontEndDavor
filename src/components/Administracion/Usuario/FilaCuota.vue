<template>
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
        <BotonAccion
          :pagada="cuota.pagada"
          :modo="modo"
          @accion-click="manejarAccionPrincipal"
        />
      </div>
    </td>
    <td class="col-estado">
      <div class="estado-container">
        <Estado :positivo="cuota.pagada" :texto="cuota.pagada ? 'PAGADA' : 'PENDIENTE'" />
        <div v-if="esPendiente" class="info-vencimiento" :class="claseVencimiento">
            <i v-if="estaPorVencer && !estaVencida" class="fas fa-exclamation-triangle warning-icon"></i>
            <span>{{ textoVencimiento }}</span>
        </div>
      </div>
    </td>
    <td v-if="modo === 'infoAlumno'" class="col-adicional">
      <div class="botones-adicionales">
        <button class="boton-modificar" @click="manejarModificar">
          Modificar
        </button>
        <button class="boton-eliminar" @click="manejarEliminar">
          Eliminar
        </button>
      </div>
    </td>
  </tr>

  <div v-else class="cuota-card mobile-view" :class="{ 'expandida': expandida, 'pagada': cuota.pagada, 'vencida': esPendiente && estaVencida, 'por-vencer': esPendiente && estaPorVencer }">
    <div class="card-header" @click="toggleExpandida">
      <div class="mes-anio">
        <div class="mes-anio-texto">
            <span class="mes">{{ obtenerNombreMes(cuota.mes) }}</span>
            <span class="anio">{{ cuota.anio }}</span>
        </div>
        <span v-if="esPendiente" class="vencimiento-icono-header">
            <i v-if="estaVencida" class="fas fa-calendar-times vencida-icon" title="Cuota Vencida"></i>
            <i v-else-if="estaPorVencer" class="fas fa-exclamation-triangle por-vencer-icon" title="Cuota por Vencer"></i>
        </span>
      </div>
      <div class="monto-estado">
        <span class="monto">${{ cuota.monto.toLocaleString('es-AR') }}</span>
        <Estado :positivo="cuota.pagada" :texto="cuota.pagada ? 'PAGADA' : 'PENDIENTE'" />
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

        <div v-if="esPendiente" class="detail-row info-vencimiento-mobile" :class="claseVencimiento">
           <span class="detail-label">Vencimiento:</span>
           <span class="detail-value">
                <i v-if="estaPorVencer && !estaVencida" class="fas fa-exclamation-triangle warning-icon"></i>
                {{ textoVencimiento }}
           </span>
        </div>
        <div class="action-container">
          <BotonAccion
            :pagada="cuota.pagada"
            :modo="modo"
            :is-mobile="true"
            @accion-click="manejarAccionPrincipal"
          />
        </div>

        <div v-if="modo === 'infoAlumno'" class="botones-adicionales-mobile">
          <button class="boton-modificar" @click="manejarModificar">
            Modificar
          </button>
          <button class="boton-eliminar" @click="manejarEliminar">
            Eliminar
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BotonAccion from './BotonAccion.vue';
import Estado from '../Estado.vue';

const props = defineProps({
  cuota: Object,
  isMobile: Boolean,
  modo: {
    type: String,
    default: 'cuota'
  }
});

const emit = defineEmits(['accion-principal', 'modificar', 'eliminar']);

const expandida = ref(false);

const toggleExpandida = () => {
  expandida.value = !expandida.value;
};

const obtenerNombreMes = (mes) => {
  const mesNum = parseInt(mes);
  if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) return mes;
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return meses[mesNum - 1];
};

// Computadas para Vencimiento (sin cambios)
const esPendiente = computed(() => !props.cuota.pagada);
const fechaVencimiento = computed(() => { /* ... igual que antes ... */
    if (!props.cuota.vencimiento) return null;
    try {
        const parts = props.cuota.vencimiento.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0]);
            const monthIndex = parseInt(parts[1]) - 1;
            const day = parseInt(parts[2]);
            return new Date(year, monthIndex, day);
        }
    } catch (e) { console.error("Error parsing date:", props.cuota.vencimiento, e); }
    return null;
});
const diasRestantes = computed(() => { /* ... igual que antes ... */
    if (!fechaVencimiento.value) return Infinity;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diffTime = fechaVencimiento.value.getTime() - hoy.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});
const estaVencida = computed(() => diasRestantes.value < 0);
const estaPorVencer = computed(() => diasRestantes.value >= 0 && diasRestantes.value <= 5);
const textoVencimiento = computed(() => { /* ... igual que antes ... */
    if (!fechaVencimiento.value) return '';
    const dias = diasRestantes.value;
    const fechaFormatoLocal = fechaVencimiento.value.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    if (estaVencida.value) { return `Venció el ${fechaFormatoLocal}`; }
    else if (dias === 0) { return 'Vence hoy'; }
    else if (dias === 1) { return 'Vence mañana'; }
    else if (estaPorVencer.value) { return `Vence en ${dias} días (${fechaFormatoLocal})`; }
    else { return `Vence el ${fechaFormatoLocal}`; }
});
const claseVencimiento = computed(() => { /* ... igual que antes ... */
    if (estaVencida.value) return 'vencida';
    if (estaPorVencer.value) return 'por-vencer';
    return '';
});

// Acciones (sin cambios)
const manejarAccionPrincipal = () => { /* ... igual que antes ... */
  if (props.modo === 'cuota') { console.log('Acción de PAGAR para cuota:', props.cuota); }
  else { console.log('Acción de MARCAR PAGADA para cuota:', props.cuota); }
  emit('accion-principal', props.cuota);
};
const manejarModificar = () => { /* ... igual que antes ... */
  console.log('Modificar cuota:', props.cuota);
  emit('modificar', props.cuota);
};
const manejarEliminar = () => { /* ... igual que antes ... */
  console.log('Eliminar cuota:', props.cuota);
  emit('eliminar', props.cuota);
};
</script>

<style scoped>
/* --- ESTILOS RE-INDENTADOS Y CON ADICIONES PARA ICONO HEADER --- */

/* Botones Adicionales (sin cambios) */
.botones-adicionales {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.botones-adicionales-mobile {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1rem;
  width: 100%;
}
.boton-modificar, .boton-eliminar {
  padding: 6px 12px;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
  white-space: nowrap;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  width: 100%;
  max-width: 120px;
  margin: 0 auto;
}
.boton-modificar:hover, .boton-eliminar:hover {
  transform: scale(1.05);
}
.boton-modificar {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #1976d2;
}
.boton-eliminar {
  background: #ffebee;
  color: #d32f2f;
  border: 1px solid #d32f2f;
}
.col-adicional {
  text-align: center;
  width: 10%;
  padding: 0.75rem 0.5rem !important;
}

/* Vencimiento (sin cambios) */
.info-vencimiento {
  font-size: 0.8rem;
  margin-top: 0.4rem;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
}
.info-vencimiento.por-vencer { color: #ff9800; font-weight: 500; }
.info-vencimiento.vencida { color: #d32f2f; font-weight: 600; }
.warning-icon { font-size: 0.9em; }
.info-vencimiento-mobile .detail-value { display: flex; align-items: center; gap: 0.3rem; color: #6c757d; font-weight: 500; }
.info-vencimiento-mobile.por-vencer .detail-value { color: #ff9800; }
.info-vencimiento-mobile.vencida .detail-value { color: #d32f2f; font-weight: 600; }

/* V V V NUEVOS ESTILOS PARA ICONO EN HEADER MÓVIL V V V */
.mes-anio {
  display: flex; /* Cambiado a flex */
  align-items: center; /* Alinear verticalmente texto e icono */
  gap: 0.5rem; /* Espacio entre texto e icono */
  flex: 1; /* Ocupa espacio disponible */
}
.mes-anio-texto {
  display: flex;
  flex-direction: column; /* Apila mes y año */
}
.vencimiento-icono-header {
  font-size: 1.1rem; /* Tamaño del icono */
  display: inline-flex; /* Para que esté en línea */
  align-items: center;
}
.por-vencer-icon {
  color: #ff9800; /* Naranja */
}
.vencida-icon {
  color: #d32f2f; /* Rojo oscuro */
}
/* ^ ^ ^ FIN NUEVOS ESTILOS ^ ^ ^ */

/* Estilos Fila Desktop (sin cambios) */
.fila-cuota.desktop-view { height: 70px; border-bottom: 1px solid #eee; font-family: 'Poppins', sans-serif; font-size: 0.95rem; transition: all 0.2s ease; }
.fila-cuota.desktop-view:hover { background-color: #f8fafc; }
.fila-cuota.desktop-view td { vertical-align: middle; padding: 0.75rem 0.5rem; height: 70px; box-sizing: border-box; }
.mes-anio-container, .trabajo-suscripcion-container, .monto-container, .accion-container, .estado-container { display: flex; flex-direction: column; justify-content: center; height: 100%; width: 100%; }
.col-mes-anio { text-align: center; width: 15%; padding: 0.75rem 0.5rem !important; }
.mes-td { font-weight: 700; font-size: 1rem; color: #2c3e50; line-height: 1.2; text-align: center; }
.anio-td { font-size: 0.85rem; color: #718096; margin-top: 0.3rem; line-height: 1.2; text-align: center; }
.col-trabajo-suscripcion { text-align: left; padding: 0.75rem 0.5rem !important; width: 35%; padding-left: 1.5rem !important; }
.trabajo-suscripcion-container { justify-content: center; align-items: flex-start; }
.trabajo { font-weight: 700; font-size: 1rem; color: #2c3e50; line-height: 1.2; text-align: left; width: 100%; }
.suscripcion { font-size: 0.85rem; color: #718096; margin-top: 0.3rem; line-height: 1.2; text-align: left; width: 100%; }
.col-monto { text-align: right; padding: 0.75rem 0.5rem !important; padding-right: 1.5rem !important; font-weight: 600; color: #2c3e50; width: 15%; }
.monto-container { align-items: flex-end; justify-content: center; text-align: right; font-weight: 600; }
.col-accion { text-align: center; width: 20%; padding: 0.75rem 0.5rem !important; }
.accion-container { align-items: center; justify-content: center; display: flex; }
.col-estado { text-align: center; width: 15%; padding: 0.75rem 0.5rem !important; }
.estado-container { align-items: center; justify-content: center; display: flex; flex-direction: column; }

/* Estilos Card Móvil (Base sin cambios) */
.cuota-card.mobile-view { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden; width: 100%; transition: all 0.3s ease; }
.cuota-card.mobile-view.pagada { opacity: 0.9; border-left: 4px solid #4caf50; }
.cuota-card.mobile-view:not(.pagada) { border-left: 4px solid #ff4d4d; }
/* Borde Vencida/Por Vencer (ahora usa !important para asegurar prioridad sobre :not(.pagada)) */
.cuota-card.mobile-view.vencida:not(.pagada) { border-left-color: #d32f2f !important; }
.cuota-card.mobile-view.por-vencer:not(.pagada) { border-left-color: #ff9800 !important; }

.card-header { display: flex; justify-content: space-between; align-items: center; padding: 1.2rem; cursor: pointer; width: 100%; box-sizing: border-box; transition: background-color 0.2s ease; }
.card-header:hover { background-color: #f8f9fa; }
/* .mes-anio ya modificado arriba */
.mes { font-weight: 600; font-size: 1.1rem; color: #2c3e50; }
.anio { font-size: 0.9rem; color: #7f8c8d; margin-top: 0.2rem; }
.monto-estado { display: flex; flex-direction: column; align-items: flex-end; margin: 0 1rem; gap: 0.3rem; }
.monto { font-weight: 700; font-size: 1.1rem; color: #2c3e50; }
.expand-icon { color: #95a5a6; font-size: 0.9rem; transition: transform 0.3s ease; }
.cuota-card.mobile-view.expandida .expand-icon { transform: rotate(180deg); }
.slide-enter-active { animation: slideDown 0.4s ease-out; }
.slide-leave-active { animation: slideUp 0.25s ease-in; }
@keyframes slideDown { from { max-height: 0; opacity: 0; transform: translateY(-10px); } to { max-height: 250px; opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { max-height: 250px; opacity: 1; transform: translateY(0); } to { max-height: 0; opacity: 0; transform: translateY(-10px); } }
.card-details { padding: 0 1.2rem 1.2rem 1.2rem; width: 100%; box-sizing: border-box; overflow: hidden; }
.detail-row { display: flex; justify-content: space-between; margin-bottom: 1rem; width: 100%; align-items: flex-start; }
.first-detail { margin-top: 1.2rem; }
.detail-label { font-weight: 600; color: #7f8c8d; font-size: 0.9rem; min-width: 80px; }
.detail-value { color: #2c3e50; font-size: 0.9rem; text-align: right; margin-left: 1rem; flex: 1; line-height: 1.4; }
.action-container { display: flex; justify-content: center; margin-top: 1.5rem; width: 100%; }

/* Media Queries (sin cambios, solo re-indentados) */
@media (max-width: 768px) {
  .boton-modificar, .boton-eliminar { padding: 8px 14px; font-size: 0.9rem; min-height: 38px; max-width: 140px; }
  .botones-adicionales-mobile { gap: 1rem; }
  .card-header { padding: 1rem; }
  .mes { font-size: 1rem; }
  .monto { font-size: 1rem; }
  .monto-estado { margin: 0 0.8rem; gap: 0.2rem; }
  .card-details { padding: 0 1rem 1rem 1rem; }
  .detail-row { margin-bottom: 0.9rem; }
  .first-detail { margin-top: 1rem; }
  .action-container { margin-top: 1.2rem; }
  /* Ajuste icono header en móvil */
  .vencimiento-icono-header { font-size: 1rem; }
}

@media (max-width: 380px) {
  .card-header { padding: 0.8rem; }
  .mes { font-size: 0.95rem; }
  .anio { font-size: 0.8rem; }
  .monto { font-size: 0.95rem; }
  .monto-estado { margin: 0 0.5rem; }
  .card-details { padding: 0 0.8rem 0.8rem 0.8rem; }
  .detail-label, .detail-value { font-size: 0.85rem; }
  .detail-row { margin-bottom: 0.8rem; }
  .first-detail { margin-top: 0.8rem; }
  .action-container { margin-top: 1rem; }
  .vencimiento-icono-header { font-size: 0.9rem; }
}
</style>