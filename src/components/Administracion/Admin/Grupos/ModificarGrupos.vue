<template>
  <div class="contenedor">
    <div class="encabezado">
      <Titulo texto="MODIFICAR GRUPOS" />
      <p class="subtitulo">Gestiona y cambia los horarios de los grupos y días</p>
    </div>

    <div class="acciones-globales">
      <button class="btn-anadir" @click="anadirNuevoGrupo">
        <i class="fas fa-plus-circle"></i> 
Añadir grupo
      </button>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <span>Cargando grupos...</span>
    </div>

    <div v-else class="lista-grupos">
      <FilaModificarGrupo
        v-for="grupo in grupos"
        :key="grupo.nroGrupo"
        :grupo="grupo"
        @guardar-grupo="manejarGuardarGrupo"
        @eliminar-grupo="manejarEliminarGrupo"
      />
    </div>

    </div>
</template>

<script setup>
// --- TU SCRIPT (SIN CAMBIOS) ---
import { ref, onMounted } from 'vue'
import Titulo from '../../Titulo.vue';
import FilaModificarGrupo from './FilaModificarGrupo.vue'; 

const grupos = ref([])
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  
  try {
    const response = await fetch('/data/grupos.json'); 
    if (!response.ok) {
      throw new Error(`Error al cargar el archivo: ${response.statusText}`);
    }
    const data = await response.json();
    grupos.value = data;

  } catch (error) {
    console.error("Error al cargar 'grupos.json':", error);
  } finally {
    loading.value = false;
  }
})

const anadirNuevoGrupo = () => {
  const maxNro = Math.max(0, ...grupos.value.map(g => parseInt(g.nroGrupo) || 0));
  
  const nuevoGrupo = {
    nroGrupo: String(maxNro + 1),
    horaInicio: '09:00:00', 
    horaFin: '10:00:00',   
    dias_asignados: [],
    _isNew: true 
  }

  grupos.value.push(nuevoGrupo)
}

const manejarGuardarGrupo = async (grupoModificado) => {
  console.log('Recibido para guardar:', grupoModificado)

  try {
    if (grupoModificado._isNew) {
      console.log('Llamada a API para CREAR:', grupoModificado)
      const index = grupos.value.findIndex(g => g._isNew && g.nroGrupo === grupoModificado.nroGrupo) // Busca por flag
      if (index !== -1) {
        delete grupoModificado._isNew
        grupos.value[index] = grupoModificado; 
      }

    } else {
      console.log('Llamada a API para ACTUALIZAR:', grupoModificado)
      // Al actualizar, buscamos por el nroGrupo original que estaba en props, 
      // por si el usuario cambió el nroGrupo en el input.
      const index = grupos.value.findIndex(g => g.nroGrupo === grupoModificado.originalNroGrupo);
      
      // Creamos una copia limpia sin el originalNroGrupo para guardar
      const grupoParaGuardar = { ...grupoModificado };
      delete grupoParaGuardar.originalNroGrupo;

      if (index !== -1) {
        grupos.value[index] = grupoParaGuardar;
      } else {
         // Fallback por si no lo encuentra (ej. se guardó un nuevo grupo y cambió nro)
         const idx = grupos.value.findIndex(g => g.nroGrupo === grupoModificado.nroGrupo);
         if (idx !== -1) grupos.value[idx] = grupoParaGuardar;
      }
    }
    
  } catch (error) {
    console.error("Error al guardar el grupo:", error)
  }
}


const manejarEliminarGrupo = (grupoParaEliminar) => {
  console.log('Recibido para eliminar:', grupoParaEliminar)
  
  if (grupoParaEliminar._isNew) {
    grupos.value = grupos.value.filter(g => g.nroGrupo !== grupoParaEliminar.nroGrupo)
    return;
  }
  
  alert(`Simulación: Eliminar Grupo ${grupoParaEliminar.nroGrupo}. (Programar API y modal)`)
  // grupos.value = grupos.value.filter(g => g.nroGrupo !== grupoParaEliminar.nroGrupo);
}
</script>

<style scoped>
/* --- ESTILOS CON COLORES CORREGIDOS --- */

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

.acciones-globales {
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-start; 
}

.btn-anadir {
  padding: 0.8rem 1.5rem;
  background-color: #dc3545; /* Rojo vibrante */
  color: white;
  border: none;
  border-radius: 8px; 
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.btn-anadir:hover {
  background-color: #c82333; /* Rojo más oscuro al hover */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
  color: #666;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #dc3545; /* Color del spinner (ROJO) */
  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.lista-grupos {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Espacio entre cada "ficha" */
}


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
  .acciones-globales {
    justify-content: stretch;
  }
  .btn-anadir {
    width: 100%;
    justify-content: center;
  }
}
</style>