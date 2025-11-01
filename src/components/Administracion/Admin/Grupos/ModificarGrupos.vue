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

    <Transition name="toast-fade">
      <div v-if="mensajeExito" class="toast-exito">
        <i class="fas fa-check-circle"></i>
        <span>{{ mensajeExito }}</span>
      </div>
    </Transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Titulo from '../../Titulo.vue';
import FilaModificarGrupo from './FilaModificarGrupo.vue'; 

const grupos = ref([])
const loading = ref(true)

// ----- INICIO: AÑADIDO (Lógica del Toast) -----
const mensajeExito = ref('');
let timerExito = null;

/**
 * Muestra un mensaje de éxito sutil (toast) por 3 segundos.
 * @param {string} mensaje El texto a mostrar.
 */
function mostrarMensajeExito(mensaje) {
  mensajeExito.value = mensaje;
  // Limpia el timer anterior si existía
  if (timerExito) {
    clearTimeout(timerExito);
  }
  // Crea un nuevo timer
  timerExito = setTimeout(() => {
    mensajeExito.value = '';
  }, 3000); // Desaparece después de 3 segundos
}
// ----- FIN: AÑADIDO -----

import { obtenerHorariosCompletos, eliminarHorarioGrupo } from '@/api/services/horarioService';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

onMounted(async () => {
  loading.value = true
  await sleep(500);
  try {
    const data = await obtenerHorariosCompletos(); 
    grupos.value = data;
  } catch (error) {
    console.error("Error al cargar los horarios desde la API:", error);
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
    let mensaje = ''; // Mensaje por defecto
    if (grupoModificado._isNew) {
      console.log('Llamada a API para CREAR:', JSON.stringify(grupoModificado, null, 2))
      const index = grupos.value.findIndex(g => g._isNew && g.nroGrupo === grupoModificado.nroGrupo)
      if (index !== -1) {
        delete grupoModificado._isNew
        grupos.value[index] = grupoModificado; 
      }
      mensaje = 'Grupo añadido correctamente';

    } else {
      console.log('Llamada a API para ACTUALIZAR:', JSON.stringify(grupoModificado, null, 2))
      const index = grupos.value.findIndex(g => g.nroGrupo === grupoModificado.originalNroGrupo);
      
      const grupoParaGuardar = { ...grupoModificado };
      delete grupoParaGuardar.originalNroGrupo;

      if (index !== -1) {
        grupos.value[index] = grupoParaGuardar;
      } else {
        const idx = grupos.value.findIndex(g => g.nroGrupo === grupoModificado.nroGrupo);
        if (idx !== -1) grupos.value[idx] = grupoParaGuardar;
      }
      mensaje = 'Grupo modificado correctamente';
    }
    
    // ----- AÑADIDO: Mostrar Toast -----
    mostrarMensajeExito(mensaje);

  } catch (error) {
    console.error("Error al guardar el grupo:", error)
    // TODO: Aquí podrías llamar a mostrarMensajeExito con un color de error
  }
}

// const manejarEliminarGrupo = (grupoParaEliminar) => {
//   console.log('Recibido para eliminar:', JSON.stringify(grupoParaEliminar, null, 2))
//   alert(JSON.stringify(grupoParaEliminar, null, 2))
  
//   if (grupoParaEliminar._isNew) {
//     grupos.value = grupos.value.filter(g => g.nroGrupo !== grupoParaEliminar.nroGrupo)
//     return;
//   }
  
//   // ----- REEMPLAZO DE 'alert' -----
//   // TODO: Añadir modal de confirmación aquí
  
//   // Simulación de éxito de borrado:
//   grupos.value = grupos.value.filter(g => g.nroGrupo !== grupoParaEliminar.nroGrupo);
//   mostrarMensajeExito('Grupo eliminado correctamente');
// }


const manejarEliminarGrupo = async (grupoParaEliminar) => {
  console.log('Recibido para eliminar:', grupoParaEliminar.nroGrupo);

  // Si es un grupo "nuevo" (creado en la UI, no en DB), solo lo borra localmente.
  if (grupoParaEliminar._isNew) {
    grupos.value = grupos.value.filter(g => g.nroGrupo !== grupoParaEliminar.nroGrupo);
    return;
  }

  // ----- REEMPLAZO DE 'alert' y 'TODO' -----
  // 1. Confirmación simple (puedes reemplazar esto por tu modal)
  if (!window.confirm(`¿Estás seguro de que quieres eliminar el grupo ${grupoParaEliminar.horaInicio} - ${grupoParaEliminar.horaFin}? Esta acción no se puede deshacer.`)) {
      return; // El usuario canceló
  }

  // 2. Llamada a la API (reemplaza la simulación)
  try {
    // (Opcional: puedes poner un estado de 'cargando' aquí si lo deseas)
    
    const exito = await eliminarHorarioGrupo(grupoParaEliminar.nroGrupo);

    // 3. Si la API responde con éxito (true / 204)
    if (exito) {
      // Actualiza la lista local (elimina el grupo de la UI)
      grupos.value = grupos.value.filter(g => g.nroGrupo !== grupoParaEliminar.nroGrupo);
      mostrarMensajeExito('Grupo eliminado correctamente');
    } else {
      // Esto no debería ocurrir si la API lanza un error, pero es un fallback
      alert('Hubo un problema, pero el servidor no reportó un error.');
    }

  } catch (error) {
    // 4. Manejo de errores de la API (ej. 404, 400, 500)
    console.error("Error al eliminar el grupo:", error);
    const errorMsg = error.response?.data?.detail || 'Error desconocido al eliminar el grupo.';
    
    // Muestra el error de la API (puedes usar tu modal de error aquí)
    alert(`Error: ${errorMsg}`); 
    // O si tienes una función: mostrarMensajeError(errorMsg);
  
  } finally {
     // (Opcional: quitar el estado de 'cargando' si lo pusiste)
  }
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
  /* Necesario para que el toast (si es absolute) se posicione bien */
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
  background-color: #4CAF50; 
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
  background-color: #388E3C; 
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

/* ----- INICIO: AÑADIDO (Estilos del Toast) ----- */
.toast-exito {
  position: fixed; /* Flota sobre todo */
  top: 80px; /* Debajo de tu header principal */
  right: 20px;
  background-color: #28a745; /* Verde éxito */
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Animación para el toast */
.toast-fade-enter-active {
  transition: all 0.3s ease-out;
}
.toast-fade-leave-active {
  transition: all 0.4s ease-in;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
/* ----- FIN: AÑADIDO ----- */


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
  /* Ajusta el toast en móviles */
  .toast-exito {
    top: 10px;
    right: 10px;
    left: 10px;
    text-align: center;
    justify-content: center;
  }
}
</style>