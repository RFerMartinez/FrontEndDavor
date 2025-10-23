<template>
  <tr v-if="!isMobile" class="fila-alumno desktop-view">
    <template v-if="modo === 'alumnos'">
      <td class="col-dni">
        <div class="dni-container">{{ alumno.dni }}</div>
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
    </template>

    <template v-else-if="modo === 'personas'">
      <td class="col-dni">
        <div class="dni-container">{{ alumno.dni }}</div>
      </td>
      <td class="col-nombre-personas">
        <div class="nombre-container">
          <div class="nombre-completo">{{ alumno.nombre }} {{ alumno.apellido }}</div>
        </div>
      </td>
      <td class="col-acciones-personas">
        <div class="acciones-container acciones-personas">
          <button class="btn-ingreso" @click="realizarIngreso">
            <i class="fas fa-user-plus"></i>
            Realizar Ingreso
          </button>
          <button class="btn-eliminar-persona" @click="eliminarPersona">
            <i class="fas fa-trash"></i>
            Eliminar
          </button>
        </div>
        </td>
    </template>
  </tr>

  <div v-else class="alumno-card mobile-view" :class="{ 'expandida': expandida, 'activo': modo === 'alumnos' && alumno.activo }">
    <template v-if="modo === 'alumnos'">
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
    </template>

    <template v-else-if="modo === 'personas'">
       <div class="card-header-personas">
         <div class="info-basica">
           <div class="dni-mobile">{{ alumno.dni }}</div>
           <div class="nombre-mobile">{{ alumno.nombre }} {{ alumno.apellido }}</div>
         </div>
         <div class="acciones-personas-mobile">
            <button class="btn-ingreso-mobile" @click="realizarIngreso">
              <i class="fas fa-user-plus"></i>
              Ingreso
            </button>
             <button class="btn-eliminar-persona-mobile" @click="eliminarPersona">
              <i class="fas fa-trash"></i>
              Eliminar
            </button>
         </div>
       </div>
       </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Estado from '../Estado.vue'; // Ajusta la ruta

const props = defineProps({
  alumno: Object,
  isMobile: Boolean,
  modo: {
    type: String,
    default: 'alumnos'
  }
});

// Emitimos los tres eventos
const emit = defineEmits(['verDetalles', 'realizarIngreso', 'eliminarPersona']); // NUEVO EVENTO

const expandida = ref(false);

const toggleExpandida = () => {
  if (props.modo === 'alumnos') {
    expandida.value = !expandida.value;
  }
};

const verDetalles = () => {
  emit('verDetalles', props.alumno);
};

const realizarIngreso = () => {
  emit('realizarIngreso', props.alumno);
};

// --- NUEVA FUNCIÓN PARA ELIMINAR ---
const eliminarPersona = () => {
  // Aquí puedes añadir una confirmación si quieres (ej: window.confirm)
  // if (window.confirm(`¿Seguro que deseas eliminar a ${props.alumno.nombre} ${props.alumno.apellido}? Esta acción no se puede deshacer.`)) {
       console.log('Emitiendo eliminarPersona para:', props.alumno);
       emit('eliminarPersona', props.alumno);
       // COMENTARIO: Aquí iría la llamada a la API para eliminar la persona
       // Ejemplo: deletePersonaAPI(props.alumno.dni).then(...).catch(...);
  // }
};
// --- FIN NUEVA FUNCIÓN ---

</script>

