<template>
  <div class="contenedor-alumnos">
    <!-- Encabezado con información de alumnos -->
    <div class="encabezado-alumnos">
      <h1 class="titulo">ALUMNOS</h1>
      
      <!-- Filtros de búsqueda -->
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
        
        <div class="filtros-turno">
          <button 
            class="btn-turno"
            :class="{ 'activo': filtroTurno === 'Mañana' }"
            @click="toggleTurno('Mañana')"
          >
            <i class="fas fa-sun"></i>
            Mañana
          </button>
          <button 
            class="btn-turno"
            :class="{ 'activo': filtroTurno === 'Tarde' }"
            @click="toggleTurno('Tarde')"
          >
            <i class="fas fa-moon"></i>
            Tarde
          </button>
        </div>
      </div>

      <div class="controles-superiores">
        <div class="estado-alumnos-sutil">
          <div class="info-alumno-sutil">
            <span class="numero-sutil">{{ alumnosFiltrados.length }}</span>
            <span class="texto-sutil">Mostrando</span>
          </div>
          <div class="separador"></div>
          <div class="info-alumno-sutil">
            <span class="numero-sutil activo">{{ alumnosActivos }}</span>
            <span class="texto-sutil">Activos</span>
          </div>
          <div class="separador"></div>
          <div class="info-alumno-sutil">
            <span class="numero-sutil inactivo">{{ alumnosInactivos }}</span>
            <span class="texto-sutil">Inactivos</span>
          </div>
        </div>

        <button 
          class="btn-filtrar"
          :class="{ 'activo': mostrarSoloActivos }"
          @click="toggleFiltroActivos"
          aria-label="Filtrar alumnos activos"
        >
          <i class="fas fa-filter"></i>
          <span class="btn-texto">Solo activos</span>
          <span class="btn-badge" v-if="mostrarSoloActivos">{{ alumnosActivos }}</span>
        </button>
      </div>
    </div>

    <!-- Tabla con los alumnos paginados -->
    <TablaAlumnos 
      :alumnos="alumnosPaginados" 
      @ver-detalles="verAlumno"
    />
    
    <!-- Mensaje cuando no hay resultados -->
    <div v-if="alumnosFiltrados.length === 0" class="sin-resultados">
      <i class="fas fa-search fa-2x"></i>
      <h3>No se encontraron alumnos</h3>
      <p>Intenta con otros términos de búsqueda o ajusta los filtros</p>
    </div>
    
    <!-- Controles de paginación inferiores -->
    <div class="paginacion-inferior" v-if="totalPaginas > 1 && alumnosFiltrados.length > 0">
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
            :key="numero"
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TablaAlumnos from './TablaAlumnos.vue'

import { obtenerTodosLosAlumnos } from '@/api/services/alumnoService' 
const alumnos = ref([]);    // Lista completa de alumnos
const loading = ref(false);  // Estado de carga
const console = ref(null);   // Referencia a la consola del navegador

onMounted(async () => {
  loading.value = true;
  try {
    const respuesta = await obtenerTodosLosAlumnos();
    alumnos.value = respuesta; // Asume que la respuesta tiene una propiedad 'data' con la lista de alumnos
  } catch (error) {
    console.error('Error al obtener los alumnos:', error);
  } finally {
    loading.value = false;
  }
})



const paginaActual = ref(1)
const elementosPorPagina = 10
const mostrarSoloActivos = ref(false)
const terminoBusqueda = ref('')
const filtroTurno = ref(null)

const emit = defineEmits(['verAlumno'])

// Función para normalizar texto (quitar tildes y convertir a minúsculas)
const normalizarTexto = (texto) => {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

// Computed properties para la información de estado
const alumnosActivos = computed(() => 
  alumnosFiltrados.value.filter(alumno => alumno.activo).length
)

const alumnosInactivos = computed(() => 
  alumnosFiltrados.value.filter(alumno => !alumno.activo).length
)

const alumnosFiltrados = computed(() => {
  let alumnosFiltrados = alumnos.value

  // Filtrar por término de búsqueda
  if (terminoBusqueda.value.trim()) {
    const termino = terminoBusqueda.value.trim()
    
    // Verificar si el término es numérico (posible DNI)
    const esBusquedaDNI = /^\d+$/.test(termino)
    
    alumnosFiltrados = alumnosFiltrados.filter(alumno => {
      if (esBusquedaDNI) {
        // Para búsqueda de DNI: buscar coincidencia exacta
        return alumno.dni === termino
      } else {
        // Para búsqueda de texto: normalizar y buscar coincidencias parciales
        const nombreNormalizado = normalizarTexto(alumno.nombre)
        const apellidoNormalizado = normalizarTexto(alumno.apellido)
        const terminoNormalizado = normalizarTexto(termino)
        
        return nombreNormalizado.includes(terminoNormalizado) ||
               apellidoNormalizado.includes(terminoNormalizado) ||
               `${nombreNormalizado} ${apellidoNormalizado}`.includes(terminoNormalizado)
      }
    })
  }

  // Filtrar por turno
  if (filtroTurno.value) {
    alumnosFiltrados = alumnosFiltrados.filter(alumno => alumno.turno === filtroTurno.value)
  }

  // Filtrar por estado activo
  if (mostrarSoloActivos.value) {
    alumnosFiltrados = alumnosFiltrados.filter(alumno => alumno.activo)
  }

  return alumnosFiltrados
})

const alumnosMostrados = computed(() => alumnosFiltrados.value)

// Computed properties para la paginación
const totalPaginas = computed(() => 
  Math.ceil(alumnosMostrados.value.length / elementosPorPagina)
)

const alumnosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * elementosPorPagina
  const fin = inicio + elementosPorPagina
  return alumnosMostrados.value.slice(inicio, fin)
})

