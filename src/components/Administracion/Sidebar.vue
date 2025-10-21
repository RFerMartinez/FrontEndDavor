<template>
  <div class="sidebar">
    <!-- Info del usuario -->
    <div class="user-info">
      <img src="../../assets/logo.png" alt="Logo" class="logo" />
      <p class="username">{{ nombre }} {{ apellido }}</p>
    </div>

    <!-- Botones personalizados (recibidos por slot) -->
    <nav class="menu">
      <slot />
    </nav>

    <!-- Botón cerrar sesión MEJORADO -->
    <button class="logout-btn" @click="cerrarSesion">
      <span>Cerrar sesión</span>
      <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    </button>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
// 1. Importa la función para obtener los datos del usuario
import { getUser } from '@/api/storage/userStorage';

const emit = defineEmits(['logout']);

// 2. Crea variables reactivas para el nombre y el apellido
const nombre = ref('');
const apellido = ref('');

// 3. Cuando el componente se monta, carga los datos del usuario
onMounted(() => {
  const usuario = getUser();
  if (usuario) {
    nombre.value = usuario.nombre;
    apellido.value = usuario.apellido;
  }
});

function cerrarSesion() {
  emit('logout');
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem 1.5rem;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.user-info {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 100%;
  object-fit: contain;
  margin-bottom: 1rem;
  max-height: 80px;
}

.username {
  font-size: 1.3rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Inter', sans-serif;
}

.menu {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: stretch;
}

/* ESTILOS ESPECÍFICOS PARA BOTONES DE SIDEBAR */
.menu >>> .menu-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  text-align: left;
  padding: 1rem 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  font-weight: 500;
  width: 100%;
}

.menu >>> .menu-btn:hover {
  color: #e50914;
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

.menu >>> .menu-btn.activo {
  background: rgba(229, 9, 20, 0.15);
  color: #e50914;
  box-shadow: 0 2px 12px rgba(229, 9, 20, 0.2);
}

/* BOTÓN CERRAR SESIÓN MEJORADO - SIN CAMBIO DE COLOR */
.logout-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  padding: 1.1rem 1.5rem;
  font-size: 1.1rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.logout-icon {
  width: 18px;
  height: 18px;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.logout-btn:hover .logout-icon {
  opacity: 1;
  transform: translateX(2px);
}
</style>