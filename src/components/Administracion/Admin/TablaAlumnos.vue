<template>
  <div class="tabla-container" :class="{ 'mobile': isMobile }">
    <table v-if="!isMobile" class="tabla-alumnos">
      <thead>
        <tr v-if="modo === 'alumnos'">
          <th class="col-dni">DNI</th>
          <th class="col-nombre">NOMBRE COMPLETO</th>
          <th class="col-cuotas">CUOTAS PENDIENTES</th>
          <th class="col-estado-alumno">ESTADO</th>
          <th class="col-acciones">ACCIONES</th>
        </tr>
        <tr v-else-if="modo === 'personas'">
          <th class="col-dni">DNI</th>
          <th class="col-nombre-personas">NOMBRE COMPLETO</th>
          <th class="col-acciones-personas">ACCIONES</th>
        </tr>
      </thead>
      <tbody>
        <FilaAlumno
          v-for="(item, index) in alumnos" :key="index"
          :alumno="item" :is-mobile="isMobile"
          :modo="modo"
          @verDetalles="$emit('verDetalles', item)"
          @realizarIngreso="$emit('realizarIngreso', item)"
          @eliminarPersona="$emit('eliminarPersona', item)" /> </tbody>
    </table>

    <div v-else class="mobile-view">
      <FilaAlumno
        v-for="(item, index) in alumnos"
        :key="index"
        :alumno="item"
        :is-mobile="isMobile"
        :modo="modo"
        @verDetalles="$emit('verDetalles', item)"
        @realizarIngreso="$emit('realizarIngreso', item)"
        @eliminarPersona="$emit('eliminarPersona', item)" /> </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import FilaAlumno from './FilaAlumno.vue'; // Ajusta la ruta

defineProps({
  alumnos: Array,
  modo: {
    type: String,
    default: 'alumnos',
    validator: (value) => ['alumnos', 'personas'].includes(value)
  }
});

// Emitimos los tres posibles eventos
defineEmits(['verDetalles', 'realizarIngreso', 'eliminarPersona']); // NUEVO EVENTO AÑADIDO

const isMobile = ref(false);
const checkIsMobile = () => { isMobile.value = window.innerWidth <= 768; };
onMounted(() => { checkIsMobile(); window.addEventListener('resize', checkIsMobile); });
onUnmounted(() => { window.removeEventListener('resize', checkIsMobile); });
</script>

<style scoped>
/* Estilos sin cambios */
.tabla-container { background-color: rgba(255, 255, 255, 0.95); border-radius: 16px; padding: 1.5rem; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); width: 100%; margin: 0; overflow-x: auto; font-family: 'Poppins', sans-serif; box-sizing: border-box; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.5); }
.tabla-alumnos { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 0.95rem; min-width: 600px; }
.tabla-alumnos th { text-align: center; padding: 0.75rem 0.5rem; color: #2c3e50; font-weight: 700; font-size: 0.9rem; border-bottom: 2px solid #e1e8ed; background-color: #f8fafc; position: sticky; top: 0; text-transform: uppercase; letter-spacing: 0.5px; height: 60px; box-sizing: border-box; vertical-align: middle; }
/* Anchos modo alumnos */
.tabla-alumnos th.col-dni { width: 15%; }
.tabla-alumnos th.col-nombre { width: 35%; text-align: left; padding-left: 1.5rem !important; }
.tabla-alumnos th.col-cuotas { width: 15%; padding-right: 1.5rem !important; text-align: right;}
.tabla-alumnos th.col-estado-alumno { width: 15%; }
.tabla-alumnos th.col-acciones { width: 20%; }
/* Anchos modo personas */
.tabla-alumnos th.col-nombre-personas { width: 55%; text-align: left; padding-left: 1.5rem !important; }
.tabla-alumnos th.col-acciones-personas { width: 30%; }
.mobile-view { width: 100%; display: flex; flex-direction: column; gap: 1rem; }
@media (max-width: 768px) { .tabla-container { padding: 1rem; border-radius: 12px; } .mobile-view { gap: 0.8rem; } }
@media (max-width: 480px) { .tabla-container { padding: 0.8rem; } }
</style>