<style scoped>
/* ==================== ESTILOS DESKTOP ==================== */
.fila-alumno.desktop-view { height: 60px; border-bottom: 1px solid #eaeaea; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 0.95rem; transition: all 0.2s ease; background-color: white; }
.fila-alumno.desktop-view:hover { background-color: #f8f9fa; }
.fila-alumno.desktop-view td { vertical-align: middle; padding: 0.5rem; height: 60px; box-sizing: border-box; }
.dni-container, .nombre-container, .estado-container, .cuotas-container, .acciones-container { display: flex; align-items: center; height: 100%; }

/* --- MODO ALUMNOS (Desktop) --- */
.col-dni { text-align: center; }
.dni-container { justify-content: center; font-weight: 600; color: #2c3e50; }
.col-nombre { text-align: left; padding-left: 1.5rem !important; }
.nombre-container { justify-content: flex-start; }
.nombre-completo { font-weight: 600; color: #2c3e50; font-size: 1rem; }
.col-cuotas { text-align: right; padding-right: 1.5rem !important; }
.cuotas-container { justify-content: flex-end; }
.cuotas-pendientes { font-weight: 700; font-size: 0.9rem; padding: 0.3rem 0.7rem; border-radius: 15px; min-width: 25px; text-align: center; display: inline-block; background-color: #fce4ec; color: #d81b60; }
.cuotas-pendientes.ninguna { background-color: #e8f5e9; color: #388e3c; }
.col-estado-alumno { text-align: center; }
.estado-container { justify-content: center; }
.col-acciones { text-align: center; }
.acciones-container { justify-content: center; } /* Centra el botón Detalles */
.btn-info { padding: 0.5rem 1rem; background: linear-gradient(135deg, #f8f9fa, #e9ecef); color: #495057; border: 1px solid #dee2e6; border-radius: 6px; cursor: pointer; transition: all 0.3s ease; font-size: 0.9rem; font-weight: 500; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
.btn-info:hover { background: linear-gradient(135deg, #e9ecef, #dee2e6); transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-color: #adb5bd; }

/* --- MODO PERSONAS (Desktop) --- */
.col-nombre-personas { text-align: left; padding-left: 1.5rem !important; }
.col-acciones-personas { text-align: center; }
/* V V V Contenedor modificado para MODO PERSONAS V V V */
.acciones-container.acciones-personas {
  justify-content: center; /* Centra los botones horizontalmente */
  gap: 0.8rem; /* Espacio entre botones */
}
/* ^ ^ ^ Fin contenedor modificado ^ ^ ^ */
.btn-ingreso { padding: 0.5rem 1rem; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; transition: all 0.3s ease; font-size: 0.9rem; font-weight: 500; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
.btn-ingreso:hover { background: #388E3C; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); }

/* V V V NUEVO BOTÓN ELIMINAR (Desktop) V V V */
.btn-eliminar-persona {
  padding: 0.5rem 1rem;
  background: #f44336; /* Rojo */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.btn-eliminar-persona:hover {
  background: #D32F2F; /* Rojo más oscuro */
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
/* ^ ^ ^ FIN NUEVO BOTÓN ^ ^ ^ */


/* ==================== ESTILOS MÓVIL ==================== */
.alumno-card.mobile-view { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden; width: 100%; transition: all 0.3s ease; border-left: 4px solid #ccc; }
.alumno-card.mobile-view.activo { border-left-color: #47d147; }
.alumno-card.mobile-view:not(.activo) { border-left-color: #ff4d4d; }
.alumno-card.mobile-view[modo="personas"] { border-left: none; }

/* --- MODO ALUMNOS (Móvil) --- */
.card-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; cursor: pointer; width: 100%; box-sizing: border-box; transition: background-color 0.2s ease; }
.card-header:hover { background-color: #f5f5f5; }
.info-basica { display: flex; flex-direction: column; flex: 1; min-width: 0; /* Para evitar overflow con nombres largos */ }
.dni-mobile { font-weight: 600; font-size: 0.9rem; color: #616161; margin-bottom: 0.3rem; }
.nombre-mobile { font-weight: 700; font-size: 1rem; color: #212121; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; /* Evitar overflow */ }
.estado-cuotas-mobile { display: flex; flex-direction: column; align-items: flex-end; margin: 0 0.8rem; gap: 0.3rem; flex-shrink: 0; /* Evitar que se achique */ }
.cuotas-mobile { font-weight: 600; font-size: 0.8rem; color: #d81b60; white-space: nowrap; }
.cuotas-mobile.ninguna { color: #388e3c; }
.expand-icon { color: #757575; font-size: 0.9rem; transition: transform 0.3s ease; flex-shrink: 0; }
.alumno-card.mobile-view.expandida .expand-icon { transform: rotate(180deg); }
.slide-enter-active { animation: slideDown 0.4s ease-out; }
.slide-leave-active { animation: slideUp 0.25s ease-in; }
@keyframes slideDown { from { max-height: 0; opacity: 0; transform: translateY(-10px); } to { max-height: 250px; opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { max-height: 250px; opacity: 1; transform: translateY(0); } to { max-height: 0; opacity: 0; transform: translateY(-10px); } }
.card-details { padding: 0 1rem 1rem 1rem; width: 100%; box-sizing: border-box; overflow: hidden; }
.detail-row { display: flex; justify-content: space-between; margin-bottom: 0.8rem; width: 100%; align-items: center; }
.detail-label { font-weight: 600; color: #616161; font-size: 0.9rem; min-width: 100px; }
.detail-value { color: #212121; font-size: 0.9rem; text-align: right; flex: 1; }
.cuotas-detalle { font-weight: 700; font-size: 1rem; color: #d81b60; padding: 0.3rem 0.7rem; border-radius: 12px; background-color: #fce4ec; min-width: 25px; text-align: center; display: inline-block; }
.cuotas-detalle.ninguna { color: #388e3c; background-color: #e8f5e9; }
.action-container { display: flex; justify-content: center; margin-top: 1.2rem; width: 100%; }
.btn-info-mobile { padding: 0.7rem 1.2rem; background: linear-gradient(135deg, #f8f9fa, #e9ecef); color: #495057; border: 1px solid #dee2e6; border-radius: 6px; cursor: pointer; transition: all 0.3s ease; font-size: 0.85rem; font-weight: 500; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
.btn-info-mobile:hover { background: linear-gradient(135deg, #e9ecef, #dee2e6); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-color: #adb5bd; }

/* --- MODO PERSONAS (Móvil) --- */
.card-header-personas { display: flex; justify-content: space-between; align-items: center; padding: 1rem; width: 100%; box-sizing: border-box; }
/* V V V Contenedor modificado para MODO PERSONAS (Móvil) V V V */
.acciones-personas-mobile {
  display: flex; /* Alinear botones horizontalmente */
  gap: 0.6rem; /* Espacio entre botones */
  margin-left: 0.8rem;
  flex-shrink: 0; /* Evitar que se achiquen */
}
/* ^ ^ ^ Fin contenedor modificado ^ ^ ^ */
.btn-ingreso-mobile { padding: 0.6rem 1rem; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; transition: all 0.3s ease; font-size: 0.8rem; font-weight: 500; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); white-space: nowrap; }
.btn-ingreso-mobile:hover { background: #388E3C; }

/* V V V NUEVO BOTÓN ELIMINAR (Móvil) V V V */
.btn-eliminar-persona-mobile {
  padding: 0.6rem 1rem;
  background: #f44336; /* Rojo */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}
.btn-eliminar-persona-mobile:hover {
  background: #D32F2F; /* Rojo más oscuro */
}
/* ^ ^ ^ FIN NUEVO BOTÓN ^ ^ ^ */


/* Media queries adicionales */
@media (max-width: 768px) {
  .card-header, .card-header-personas { padding: 0.8rem; }
  .dni-mobile { font-size: 0.85rem; }
  .nombre-mobile { font-size: 0.95rem; }
  .estado-cuotas-mobile { margin: 0 0.6rem; gap: 0.2rem; }
  .cuotas-mobile { font-size: 0.75rem; }
  .card-details { padding: 0 0.8rem 0.8rem 0.8rem; }
  .detail-row { margin-bottom: 0.7rem; }
  .detail-label { font-size: 0.85rem; min-width: 90px; }
  .detail-value { font-size: 0.85rem; }
  .action-container { margin-top: 1rem; }
  .btn-ingreso-mobile, .btn-eliminar-persona-mobile { padding: 0.5rem 0.8rem; font-size: 0.75rem; } /* Ajuste tamaño botones */
}

@media (max-width: 380px) {
  .card-header, .card-header-personas { padding: 0.7rem; }
  .dni-mobile { font-size: 0.8rem; }
  .nombre-mobile { font-size: 0.9rem; }
  .estado-cuotas-mobile { margin: 0 0.5rem; }
  .cuotas-mobile { font-size: 0.7rem; }
  .card-details { padding: 0 0.7rem 0.7rem 0.7rem; }
  .detail-label { font-size: 0.8rem; min-width: 80px; }
  .detail-value { font-size: 0.8rem; }
  .btn-ingreso-mobile, .btn-eliminar-persona-mobile { padding: 0.5rem 0.7rem; gap: 0.3rem; }
  .btn-ingreso-mobile i, .btn-eliminar-persona-mobile i { display: none; } /* Ocultar icono si no cabe */
}
</style>