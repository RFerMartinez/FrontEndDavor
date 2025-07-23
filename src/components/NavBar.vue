<template>
  <nav ref="navbar" class="navbar sticky-top bg-dark text-white p-3" id="navbar">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <a class="navbar-brand text-white" href="#">GIMNASIO Abito</a>

      <!-- Botones visibles en pantallas grandes -->
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
      <div class="d-flex flex-column align-items-end p-3">
        <a @click="irLogin('login')" class="btn btn-outline-light me-2">Iniciar Sesión</a>
        <a @click="irLogin('registro')" class="btn btn-danger">Registrarse</a>
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
</style>
