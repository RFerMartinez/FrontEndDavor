<template>
  <Background>
    <div class="dashboard">
      <!-- Sidebar para desktop -->
      <Sidebar
        v-if="!isMobile"
        :nombre="usuario.nombre"
        :apellido="usuario.apellido"
        @logout="cerrarSesion"
      >
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

      <!-- Navbar para móviles -->
      <NavbarMobile
        v-else
        :nombre="usuario.nombre"
        :apellido="usuario.apellido"
        @logout="cerrarSesion"
      >
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'informacion' }"
          @click="cambiarVista('informacion')"
        >
          Información Personal
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'cuotas' }"
          @click="cambiarVista('cuotas')"
        >
          Cuotas
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'reclamos' }"
          @click="cambiarVista('reclamos')"
        >
          Reclamos
        </button>
      </NavbarMobile>

      <div class="contenido" :class="{ 'contenido-mobile': isMobile }">
        <Transition name="fade" mode="out-in">
          <component :is="vistaComponente" :key="vistaActiva" />
        </Transition>
      </div>
    </div>
  </Background>
</template>

<script setup>
// Imports ferchu :)
import { useRouter } from 'vue-router'; // Importa useRouter
import { logout } from '@/api/services/authService'; // Importa la función de logout

import { ref, computed, onMounted, onUnmounted } from 'vue'
import Background from '@/components/Administracion/Background.vue'
import Sidebar from '@/components/Administracion/Sidebar.vue'
import NavbarMobile from '@/components/Administracion/NavBarMobile.vue'
import InformacionPersonal from '@/components/Administracion/Usuario/InformacionPersonal.vue'
import Cuotas from '@/components/Administracion/Usuario/Cuotas.vue'
import Reclamos from '@/components/Administracion/Usuario/Reclamos.vue'




// FER ------------------------------
const router = useRouter(); // Obtén la instancia del router
const cerrarSesion = () => {
  logout(); // Llama a la función de logout que limpia el localStorage
  router.push('/'); // Redirige al login
};
// Fin Fer ---------------------------



const usuario = {
  nombre: 'Juan',
  apellido: 'Pérez'
}

const vistaActiva = ref('informacion')
const isMobile = ref(false)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const cambiarVista = (vista) => {
  vistaActiva.value = vista
}

const vistaComponente = computed(() => {
  switch (vistaActiva.value) {
    case 'informacion': return InformacionPersonal
    case 'cuotas': return Cuotas
    case 'reclamos': return Reclamos
    default: return InformacionPersonal
  }
})

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.contenido {
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
  min-height: 100vh;
  width: calc(100% - 250px);
  display: flex;
  flex-direction: column;
}

.contenido-mobile {
  margin-left: 0;
  padding-top: 5rem;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (min-width: 1200px) {
  .contenido {
    padding: 2rem 3rem;
  }
}

@media (max-width: 768px) {
  .contenido {
    padding: 1rem;
    width: 100%;
  }
  
  .contenido-mobile {
    padding: 1rem;
    padding-top: 5rem;
  }
}
</style>