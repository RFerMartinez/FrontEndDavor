<template>
  <div class="contenedor-reclamos">
    <h1 class="titulo">RECLAMOS</h1>
    
    <button 
      v-if="!mostrarFormulario" 
      @click="mostrarFormulario = true"
      class="btn-nuevo izquierda"
    >
      Nuevo Reclamo
    </button>

    <!-- Componente NuevoReclamo con separación -->
    <NuevoReclamo 
      v-if="mostrarFormulario"
      @guardar="agregarReclamo"
      @cancelar="mostrarFormulario = false"
      class="componente-separado"
    />

    <!-- Componente ListaReclamos con cierre correcto -->
    <ListaReclamos 
      :reclamos="reclamos" 
      :class="{'con-espacio-superior': mostrarFormulario}"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ListaReclamos from '../CompReclamos/ListaReclamos.vue'
import NuevoReclamo from '../CompReclamos/NuevoReclamo.vue'
const reclamos = ref([
  { id: 234, fecha: '16/04/2025', hora: '21:32:00', descripcion: 'Aca iría todo el texto del reclamo para que se muestre en la tabla' },
  { id: 244, fecha: '02/06/2025', hora: '14:45:00', descripcion: '' }
])

const mostrarFormulario = ref(false)

const agregarReclamo = (nuevoReclamo) => {
  reclamos.value.unshift(nuevoReclamo)
  mostrarFormulario.value = false
}
</script>

<style scoped>
.contenedor-reclamos {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  max-width: 1100px;
  margin: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
  overflow-y: auto;
}

.titulo {
  font-size: 2rem;
  color: #e91e63;
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

.btn-nuevo {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  margin-bottom: 1.5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
  transition: background-color 0.3s;
}

.btn-nuevo:hover {
  background-color: #3aa876;
}
.componente-separado {
  margin-bottom: 1.5rem; /* Espacio debajo del formulario */
}

.con-espacio-superior {
  margin-top: 1rem; /* Espacio arriba de la tabla cuando hay formulario */
}
</style>