const numerosPaginas = computed(() => {
  const total = totalPaginas.value
  const current = paginaActual.value
  const delta = 1
  
  let range = []
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }
  
  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < total - 1) {
    range.push('...')
  }
  
  range.unshift(1)
  if (total > 1) range.push(total)
  
  return range
})

// Métodos
const toggleFiltroActivos = () => {
  mostrarSoloActivos.value = !mostrarSoloActivos.value
  paginaActual.value = 1
}

const toggleTurno = (turno) => {
  if (filtroTurno.value === turno) {
    filtroTurno.value = null
  } else {
    filtroTurno.value = turno
  }
  paginaActual.value = 1
}

const aplicarFiltros = () => {
  paginaActual.value = 1
}

const limpiarBusqueda = () => {
  terminoBusqueda.value = ''
  paginaActual.value = 1
}

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina !== '...' && nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
    document.querySelector('.contenedor-alumnos').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  }
}

const verAlumno = (alumno) => {
  emit('verAlumno', alumno)
}
</script>

<style scoped>
.contenedor-alumnos {
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

/* Encabezado con información de alumnos */
.encabezado-alumnos {
  text-align: center;
  margin-bottom: 2rem;
}

.titulo {
  font-size: 2rem;
  color: #e91e63;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

/* Filtros de búsqueda */
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

.filtros-turno {
  display: flex;
  gap: 0.8rem;
}

.btn-turno {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #6c757d;
  white-space: nowrap;
}

.btn-turno:hover {
  border-color: #e91e63;
  color: #e91e63;
}

.btn-turno.activo {
  background: #e91e63;
  border-color: #e91e63;
  color: white;
}

.controles-superiores {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.estado-alumnos-sutil {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 12px;
  padding: 0.8rem 1.5rem;
  border: 1px solid #e9ecef;
  flex: 1;
}

.info-alumno-sutil {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  flex: 1;
}

.numero-sutil {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 0.3rem;
}

.numero-sutil.activo {
  color: #4caf50;
}

.numero-sutil.inactivo {
  color: #ff4d4d;
}

.texto-sutil {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.separador {
  width: 1px;
  height: 30px;
  background: linear-gradient(to bottom, transparent 0%, #dee2e6 50%, transparent 100%);
  margin: 0 0.5rem;
}

/* Botón de filtrar activos */
.btn-filtrar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  border: 2px solid #e91e63;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #e91e63;
  white-space: nowrap;
  position: relative;
}

.btn-filtrar:hover {
  background: #e3f2fd;
  transform: translateY(-1px);
}

.btn-filtrar.activo {
  background: #e91e63;
  color: white;
}

.btn-filtrar.activo:hover {
  background: #e91e63;
  transform: translateY(-1px);
}

.btn-texto {
  font-size: 0.85rem;
}

.btn-badge {
  background: #4caf50;
  color: white;
  border-radius: 12px;
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.3rem;
}

/* Mensaje sin resultados */
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

/* Paginación inferior */
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
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
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

/* Ajustes responsivos */
@media (max-width: 768px) {
  .contenedor-alumnos {
    padding: 1.5rem;
  }
  
  .titulo {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  .filtros-busqueda {
    flex-direction: column;
    gap: 1rem;
  }
  
  .busqueda-input-container {
    max-width: 100%;
    min-width: auto;
  }
  
  .filtros-turno {
    width: 100%;
    justify-content: center;
  }
  
  .btn-turno {
    flex: 1;
    justify-content: center;
  }
  
  .controles-superiores {
    flex-direction: column;
    gap: 1rem;
  }
  
  .estado-alumnos-sutil {
    padding: 0.7rem 1.2rem;
    width: 100%;
  }
  
  .info-alumno-sutil {
    padding: 0.4rem 0.8rem;
  }
  
  .numero-sutil {
    font-size: 1.1rem;
  }
  
  .texto-sutil {
    font-size: 0.7rem;
  }
  
  .separador {
    height: 25px;
  }
  
  .btn-filtrar {
    width: 100%;
    justify-content: center;
    padding: 0.6rem 1rem;
  }
  
  .paginacion-inferior {
    margin-top: 2rem;
    padding: 1rem;
  }
  
  .btn-paginacion {
    width: 35px;
    height: 35px;
    font-size: 0.8rem;
  }
  
  .numero-pagina {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .contenedor-alumnos {
    padding: 1rem;
  }
  
  .titulo {
    font-size: 1.6rem;
  }
  
  .filtros-busqueda {
    gap: 0.8rem;
  }
  
  .input-busqueda {
    padding: 0.7rem 0.9rem 0.7rem 2.8rem;
    font-size: 0.85rem;
  }
  
  .btn-turno {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
  
  .estado-alumnos-sutil {
    padding: 0.6rem 1rem;
  }
  
  .info-alumno-sutil {
    padding: 0.3rem 0.6rem;
  }
  
  .numero-sutil {
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }
  
  .texto-sutil {
    font-size: 0.65rem;
    letter-spacing: 0.2px;
  }
  
  .separador {
    height: 20px;
    margin: 0 0.3rem;
  }
  
  .btn-filtrar {
    padding: 0.5rem 0.8rem;
  }
  
  .btn-texto {
    font-size: 0.8rem;
  }
  
  .paginacion-inferior {
    margin-top: 1.5rem;
    padding: 0.8rem;
  }
  
  .paginacion-controles {
    gap: 0.6rem;
  }
  
  .btn-paginacion {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }
  
  .numero-pagina {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
  
  .numeros-pagina {
    gap: 0.3rem;
  }
}
</style>