<template>
  <div class="contenedor-Suscripciones">
    <!-- Encabezado con información de alumnos -->
    <div class="encabezado-Suscpiciones">
      <h1 class="titulo">SUSCRIPCIONES</h1>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

</script>

<style scoped>
.contenedor-Suscripciones {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
}



.titulo {
  font-size: 2rem;
  color: #e91e63;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .contenedor-Suscripciones {
    padding: 1.5rem;
  }
  
  .titulo {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .contenedor-Suscripciones {
    padding: 1rem;
  }
  
  .titulo {
    font-size: 1.6rem;
  }
}
</style>