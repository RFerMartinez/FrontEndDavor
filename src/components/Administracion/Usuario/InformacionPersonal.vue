<template>
  <div class="contenedor">
    
    <div class="wrapper-detalle-persona">
      <DetallePersona :datos="alumno" />
    </div>

    

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import DetallePersona from '../Admin/DetallePersona.vue';

import { obtenerDataCurrentUser } from '@/api/services/alumnoService';

// Estructura fija del alumno
const alumno = ref({});
const cargando = ref(true);
const errorCarga = ref(null);

// Cargar precios desde JSON al montar
const cargarPrecios = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    const res = await obtenerDataCurrentUser();
    alumno.value = res
  } catch (error) {
    console.error('Error cargando precios.json:', error);
    errorCarga.value = 'No se pudieron cargar las suscripciones.';
  } finally {
    cargando.value = false;
  }
};

onMounted(cargarPrecios);

</script>

<style scoped>
.contenedor {
padding: 2rem; 
background-color: rgba(255, 255, 255, 0.85); /* Fondo translúcido */
border-radius: 20px;
box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
overflow: hidden; 
width: 100%;
}

/* 5. Estilo para el wrapper de DetallePersona */
.wrapper-detalle-persona {
background: #ffffff; /* Fondo blanco sólido */
border-radius: 12px;
box-shadow: 0 4px 15px rgba(0,0,0,0.05);
overflow: hidden; /* Para que los bordes redondeados se apliquen */
}


/* Media query para dispositivos móviles */
@media (max-width: 768px) {
.contenedor {
width: 100%;
padding: 1.5rem;
margin: 0;
box-sizing: border-box;
}
}

@media (max-width: 480px) {
.contenedor {
padding: 1rem;
}
}
</style>