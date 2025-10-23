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

    <!-- Tabla con las cuotas - Ahora la paginación se maneja dentro de TablaCuotas -->
    <TablaCuotas 
      :cuotas="cuotasMostradas" 
      :elementos-por-pagina="6"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TablaCuotas from './TablaCuotas.vue'

// Función del servidor para obtener las cuotas (ferchu)
import { obtenerMisCuotas } from '@/api/services/cuotasService.js'

const cuotas = ref([])
const cargando = ref(true) //para mostrar un estado de carga

const mostrarSoloPendientes = ref(false)

// Llama a la API cuando el componente se monta
onMounted(async () => {
  cargando.value = true;
  // Llama a la función del servicio y guarda los datos en nuestro ref
  cuotas.value = await obtenerMisCuotas();
  cargando.value = false;
});

// Computed properties para la información de estado
const cuotasPendientes = computed(() => 
  cuotas.value.filter(cuota => !cuota.pagada).length
)

const cuotasPagadas = computed(() => 
  cuotas.value.filter(cuota => cuota.pagada).length
)

const cuotasMostradas = computed(() => 
  mostrarSoloPendientes.value 
    ? cuotas.value.filter(cuota => !cuota.pagada)
    : cuotas.value
)

// Métodos
const toggleFiltroPendientes = () => {
  mostrarSoloPendientes.value = !mostrarSoloPendientes.value
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
}
</style>