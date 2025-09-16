<template>
  <nav ref="navbar" class="navbar sticky-top bg-dark text-white p-3" id="navbar">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <!-- IZQUIERDA: Logo -->
      <div class="d-flex align-items-center">
        <a class="navbar-brand text-white me-5" href="#">GIMNASIO Abito</a>
      </div>

      <!-- Botón hamburguesa -->
      <button 
        class="navbar-toggler d-md-none border-0" 
        type="button" 
        @click="toggleMenu"
        :class="{ collapsed: !menuAbierto }"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>

    <!-- Contenedor unificado para overlay y menú -->
    <div class="menu-wrapper" :class="{ open: menuAbierto, closing: isClosing }">
      <!-- Overlay de fondo -->
      <div class="menu-overlay" @click="closeMenu"></div>
      
      <!-- Menú móvil colapsable -->
      <div class="mobile-menu-container">
        <div class="mobile-menu">
          <div class="user-info">
            <p class="username">{{ nombre }} {{ apellido }}</p>
          </div>
          
          <!-- Slot para los botones del menú -->
          <div class="menu-opciones" @click="cerrarMenuSiEsLink">
            <slot />
          </div>
          
          <button class="logout-btn" @click="$emit('logout')">Cerrar sesión</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  nombre: String,
  apellido: String
})

const emit = defineEmits(['logout'])

const navbar = ref(null)
const menuAbierto = ref(false)
const isClosing = ref(false)

const toggleMenu = () => {
  if (menuAbierto.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

const openMenu = () => {
  isClosing.value = false
  menuAbierto.value = true
}

const closeMenu = () => {
  if (menuAbierto.value) {
    isClosing.value = true
    setTimeout(() => {
      menuAbierto.value = false
      isClosing.value = false
    }, 400) // Duración de la animación
  }
}

// Cerrar menú cuando se hace clic en un botón del menú
const cerrarMenuSiEsLink = (event) => {
  if (event.target.classList.contains('menu-btn')) {
    closeMenu()
  }
}

// Cerrar menú con la tecla Escape
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuAbierto.value) {
      closeMenu()
    }
  })
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY
    if (navbar.value) {
      if (scrollY <= 100) {
        navbar.value.style.transform = 'translateY(0)'
        navbar.value.style.opacity = '1'
        navbar.value.style.visibility = 'visible'
      } else {
        navbar.value.style.transform = 'translateY(-100%)'
        navbar.value.style.opacity = '0'
        navbar.value.style.visibility = 'hidden'
      }
    }
  })
})
</script>

<style scoped>
#navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  z-index: 1000;
}

.navbar-toggler {
  filter: invert(1);
}

.menu-wrapper {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 1000;
  /* Inicialmente oculto */
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s ease;
}

.menu-wrapper.open {
  opacity: 1;
  visibility: visible;
}

.menu-wrapper.closing {
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s ease;
}

/* Overlay de fondo oscuro */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  transition: background-color 0.4s ease;
  z-index: 999;
}

.menu-wrapper.open .menu-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.menu-wrapper.closing .menu-overlay {
  background-color: rgba(0, 0, 0, 0);
  transition: background-color 0.4s ease;
}

/* Contenedor del menú móvil */
.mobile-menu-container {
  position: relative;
  z-index: 1000;
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
  overflow: hidden;
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-wrapper.open .mobile-menu-container {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}

.menu-wrapper.closing .mobile-menu-container {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Estilos del menú */
.mobile-menu {
  background-color: #212529;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0);
  margin: 10px 15px;
}

.user-info {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.username {
  font-size: 1.1rem;
  font-weight: 500;
  color: white;
}

.menu-opciones {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

/* Estilos para los botones que vienen del slot */
.menu-opciones >>> .menu-btn {
  background: none;
  border: none;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  text-align: left;
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
  font-weight: 500;
  width: 100%;
}

.menu-opciones >>> .menu-btn:hover {
  color: #ff4757;
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

.menu-opciones >>> .menu-btn.activo {
  background: rgba(255, 255, 255, 0.1);
  color: #ff4757;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.2);
}

.logout-btn {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 0.7rem;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Responsive */
@media (min-width: 769px) {
  .navbar {
    display: none;
  }
  
  .menu-wrapper {
    display: none;
  }
}
</style>