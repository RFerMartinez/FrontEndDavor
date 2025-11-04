<template>
  <div class="contenedor-personas">
    <div class="encabezado-personas">
      <Titulo texto="PERSONAS INTERESADAS" />
      <p class="subtitulo">Gestiona las personas registradas antes de su ingreso como alumnos</p>
      <div class="filtros-busqueda">
        <div class="busqueda-input-container">
          <i class="fas fa-search icono-busqueda"></i>
          <input
            v-model="terminoBusqueda"
            type="text"
            class="input-busqueda"
            placeholder="Buscar por DNI, nombre o apellido..."
            @input="aplicarFiltros"
          >
          <button
            v-if="terminoBusqueda"
            class="btn-limpiar-busqueda"
            @click="limpiarBusqueda"
            aria-label="Limpiar búsqueda"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 
      BLOQUE MODIFICADO:
      - Se eliminó el 'v-if' y el 'v-else-if' de "sin-resultados".
      - Se eliminó el 'div' de 'paginacion-inferior'.
      - La tabla ahora recibe la lista 'personasFiltradas' (completa).
      - La tabla recibe 'cargando', 'elementos-por-pagina' y 'loading-text'.
    -->
    <div> 
      <TablaAlumnos
        :alumnos="personasFiltradas"
        :cargando="loading"
        :elementos-por-pagina="elementosPorPagina"
        :loading-text="'Cargando personas...'"
        modo="personas"
        @realizarIngreso="emitVerIngreso"
        @eliminarPersona="manejarEliminarPersona" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import TablaAlumnos from '../Tablas y Filas/TablaAlumnosPersonas/TablaAlumnos.vue'; 
import Titulo from '../Titulo.vue';
import { filterItems } from '@/utils/formatters'; 

import {
  listarPersonas,
  eliminarPersona
} from '@/api/services/personaService';

const emit = defineEmits(['verIngreso']);

// --- Lógica de datos y filtros ---
const personas = ref([]);
const elementosPorPagina = 10; // Lo pasamos como prop
const terminoBusqueda = ref('');
const loading = ref(true); // MODIFICADO: Empezar en true
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const listarFromApi = async () => {
  loading.value = true; // (Ya está en true, pero es buena práctica)
  // await sleep(1000);
  try {
    const respuestaAlumnos = await listarPersonas();
    personas.value = respuestaAlumnos;
  } catch (error) {
    console.error('Error al cargar la información del alumno:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  listarFromApi();
});

const personasFiltradas = computed(() => {
  if (loading.value || !Array.isArray(personas.value)) { return []; } // Devuelve vacío si está cargando
  return filterItems(personas.value, terminoBusqueda.value);
});

// --- MÉTODOS DE FILTROS SIMPLIFICADOS ---
const aplicarFiltros = () => {
  // Ya no necesita resetear la página
};

const limpiarBusqueda = () => {
  terminoBusqueda.value = '';
};

// --- Emits y Handlers (Sin cambios) ---
const emitVerIngreso = (persona) => {
  emit('verIngreso', persona);
}

const manejarEliminarPersona = async (persona) => {
  if (confirm(`¿Estás seguro de eliminar a ${persona.nombre} ${persona.apellido}?`)) {
    try {
      await eliminarPersona(persona.dni);
    } catch (error) {
      console.error(`Error al eliminar DNI ${persona.dni}:`, error);
    } finally {
      listarFromApi();
      console.log("se eliminó correctamente a la persona:", persona.dni);
    }
  } else {
    console.log('Eliminación cancelada.');
  }
};
</script>

<style scoped>
/* ESTILOS LIMPIOS (SIN PAGINACIÓN NI "SIN RESULTADOS") */
.contenedor-personas {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  position: relative; /* <-- ESTO ES CLAVE, NO LO BORRES */
}
.encabezado-personas {
  text-align: center;
  margin-bottom: 2rem;
}

.subtitulo {
  color: #666;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  margin-bottom: 1.5rem;
}
.filtros-busqueda {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.busqueda-input-container {
  position: relative;
  flex: 1;
  max-width: 400px;
  min-width: 250px;
}
.icono-busqueda {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 2;
}
.input-busqueda {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: white;
  font-family: 'Poppins', sans-serif;
}
.input-busqueda:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}
.btn-limpiar-busqueda {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}
.btn-limpiar-busqueda:hover {
  background: #f8f9fa;
  color: #e91e63;
}

/* --- TODOS LOS ESTILOS DE PAGINACIÓN FUERON ELIMINADOS DE AQUÍ --- */

@media (max-width: 768px) {
  .contenedor-personas { padding: 1.5rem; }
  .filtros-busqueda { flex-direction: column; gap: 1rem; }
  .busqueda-input-container {
    position: relative;
    flex: 1;
    max-width: 400px;
    min-width: 300px;
  }
  /* Estilos de paginación eliminados */
}
@media (max-width: 480px) {
  .contenedor-personas { padding: 1rem; }
  .filtros-busqueda { gap: 0.8rem; }
  .input-busqueda { padding: 0.7rem 0.9rem 0.7rem 2.8rem; font-size: 0.85rem; }
  /* Estilos de paginación eliminados */
}
</style>
