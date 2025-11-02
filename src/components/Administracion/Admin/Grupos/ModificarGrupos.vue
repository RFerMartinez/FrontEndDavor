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

    <div v-else class="lista-grupos" ref="listaGruposRef">
      <FilaModificarGrupo
        v-for="grupo in grupos"
        :key="grupo.nroGrupo"
        :grupo="grupo"
        @guardar-grupo="manejarGuardarGrupo"
        @eliminar-grupo="manejarEliminarGrupo"
      />
    </div>

    <Transition name="modal-fade">
      <div v-if="mostrarModalExito" class="modal-overlay">
        <div class="modal-exito">
          <div class="modal-header-exito">
            <i class="fas fa-check-circle"></i>
            <h3>¡Éxito!</h3>
          </div>
          <div class="modal-body-exito">
            <p>{{ mensajeModalExito }}</p>
          </div>
          <div class="modal-footer-exito">
            <button class="btn-modal-continuar" @click="handleContinuarExito">
              Continuar
            </button>
          </div>
        </div>
      </div>
    </Transition>
    
    <Transition name="modal-fade">
      <div v-if="mostrarModalError" class="modal-overlay">
        <div class="modal-error"> <div class="modal-header-error">
            <i class="fas fa-exclamation-triangle"></i> <h3>Error</h3>
          </div>
          <div class="modal-body-error">
            <p>{{ mensajeModalError }}</p> </div>
          <div class="modal-footer-error">
            <button class="btn-modal-error" @click="handleContinuarError">
              Entendido
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Titulo from '../../Titulo.vue';
import FilaModificarGrupo from './FilaModificarGrupo.vue'; 
const listaGruposRef = ref(null)
const grupos = ref([])
const loading = ref(true)

// ----- Refs para los Modales (Reemplaza al Toast) -----
const mostrarModalExito = ref(false);
const mensajeModalExito = ref('');
const mostrarModalError = ref(false);
const mensajeModalError = ref('');
// ----- Fin Refs Modales -----

import {
  obtenerHorariosCompletos,
  eliminarHorarioGrupo,
  crearHorarioGrupo,
  actualizarHorarioGrupo
} from '@/api/services/horarioService';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

onMounted(async () => {
  loading.value = true
  await sleep(500);
  try {
    const data = await obtenerHorariosCompletos(); 
    grupos.value = data;
  } catch (error) {
    console.error("Error al cargar los horarios desde la API:", error);
    // Mostramos el error en el modal al cargar la página
    mensajeModalError.value = error.response?.data?.detail || "No se pudieron cargar los grupos.";
    mostrarModalError.value = true;
  } finally {
    loading.value = false;
  }
})

const anadirNuevoGrupo = async() => {
  const maxNro = Math.max(0, ...grupos.value.map(g => parseInt(g.nroGrupo) || 0));
  
  const nuevoGrupo = {
    nroGrupo: String(maxNro + 1),
    horaInicio: '09:00:00', 
    horaFin: '10:00:00',  
    dias_asignados: [],
    _isNew: true 
  }

  grupos.value.push(nuevoGrupo)
  

  // --- INICIO: SCROLL AUTOMÁTICO ---
  // 1. Espera a que Vue actualice el DOM con la new fila
  await nextTick();

  // 2. Comprueba si la referencia al contenedor existe
  if (listaGruposRef.value) {
    // 3. Busca el último elemento hijo de la lista
    const ultimoElemento = listaGruposRef.value.lastElementChild;
    
    // 4. Si existe, haz scroll hacia él
    if (ultimoElemento) {
      ultimoElemento.scrollIntoView({
        behavior: 'smooth', // Para que sea un scroll suave
        block: 'center'     // Intenta centrarlo en la pantalla
      });
    }
  }
}

