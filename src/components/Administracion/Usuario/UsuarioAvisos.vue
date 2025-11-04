<template>
  <div class="contenedor">
    <div class="encabezado">
      <Titulo texto="Avisos" />
      <p class="subtitulo">Ultimas novedades y noticias del gimnasio</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <span>Cargando avisos...</span>
    </div>

    <div v-else class="lista-avisos">
      <Aviso
        v-for="aviso in avisos"
        :key="aviso.id"
        :aviso="aviso"
        />
    </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Solo se necesita ref y onMounted
import Titulo from '../Titulo.vue';
import Aviso from '../Admin/Avisos/Aviso.vue'; 

// --- Refs de Estado ---
const avisos = ref([]);
const loading = ref(true);

// --- Refs de Modales Eliminados ---

// --- Simulación de API (JSON) ---
const simularAPI_Avisos = () => {
  console.log("Simulando llamada a API para obtener avisos...");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, descripcion: "Recordatorio: El gimnasio permanecerá cerrado el próximo lunes por feriado.", fecha: "03/11/2025", hora: "10:30" },
        { id: 2, descripcion: "¡Nueva clase de Funcional! Martes y Jueves a las 19:00 hs. ¡Anotate!", fecha: "01/11/2025", hora: "15:45" },
      ]);
    }, 800);
  });
};

const cargarAvisos = async () => {
  loading.value = true;
  try {
    const data = await simularAPI_Avisos(); 
    avisos.value = data;
  } catch (error) {
    // En lugar de mostrar un modal, solo se loguea el error
    console.error("Error al cargar los avisos:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(cargarAvisos);

// --- Toda la lógica de manejo de eventos (añadir, guardar, eliminar) 
// y los handlers de modales han sido eliminados ---

</script>

<style scoped>
/* Estilos del contenedor principal */
.contenedor {
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
  position: relative; /* Para el loader */
}

.encabezado {
  text-align: center;
  margin-bottom: 2rem;
}

.subtitulo {
  color: #666;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* Estilos .acciones-globales y .btn-anadir eliminados
*/

/* Contenedor de la lista de avisos */
.lista-avisos {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Espacio entre cada aviso */
}

/* Estilos de .loading-container, .spinner y @keyframes spin eliminados.
  Se asume que están en el CSS global.
*/

/* Responsive */
@media (max-width: 768px) {
  .contenedor {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .contenedor {
    padding: 1rem;
  }
  /* Reglas responsivas para .acciones-globales eliminadas 
  */
}
</style>