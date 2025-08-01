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
          Cuotas
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'reclamos' }"
          @click="vistaActiva = 'reclamos'"
        >
          Reclamos
        </button>
      </Sidebar>

      <div class="contenido">
        <Transition name="fade" mode="out-in">
          <component :is="vistaComponente" :key="vistaActiva" />
        </Transition>
      </div>
    </div>
  </Background>
</template>

<script setup>
import { ref, computed } from 'vue'
import Background from '@/components/Administracion/Background.vue'
import Sidebar from '@/components/Administracion/Sidebar.vue'

import InformacionPersonal from '@/components/Administracion/Usuario/InformacionPersonal.vue'
import Cuotas from '@/components/Administracion/Usuario/Cuotas.vue'
import Reclamos from '@/components/Administracion/Usuario/Reclamos.vue'

const usuario = {
  nombre: 'Juan',
  apellido: 'Pérez'
}

const vistaActiva = ref('informacion')

const vistaComponente = computed(() => {
  switch (vistaActiva.value) {
    case 'informacion':
      return InformacionPersonal
    case 'cuotas':
      return Cuotas
     case 'reclamos':
       return Reclamos
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

/* Animación fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
