<template>
  <div class="contenedor">
    
    </div>
</template>

<script setup>
import { ref } from 'vue';

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