<template>
  <div class="contenedor-cuotas">
    <!-- Encabezado con información de cuotas - Versión sutil -->
    <div class="encabezado-cuotas">
      <h1 class="titulo">CUOTAS</h1>
      
      <div class="controles-superiores">
        <div class="estado-cuotas-sutil">
          <div class="info-cuota-sutil">
            <span class="numero-sutil">{{ cuotas.length }}</span>
            <span class="texto-sutil">Total</span>
          </div>
          <div class="separador"></div>
          <div class="info-cuota-sutil">
            <span class="numero-sutil pendiente">{{ cuotasPendientes }}</span>
            <span class="texto-sutil">Pendientes</span>
          </div>
          <div class="separador"></div>
          <div class="info-cuota-sutil">
            <span class="numero-sutil pagada">{{ cuotasPagadas }}</span>
            <span class="texto-sutil">Pagadas</span>
          </div>
        </div>

        <button 
          class="btn-filtrar"
          :class="{ 'activo': mostrarSoloPendientes }"
          @click="toggleFiltroPendientes"
          aria-label="Filtrar cuotas pendientes"
        >
          <i class="fas fa-filter"></i>
          <span class="btn-texto">Solo pendientes</span>
          <span class="btn-badge" v-if="mostrarSoloPendientes">{{ cuotasPendientes }}</span>
        </button>
      </div>
    </div>

    <!-- Tabla con las cuotas paginadas -->
    <TablaCuotas :cuotas="cuotasPaginadas" />
    
    <!-- Controles de paginación inferiores - Solo navegación -->
    <div class="paginacion-inferior" v-if="totalPaginas > 1">
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
import { ref, computed } from 'vue'
import TablaCuotas from '../TablaCuota/TablaCuotas.vue'

const cuotas = [
  {
    mes: "Junio",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: false
  },
  {
    mes: "Mayo",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: false
  },
  {
    mes: "Abril",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Marzo",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Febrero",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Enero",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Junio",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: false
  },
  {
    mes: "Mayo",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: false
  },
  {
    mes: "Abril",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Marzo",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Febrero",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Enero",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Junio",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: false
  },
  {
    mes: "Mayo",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: false
  },
  {
    mes: "Abril",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Marzo",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Febrero",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Enero",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  }
]

const paginaActual = ref(1)
const elementosPorPagina = 6
const mostrarSoloPendientes = ref(false)

// Computed properties para la información de estado
const cuotasPendientes = computed(() => 
  cuotas.filter(cuota => !cuota.pagada).length
)

const cuotasPagadas = computed(() => 
  cuotas.filter(cuota => cuota.pagada).length
)

const cuotasMostradas = computed(() => 
  mostrarSoloPendientes.value 
    ? cuotas.filter(cuota => !cuota.pagada)
    : cuotas
)

// Computed properties para la paginación
const totalPaginas = computed(() => 
  Math.ceil(cuotasMostradas.value.length / elementosPorPagina)
)

const cuotasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * elementosPorPagina
  const fin = inicio + elementosPorPagina
  return cuotasMostradas.value.slice(inicio, fin)
})

const numerosPaginas = computed(() => {
  const total = totalPaginas.value
  const current = paginaActual.value
  const delta = 1 // Número de páginas a mostrar alrededor de la actual
  
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
const toggleFiltroPendientes = () => {
  mostrarSoloPendientes.value = !mostrarSoloPendientes.value
  paginaActual.value = 1 // Resetear a la primera página al cambiar filtro
}

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina !== '...' && nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
    // Scroll suave al principio del contenedor
    document.querySelector('.contenedor-cuotas').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  }
}
</script>

<style scoped>
.contenedor-cuotas {
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

/* Encabezado con información de cuotas - Versión sutil */
.encabezado-cuotas {
  text-align: center;
  margin-bottom: 2rem;
}

.titulo {
  font-size: 2rem;
  color: #e91e63;
  margin-bottom: 1.2rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.controles-superiores {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.estado-cuotas-sutil {
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

.info-cuota-sutil {
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

.numero-sutil.pendiente {
  color: #ff4d4d;
}

.numero-sutil.pagada {
  color: #4caf50;
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

/* Botón de filtrar pendientes */
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
  background: #fce4ec;
  transform: translateY(-1px);
}

.btn-filtrar.activo {
  background: #e91e63;
  color: white;
}

.btn-filtrar.activo:hover {
  background: #d81b60;
  transform: translateY(-1px);
}

.btn-texto {
  font-size: 0.85rem;
}

.btn-badge {
  background: #ff4d4d;
  color: white;
  border-radius: 12px;
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.3rem;
}

/* Paginación inferior - Solo navegación */
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

/* Ajustes responsivos */
@media (max-width: 768px) {
  .contenedor-cuotas {
    padding: 1.5rem;
  }
  
  .titulo {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  .controles-superiores {
    flex-direction: column;
    gap: 1rem;
  }
  
  .estado-cuotas-sutil {
    padding: 0.7rem 1.2rem;
    width: 100%;
  }
  
  .info-cuota-sutil {
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
  .contenedor-cuotas {
    padding: 1rem;
  }
  
  .titulo {
    font-size: 1.6rem;
  }
  
  .estado-cuotas-sutil {
    padding: 0.6rem 1rem;
  }
  
  .info-cuota-sutil {
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