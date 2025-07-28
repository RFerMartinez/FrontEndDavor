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

function cerrarSesion() {
  // lógica de cierre de sesión
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95); /* más opaco */
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
}

.user-info {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 100%; /* ocupa todo el ancho */
  object-fit: contain;
  margin-bottom: 0.5rem;
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