const manejarGuardarGrupo = async (grupoModificado) => {
  console.log('Recibido para guardar:', grupoModificado);
  // (loadingGuardar.value = true;)

  try {
    let mensaje = '';

    // --- LÓGICA DE CREAR (CREATE) ---
    if (grupoModificado._isNew) {
      const grupoParaCrear = { ...grupoModificado };
      delete grupoParaCrear._isNew; 
      delete grupoParaCrear.originalNroGrupo;

      const grupoCreado = await crearHorarioGrupo(grupoParaCrear);

      const index = grupos.value.findIndex(g => g._isNew && g.nroGrupo === grupoModificado.nroGrupo);
      if (index !== -1) {
        grupos.value[index] = grupoCreado; 
      }
      mensaje = 'Grupo añadido correctamente';

    // --- LÓGICA DE ACTUALIZAR (MODIFICADA) ---
    } else {
      const grupoParaGuardar = { ...grupoModificado };
      const grupoActualizado = await actualizarHorarioGrupo(grupoParaGuardar);

      const index = grupos.value.findIndex(g => g.nroGrupo === grupoModificado.originalNroGrupo);
      if (index !== -1) {
        grupos.value[index] = grupoActualizado;
      }
      mensaje = 'Grupo modificado correctamente';
    }
    
    // --- Reemplaza Toast por Modal de Éxito ---
    mensajeModalExito.value = mensaje;
    mostrarModalExito.value = true;

  } catch (error) {
    // --- Reemplaza Alert por Modal de Error ---
    console.error("Error al guardar el grupo:", error);
    const errorMsg = error.response?.data?.detail || 'No se pudo guardar el grupo.';
    
    mensajeModalError.value = errorMsg;
    mostrarModalError.value = true;
    // --- Fin Reemplazo ---
  } finally {
    // (loadingGuardar.value = false;)
  }
}


const manejarEliminarGrupo = async (grupoParaEliminar) => {
  console.log('Recibido para eliminar:', grupoParaEliminar.nroGrupo);

  if (grupoParaEliminar._isNew) {
    grupos.value = grupos.value.filter(g => g.nroGrupo !== grupoParaEliminar.nroGrupo);
    return;
  }

  // TODO: Reemplazar esto por tu modal de confirmación global
  if (!window.confirm(`¿Estás seguro de que quieres eliminar el grupo ${grupoParaEliminar.horaInicio} - ${grupoParaEliminar.horaFin}? Esta acción no se puede deshacer.`)) {
      return; 
  }

  try {
    const exito = await eliminarHorarioGrupo(grupoParaEliminar.nroGrupo);

    if (exito) {
      grupos.value = grupos.value.filter(g => g.nroGrupo !== grupoParaEliminar.nroGrupo);
      
      // --- Reemplaza Toast por Modal de Éxito ---
      mensajeModalExito.value = 'Grupo eliminado correctamente';
      mostrarModalExito.value = true;
    } else {
      throw new Error("El servidor no reportó un error, pero la eliminación falló.");
    }

  } catch (error) {
    // --- Reemplaza Alert por Modal de Error ---
    console.error("Error al eliminar el grupo:", error);
    const errorMsg = error.response?.data?.detail || 'Error desconocido al eliminar el grupo.';
    
    mensajeModalError.value = errorMsg;
    mostrarModalError.value = true;
    // --- Fin Reemplazo ---
  }
}

// ----- Funciones para cerrar los modales -----
const handleContinuarExito = () => {
  mostrarModalExito.value = false;
  // Opcional: podrías querer recargar la lista
  // onMounted(); 
}

const handleContinuarError = () => {
  mostrarModalError.value = false;
  // Opcional: recargar la lista para refrescar el estado
  // onMounted();
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
  position: relative; 
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
  background-color: #343a40; /* <-- CAMBIADO A GRIS OSCURO */
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
  background-color: #23272b; /* <-- CAMBIADO A GRIS MÁS OSCURO */
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
  border-left-color: #dc3545; 
  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.lista-grupos {
  display: flex;
  flex-direction: column;
  gap: 1rem; 
}

/* ----- ESTILOS DEL TOAST ELIMINADOS ----- */
/* (Ya no se usan) */

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

/* Los estilos de .modal-overlay, .modal-exito, .modal-error
  y .modal-fade se cargan desde el CSS GLOBAL.
*/
</style>