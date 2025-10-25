<template>
  <div class="contenedor">
    <DetallePersona :datos="alumno" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DetallePersona from '../Admin/DetallePersona.vue'; // Asegúrate que la ruta sea correcta

// Estructura fija del alumno
const alumno = ref({
  "dni": "45104930",
  "nombre": "Davor",
  "apellido": "Cristoff",
  "sexo": "M",
  "email": "davorcristoff04@gmail.com",
  "telefono": "3731573465",
  "activo": true,
  "cuotasPendientes": 3,
  "turno": "Tarde",
  "suscripcion": "3 días a la semana",
  "trabajoactual": "Musculación",
  "nivel": "3",
  "provincia": "Chaco",
  "localidad": "Resistencia",
  "Calle": "Republica Checa", // <-- Ajustado a "Calle" (mayúscula) para coincidir con DetallePersona.vue
  "nro": "305"
});

// Lógica de isMobile (onMounted, onUnmounted, checkIsMobile) eliminada porque ya no se usa en el template
</script>

<style scoped>
.contenedor {
  padding: 2rem; /* <-- RESTAURADO: Padding general */
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  /* max-width: 900px; */ /* <-- Eliminado para que ocupe el ancho */
  /* margin: auto; */ /* <-- Eliminado para que no se centre */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  overflow: hidden; /* Mantenido para contener bordes de DetallePersona */
  width: 100%;
}

/* El estilo del título se elimina porque el h2 está comentado/eliminado */
/* .titulo { ... } */


/* Media query para dispositivos móviles */
@media (max-width: 768px) {
  .contenedor {
    width: 100%; /* Asegura ancho completo */
    padding: 1.5rem; /* <-- RESTAURADO: Padding mediano */
    margin: 0; /* Asegura que no haya margen auto */
    box-sizing: border-box; /* Asegura que el padding no desborde */
  }
}

@media (max-width: 480px) {
  .contenedor {
     padding: 1rem; /* <-- RESTAURADO: Padding pequeño */
  }
}
</style>