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
          @click="cambiarVista('informacion')"
        >
          Información Personal
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'alumnos' }"
          @click="cambiarVista('alumnos')"
        >
          Alumnos
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
          :class="{ activo: vistaActiva === 'alumnos' }"
          @click="cambiarVista('alumnos')"
        >
          Alumnos
        </button>
      </NavbarMobile>

      <div class="contenido" :class="{ 'contenido-mobile': isMobile }">
        <Transition name="fade" mode="out-in">
          <component 
            :is="vistaComponente" 
            :key="vistaActiva + (alumnoSeleccionado ? alumnoSeleccionado.dni : '')"
            :alumno-seleccionado="alumnoSeleccionado"
            @ver-alumno="verAlumno"
            @volver-alumnos="volverAlumnos"
          />
        </Transition>
      </div>
    </div>
  </Background>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Background from '@/components/Administracion/Background.vue'
import Sidebar from '@/components/Administracion/Sidebar.vue'
import NavbarMobile from '@/components/Administracion/NavBarMobile.vue'
import InformacionPersonal from '@/components/Administracion/Usuario/InformacionPersonal.vue'
import Alumnos from '@/components/Administracion/Admin/Alumnos.vue'
import InfoAlumno from '@/components/Administracion/Admin/InfoAlumno.vue'

const usuario = {
  nombre: 'Beto',
  apellido: 'Cristoff'
}

const vistaActiva = ref('informacion')
const isMobile = ref(false)
const alumnoSeleccionado = ref(null)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const cambiarVista = (vista) => {
  vistaActiva.value = vista
  alumnoSeleccionado.value = null // Resetear alumno seleccionado al cambiar vista
}

const verAlumno = (alumno) => {
  alumnoSeleccionado.value = alumno
  vistaActiva.value = 'infoAlumno'
}

const volverAlumnos = () => {
  vistaActiva.value = 'alumnos'
  alumnoSeleccionado.value = null
}

const cerrarSesion = () => {
  console.log('Cerrando sesión...')
}

const vistaComponente = computed(() => {
  switch (vistaActiva.value) {
    case 'informacion': return InformacionPersonal
    case 'alumnos': return Alumnos
    case 'infoAlumno': return InfoAlumno
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