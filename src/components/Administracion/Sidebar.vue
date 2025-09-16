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

    <!-- Botón cerrar sesión -->
    <button class="logout-btn" @click="cerrarSesion">Cerrar sesión</button>
  </div>
</template>

<script setup>
const props = defineProps({
  nombre: String,
  apellido: String
})

const emit = defineEmits(['logout'])

function cerrarSesion() {
  emit('logout')
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.user-info {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 100%;
  object-fit: contain;
  margin-bottom: 0.5rem;
  max-height: 80px;
}

.username {
  font-size: 1.1rem;
  font-weight: 500;
}

.menu {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
}

/* ESTILOS ESPECÍFICOS PARA BOTONES DE SIDEBAR */
.menu >>> .menu-btn {
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
  width: 100%;
}

.menu >>> .menu-btn:hover {
  color: #ff4757;
  background: rgba(255, 255, 255, 0.05);
}

.menu >>> .menu-btn.activo {
  background: rgba(255, 255, 255, 0.1);
  color: #ff4757;
}

.logout-btn {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 0.5rem;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>