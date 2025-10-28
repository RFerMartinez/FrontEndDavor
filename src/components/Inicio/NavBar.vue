<template>
  <nav ref="navbar" class="navbar" id="navbar">
    <div class="nav-container">
      <!-- IZQUIERDA: Logo y navegación -->
      <div class="nav-left">
        <a class="nav-brand" href="#">
          <span class="brand-text">GIMNASIO</span>
          <span class="brand-accent">Abito</span>
        </a>
        
        <!-- Links de navegación desktop -->
        <div class="nav-links">
          <a href="#metodologias" class="nav-link">Metodologías</a>
          <a href="#precios" class="nav-link">Precios</a>
        </div>
      </div>

      <!-- DERECHA: Botones de acción -->
      <div class="nav-right">
        <button @click="irLogin('login')" class="btn btn-login">Iniciar Sesión</button>
        <button @click="irLogin('registro')" class="btn btn-primary">Registrarse</button>
      </div>

      <!-- Botón hamburguesa -->
      <button class="nav-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#mobileMenu">
        <span class="toggle-bar"></span>
        <span class="toggle-bar"></span>
        <span class="toggle-bar"></span>
      </button>
    </div>

    <!-- Menú móvil colapsable -->
    <div class="collapse navbar-collapse mobile-menu" id="mobileMenu">
      <div class="mobile-nav-content">
        <a href="#metodologias" class="mobile-nav-link">Metodologías</a>
        <a href="#precios" class="mobile-nav-link">Precios</a>
        <div class="mobile-actions">
          <button @click="irLogin('login')" class="btn btn-login mobile-btn">Iniciar Sesión</button>
          <button @click="irLogin('registro')" class="btn btn-primary mobile-btn">Registrarse</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const navbar = ref(null)
const router = useRouter()

// Efecto de scroll corregido
onMounted(() => {
  let lastScrollY = window.scrollY
  const navbarElement = navbar.value
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY
    
    if (navbarElement) {
      if (scrollY <= 100) {
        // Solo en la parte superior - navbar visible
        navbarElement.style.transform = 'translateY(0)'
        navbarElement.style.opacity = '1'
        navbarElement.style.visibility = 'visible'
      } else if (scrollY > lastScrollY) {
        // Scrolling hacia abajo - ocultar
        navbarElement.style.transform = 'translateY(-100%)'
        navbarElement.style.opacity = '0'
        navbarElement.style.visibility = 'hidden'
      } else {
        // Scrolling hacia arriba pero NO en la parte superior - mantener oculto
        if (scrollY > 100) {
          navbarElement.style.transform = 'translateY(-100%)'
          navbarElement.style.opacity = '0'
          navbarElement.style.visibility = 'hidden'
        }
      }
    }
    
    lastScrollY = scrollY
  })
})

function irLogin(modo) {
  router.push({ path: '/login', query: { modo } })
}
</script>

<style scoped>
/* NAVBAR PRINCIPAL */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(31, 41, 55, 0.15);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1000;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%; /* Cambiado de 1200px a 100% */
  margin: 0 auto;
  padding: 1rem 2rem; /* Mantenemos el padding vertical pero reducimos horizontal si es necesario */
  width: 100%;
  box-sizing: border-box;
}

/* IZQUIERDA - COMPLETAMENTE A LA IZQUIERDA */
.nav-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  margin: 0;
  padding: 0;
  gap: 3rem; /* Espacio entre logo y enlaces */
}

/* DERECHA - COMPLETAMENTE A LA DERECHA */
.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  margin: 0;
  padding: 0;
  gap: 1rem;
}

/* LOGO Y MARCA - PEGADO A LA IZQUIERDA */
.nav-brand {
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  margin-right: 0; /* Eliminamos el margen derecho */
}

.nav-brand:hover {
  transform: translateY(-1px);
}

.brand-text {
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
}

.brand-accent {
  color: #e50914;
  font-family: 'Poppins', sans-serif;
}

/* ENLACES DE NAVEGACIÓN */
.nav-links {
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #e50914, #ff4757);
  transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.nav-link:hover {
  color: #ffffff;
}

.nav-link:hover::after {
  width: 100%;
}

/* BOTONES DE ACCIÓN - PEGADOS A LA DERECHA */
.btn {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-decoration: none;
  display: inline-block;
  text-align: center;
  white-space: nowrap;
}

.btn-login {
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  border: 1.5px solid rgba(255, 255, 255, 0.2);
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #e50914, #ff4757);
  color: white;
  border: 1.5px solid transparent;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ff4757, #e50914);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.3);
}

/* BOTÓN HAMBURGUESA */
.nav-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  gap: 0.25rem;
}

.toggle-bar {
  width: 20px;
  height: 2px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  border-radius: 1px;
}

.nav-toggle:hover .toggle-bar {
  background: #e50914;
}

/* MENÚ MÓVIL */
.mobile-menu {
  background: rgba(15, 15, 15, 0.98);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.mobile-nav-content {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.mobile-nav-link:hover {
  color: #e50914;
  padding-left: 0.5rem;
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.mobile-btn {
  width: 100%;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .nav-container {
    padding: 1rem; /* En móvil mantenemos el padding normal */
  }
  
  .nav-links,
  .nav-right {
    display: none;
  }
  
  .nav-toggle {
    display: flex;
  }
  
  .nav-brand {
    font-size: 1.3rem;
  }
  
  .nav-left {
    flex: none;
    gap: 0; /* En móvil solo mostramos el logo */
  }
}

@media (min-width: 769px) {
  .nav-container {
    padding: 1rem 2rem; /* En desktop mantenemos el padding */
  }
  
  .mobile-menu {
    display: none;
  }
  
  .nav-toggle {
    display: none;
  }
}

/* Para pantallas muy grandes, podemos reducir el padding horizontal */
@media (min-width: 1400px) {
  .nav-container {
    padding: 1rem 3rem; /* Un poco más de padding en pantallas muy grandes */
  }
}

/* ANIMACIÓN PARA EL TOGGLE ACTIVO */
.navbar-collapse.show .nav-toggle .toggle-bar:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.navbar-collapse.show .nav-toggle .toggle-bar:nth-child(2) {
  opacity: 0;
}

.navbar-collapse.show .nav-toggle .toggle-bar:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* EFECTO GLASSMORPHISM MEJORADO */
.navbar.scrolled {
  background: rgba(15, 15, 15, 0.85);
  backdrop-filter: blur(15px) saturate(180%);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}
</style>