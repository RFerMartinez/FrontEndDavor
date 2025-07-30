<template>
  <Background>
    <div class="dashboard">
      <Sidebar :nombre="usuario.nombre" :apellido="usuario.apellido" :vistaActiva="vistaActiva">
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'informacion' }"
          @click="vistaActiva = 'informacion'"
        >
          Información Personal
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'cuotas' }"
          @click="vistaActiva = 'cuotas'"
        >
          Cuotas Pendientes
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'pagos' }"
          @click="vistaActiva = 'pagos'"
        >
          Pagos
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'modificar' }"
          @click="vistaActiva = 'modificar'"
        >
          Modificar Datos
        </button>
      </Sidebar>

      <div class="contenido">
        <component :is="vistaComponente" />
      </div>
    </div>
  </Background>
</template>

<script setup>
import { ref, computed } from 'vue'
import Background from '@/components/Administracion/Background.vue'
import Sidebar from '@/components/Administracion/Sidebar.vue'

import InformacionPersonal from '@/components/Administracion/Usuario/InformacionPersonal.vue'
//import CuotasPendientes from '@/components/Usuario/CuotasPendientes.vue'
//import Pagos from '@/components/Usuario/Pagos.vue'
//import ModificarDatos from '@/components/Usuario/ModificarDatos.vue'

const usuario = {
  nombre: 'Juan',
  apellido: 'Pérez'
}

const vistaActiva = ref('informacion')

const vistaComponente = computed(() => {
  switch (vistaActiva.value) {
    case 'informacion':
      return InformacionPersonal
    //case 'cuotas':
      //return CuotasPendientes
    //case 'pagos':
      //return Pagos
    //case 'modificar':
      //return ModificarDatos
    default:
      return InformacionPersonal
  }
})

const props = defineProps({
  nombre: String,
  apellido: String,
  vistaActiva: String
})

</script>

<style scoped>
.dashboard {
  display: flex;
}

.contenido {
  margin-left: 250px;
  padding: 2rem;
  color: white;
  flex: 1;
  overflow-y: auto;
}

.menu-btn {
  background: none;
  border: none;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  text-align: left;
  padding: 0.5rem 0.9rem;
  cursor: pointer;
  transition: color 0.3s, background 0.3s;
  border-radius: 4px;
  font-weight: 500;
}

.menu-btn:hover {
  color: #ff4757;
  background: rgba(255, 255, 255, 0.05);
}
.menu-btn.activo {
  background: rgba(255, 255, 255, 0.1);
  color: #ff4757;
}
</style>
