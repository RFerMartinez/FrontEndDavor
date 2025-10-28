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

    <div> <TablaAlumnos
        v-if="personasPaginadas && personasPaginadas.length > 0"
        :alumnos="personasPaginadas"
        modo="personas"
        @realizarIngreso="emitVerIngreso"
      />
      <div v-else-if="personasFiltradas?.length === 0" class="sin-resultados">
        <i class="fas fa-users fa-2x"></i>
        <h3>No se encontraron personas</h3>
        <p>Intenta con otros términos de búsqueda.</p>
      </div>
      <div class="paginacion-inferior" v-if="totalPaginas > 1 && personasFiltradas?.length > 0">
        <div class="paginacion-controles">
          <button
            class="btn-paginacion"
            :disabled="paginaActual === 1"
            @click="cambiarPagina(paginaActual - 1)"
            aria-label="Página anterior"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="numeros-pagina">
            <span
              v-for="numero in numerosPaginas"
              :key="numero.toString() + '-' + paginaActual"
              class="numero-pagina"
              :class="{ 'activa': numero === paginaActual }"
              @click="cambiarPagina(numero)"
            >
              {{ numero }}
            </span>
          </div>
          <button
            class="btn-paginacion"
            :disabled="paginaActual === totalPaginas"
            @click="cambiarPagina(paginaActual + 1)"
            aria-label="Página siguiente"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
// *** ASEGÚRATE QUE LA RUTA A TablaAlumnos SEA CORRECTA ***
import TablaAlumnos from './TablaAlumnos.vue'; // O la ruta correcta ej: '../Alumnos/TablaAlumnos.vue'
import Titulo from '../Titulo.vue';
// --- Importar la función de filtrado ---
import { filterItems } from '@/utils/formatters'; // Asegúrate que esta ruta es correcta

// *** +++++++ Definir el evento que se emitirá +++++++ ***
const emit = defineEmits(['verIngreso']);
// ******************************************************

// --- Lógica de datos, filtros y paginación ---
const personas = ref([]);

const paginaActual = ref(1);
const elementosPorPagina = 10;
const terminoBusqueda = ref('');



import { listarPersonas } from '@/api/services/personaService';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const loading = ref(false);

onMounted(async () => {
  loading.value = true

  await sleep(1000)

  try {
    const respuestaAlumnos = await listarPersonas()
    personas.value = respuestaAlumnos
  } catch (error) {
    console.error('Error al cargar la información del alumno:', error)
  } finally {
    loading.value = false
  }
})

// --- normalizarTexto ELIMINADA --- (Ahora está en formatters.js y la usa filterItems)
// const normalizarTexto = (texto) => { ... };

// --- personasFiltradas MODIFICADA para usar filterItems ---
const personasFiltradas = computed(() => {
  if (!Array.isArray(personas.value)) { return []; }

  // Llama a la función reutilizable.
  // No pasa filtros adicionales (tercer argumento) porque Personas no los necesita.
  return filterItems(personas.value, terminoBusqueda.value);
});
// --- FIN MODIFICACIÓN ---

const totalPaginas = computed(() => {
  const total = Math.ceil((personasFiltradas.value?.length || 0) / elementosPorPagina);
  return total > 0 ? total : 1;
});

const personasPaginadas = computed(() => {
  if (!Array.isArray(personasFiltradas.value)) return [];
  const inicio = (paginaActual.value - 1) * elementosPorPagina;
  const fin = inicio + elementosPorPagina;
  return personasFiltradas.value.slice(inicio, fin);
});

const numerosPaginas = computed(() => {
  const total = totalPaginas.value;
  if (!total || total === Infinity || total === 0) return [1];
  const current = paginaActual.value;
  const delta = 1;
  let range = [];
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }
  if (current - delta > 2) range.unshift('...');
  if (current + delta < total - 1) range.push('...');
  range.unshift(1);
  if (total > 1) range.push(total);
  // Filtrar duplicados (lógica sin cambios)
  return range.filter((item, index, arr) => {
      if (item === '...') {
          if (index === 1 && arr[0] === 1) return false;
          if (index === arr.length - 2 && arr[arr.length - 1] === total) return false;
          if (index > 0 && arr[index - 1] === '...') return false;
      }
      return true;
  });
});

