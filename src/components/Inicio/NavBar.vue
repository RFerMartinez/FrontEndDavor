<template>
  <nav ref="navbar" class="navbar sticky-top bg-dark text-white p-3" id="navbar">
    <div class="container-fluid d-flex justify-content-between align-items-center">
  <!-- IZQUIERDA: Logo y navegación -->
      <div class="d-flex align-items-center">
        <a class="navbar-brand text-white me-5" href="#">GIMNASIO Abito</a>
        <!-- Links de navegación -->
        <div class="d-none d-md-flex gap-3">
          <a href="#metodologias" class="nav-link nav-item-link">Metodologías</a>
          <a href="#precios" class="nav-link nav-item-link">Precios</a>
        </div>
      </div>
      <div class="d-none d-md-block">
        <a @click="irLogin('login')" class="btn btn-outline-light me-2">Iniciar Sesión</a>
        <a @click="irLogin('registro')" class="btn btn-danger">Registrarse</a>
      </div>

      <!-- Botón hamburguesa -->
      <button class="navbar-toggler d-md-none border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mobileMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>

    <!-- Menú móvil colapsable (fuera del container-fluid, pero dentro del nav) -->
    <div class="collapse navbar-collapse d-md-none" id="mobileMenu">
      <div class="d-flex flex-column align-items-center p-3">
        <a href="#metodologias" class="nav-link text-white mb-2">Metodologías</a>
        <a href="#precios" class="nav-link text-white mb-3">Precios</a>
        <a @click="irLogin('login')" class="btn btn-outline-light mb-2 w-100">Iniciar Sesión</a>
        <a @click="irLogin('registro')" class="btn btn-danger w-100">Registrarse</a>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { onMounted, ref } from 'vue'

const navbar = ref(null)

onMounted(() => {
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

import { useRouter } from 'vue-router'

const router = useRouter()

function irLogin(modo) {
  router.push({ path: '/login', query: { modo } })
}
</script>

<style scoped>
#navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #111;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  z-index: 1000;
}

.navbar-toggler {
  filter: invert(1);
}

.nav-item-link {
  color: white;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem;
  transition: color 0.3s ease, border-bottom 0.3s ease;
  border-bottom: 2px solid transparent;
}

.nav-item-link:hover {
  color: #ff4757; /* rojo suave o el color de tu marca */
  border-bottom: 2px solid #ff4757;
}
</style>
