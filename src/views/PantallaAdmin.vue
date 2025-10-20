<template>
  <Background>
    <div class="dashboard">
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
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'suscripciones' }"
          @click="cambiarVista('suscripciones')"
        >
          Suscripciones
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'trabajo' }"
          @click="cambiarVista('trabajo')"
        >
          Trabajos Metodologías
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'personas' }"
          @click="cambiarVista('personas')"
        >
          Personas
        </button>
        </Sidebar>

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
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'suscripciones' }"
          @click="cambiarVista('suscripciones')"
        >
          Suscripciones
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'trabajo' }"
          @click="cambiarVista('trabajo')"
        >
          Trabajos Metodologías
        </button>
         <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'personas' }"
          @click="cambiarVista('personas')"
        >
          Personas
        </button>
        </NavbarMobile>

      <<div class="contenido" :class="{ 'contenido-mobile': isMobile }">
        <Transition name="fade" mode="out-in">
          <component
            :is="vistaComponente"
            :key="vistaSecundaria ? (datosSecundarios?.id || datosSecundarios?.dni) : vistaActiva"
            :alumno-seleccionado="vistaSecundaria === 'infoAlumno' ? datosSecundarios : undefined"
            :persona="vistaSecundaria === 'ingresoPersona' ? datosSecundarios : undefined"
            @ver-alumno="verAlumno"
            @volver-alumnos="volverAlumnos"
            @verIngreso="verIngresoPersona"
            @volverPersonas="volverDesdeIngreso"
            @ingresoConfirmado="manejarIngresoConfirmado"
          />
          </Transition>
      </div>  
    </div>
  </Background>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
// Tus imports originales (SIN CAMBIOS)
import Background from '@/components/Administracion/Background.vue'
import Sidebar from '@/components/Administracion/Sidebar.vue'
import NavbarMobile from '@/components/Administracion/NavBarMobile.vue'
import InformacionPersonal from '@/components/Administracion/Usuario/InformacionPersonal.vue'
import Alumnos from '@/components/Administracion/Admin/Alumnos.vue'
import InfoAlumno from '@/components/Administracion/Admin/InfoAlumno.vue'
import Suscripciones from '@/components/Administracion/Admin/Suscripciones.vue'
import Trabajos_Metodologias from '@/components/Administracion/Admin/Trabajos_Metodologias.vue'
// *** ===================== NUEVO: Importar Personas e IngresoPersona ===================== ***
// *** USA TUS RUTAS CORRECTAS ***
import Personas from '@/components/Administracion/Admin/Personas.vue'
import IngresoPersona from '@/components/Administracion/Admin/IngresoPersona.vue'
// *****************************************************************************************

// Tus refs originales (SIN CAMBIOS)
const usuario = { nombre: 'Beto', apellido: 'Cristoff' };
const vistaActiva = ref('informacion'); // O la que prefieras como inicial
const isMobile = ref(false);
const alumnoSeleccionado = ref(null); // Lo mantenemos por InfoAlumno

// *** ===================== NUEVO: Refs para vista secundaria general ===================== ***
// Usaremos estos en lugar de 'alumnoSeleccionado' directamente para más flexibilidad
const vistaSecundaria = ref(null); // null, 'infoAlumno', 'ingresoPersona'
const datosSecundarios = ref(null); // Guarda el alumno o la persona
// *****************************************************************************************

// Tus funciones originales (SIN CAMBIOS)
const checkIsMobile = () => { isMobile.value = window.innerWidth <= 768; };
const cerrarSesion = () => { console.log('Cerrando sesión...'); };

const cambiarVista = (vista) => {
  vistaActiva.value = vista
  // Reseteamos la vista secundaria al cambiar la principal
  vistaSecundaria.value = null;
  datosSecundarios.value = null;
  // Mantenemos esto por compatibilidad si lo usas en otro lado
  alumnoSeleccionado.value = null;
}

// Función original para ver InfoAlumno (la adaptamos ligeramente)
const verAlumno = (alumno) => {
  // alumnoSeleccionado.value = alumno // Ya no es necesario si usamos datosSecundarios
  datosSecundarios.value = alumno;
  vistaSecundaria.value = 'infoAlumno'; // Indicamos qué vista secundaria mostrar
  vistaActiva.value = 'alumnos'; // Mantenemos la vista principal como 'alumnos' en segundo plano
}

// Función original para volver desde InfoAlumno (la adaptamos)
const volverAlumnos = () => {
  // vistaActiva.value = 'alumnos' // Ya no es necesario cambiar vistaActiva aquí
  vistaSecundaria.value = null; // Simplemente ocultamos la vista secundaria
  datosSecundarios.value = null;
  // alumnoSeleccionado.value = null; // Ya no es necesario
}

// *** ===================== NUEVO: Funciones para Personas/IngresoPersona ===================== ***
// 1. Mostrar IngresoPersona (llamado por @verIngreso de Personas)
const verIngresoPersona = (persona) => {
  datosSecundarios.value = persona;
  vistaSecundaria.value = 'ingresoPersona';
  vistaActiva.value = 'personas'; // Mantenemos 'personas' en segundo plano
}

// 2. Volver desde IngresoPersona (llamado por @volverPersonas de IngresoPersona)
const volverDesdeIngreso = () => {
  vistaSecundaria.value = null;
  datosSecundarios.value = null;
}

// 3. Manejar confirmación de ingreso
const manejarIngresoConfirmado = (datosIngreso) => {
  console.log("Ingreso confirmado en PantallaAdmin:", datosSecundarios.value?.dni, datosIngreso);
  // Lógica futura aquí...
  volverDesdeIngreso(); // Volver a la lista de personas
}
// *******************************************************************************************


// Tu computed original (adaptado para incluir vistaSecundaria y los nuevos componentes)
const vistaComponente = computed(() => {
  // Si hay una vista secundaria activa, la mostramos
  if (vistaSecundaria.value === 'infoAlumno') {
    return InfoAlumno;
  }
  if (vistaSecundaria.value === 'ingresoPersona') {
    return IngresoPersona;
  }

  // Si no, mostramos la vista principal según vistaActiva
  switch (vistaActiva.value) {
    case 'informacion': return InformacionPersonal;
    case 'alumnos': return Alumnos;
    // case 'infoAlumno': return InfoAlumno; // Ya no se maneja aquí
    case 'suscripciones': return Suscripciones;
    case 'trabajo': return Trabajos_Metodologias;
    case 'personas': return Personas; // Vista principal de Personas
    default: return InformacionPersonal;
  }
})

// Tus onMounted/onUnmounted originales (SIN CAMBIOS)
onMounted(() => { checkIsMobile(); window.addEventListener('resize', checkIsMobile); });
onUnmounted(() => { window.removeEventListener('resize', checkIsMobile); });
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