const aplicarFiltros = () => {
  paginaActual.value = 1;
};

const limpiarBusqueda = () => {
  terminoBusqueda.value = '';
  paginaActual.value = 1;
};

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina !== '...' && nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina;
    const container = document.querySelector('.contenedor-personas');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

// *** +++++++ Función para emitir el evento (sin cambios) +++++++ ***
const emitVerIngreso = (persona) => {
  emit('verIngreso', persona);
}
// **************************************************

// --- Función para manejar eliminación (Añadida en la conversación anterior) ---
// (Asegúrate de que @eliminarPersona="manejarEliminarPersona" esté en tu <TablaAlumnos> en el template)
const manejarEliminarPersona = (persona) => {
  console.log("Personas.vue: Recibido evento para eliminar a:", persona);
  if (confirm(`¿Estás seguro de eliminar a ${persona.nombre} ${persona.apellido}?`)) {
      // --- Inicio: Lógica API Eliminación ---
      console.log(`Llamando a API para eliminar DNI: ${persona.dni}`);
      // Aquí llamarías a tu función API...
      // Y si tiene éxito, actualizas la lista local:
      // personas.value = personas.value.filter(p => p.dni !== persona.dni);
      // --- Fin: Lógica API Eliminación ---
  } else {
      console.log('Eliminación cancelada.');
  }
};

</script>

<style scoped>
/* ESTILOS (SIN CAMBIOS - Usa los que ya tenías) */
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
  position: relative;
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
.sin-resultados {
  text-align: center;
  padding: 3rem 2rem;
  color: #6c757d;
}
.sin-resultados i {
  margin-bottom: 1rem;
  color: #e9ecef;
}
.sin-resultados h3 {
  margin-bottom: 0.5rem;
  color: #495057;
}
.sin-resultados p {
  font-size: 0.9rem;
}
.paginacion-inferior {
  margin-top: 2.5rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  border: 1px solid #dee2e6;
  display: flex;
  justify-content: center;
  align-items: center;
}
.paginacion-controles {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.btn-paginacion {
  width: 40px;
  height: 40px;
  border: 2px solid #e91e63;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #e91e63;
  font-size: 0.9rem;
}
.btn-paginacion:hover:not(:disabled) {
  background: #e91e63;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
}
.btn-paginacion:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #ccc;
  color: #ccc;
}
.numeros-pagina {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}
.numero-pagina {
  width: 35px;
  height: 35px;
  border: 2px solid #dee2e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #6c757d;
  font-size: 0.85rem;
}
.numero-pagina:hover {
  border-color: #e91e63;
  color: #e91e63;
  transform: scale(1.05);
}
.numero-pagina.activa {
  background: #e91e63;
  border-color: #e91e63;
  color: white;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .contenedor-personas { padding: 1.5rem; }
  .filtros-busqueda { flex-direction: column; gap: 1rem; }
  .busqueda-input-container { max-width: 100%; min-width: auto; }
  .paginacion-inferior { margin-top: 2rem; padding: 1rem; }
  .btn-paginacion { width: 35px; height: 35px; font-size: 0.8rem; }
  .numero-pagina { width: 30px; height: 30px; font-size: 0.8rem; }
}
@media (max-width: 480px) {
  .contenedor-personas { padding: 1rem; }
  .filtros-busqueda { gap: 0.8rem; }
  .input-busqueda { padding: 0.7rem 0.9rem 0.7rem 2.8rem; font-size: 0.85rem; }
  .paginacion-inferior { margin-top: 1.5rem; padding: 0.8rem; }
  .paginacion-controles { gap: 0.6rem; }
  .btn-paginacion { width: 32px; height: 32px; font-size: 0.75rem; }
  .numero-pagina { width: 28px; height: 28px; font-size: 0.75rem; }
  .numeros-pagina { gap: 0.3rem; }
}
</style>