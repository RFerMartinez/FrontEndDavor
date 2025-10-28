<template>
  <div class="sidebar">
    <div class="logo-container">
      <img src="../../assets/logo.png" alt="Logo" class="logo" />
    </div>

    <nav class="menu">
      <!-- <button class="menu-btn dashboard-btn" @click="cambiarVista('dashboard')">
        <i class="fas fa-tachometer-alt icon"></i> <span>Dashboard</span>
      </button> -->

      <!-- <hr class="separator" /> -->

      <slot />

      <button class="menu-btn profile-btn" @click="cambiarVista('configurarPerfil')">
        <i class="fas fa-user-cog icon"></i> <span>Configurar Perfil</span>
      </button>
    </nav>

    <div class="user-info">
      <div class="avatar">
        <i class="fas fa-user"></i> </div>
      <div class="user-details">
        <span class="username">{{ nombre }} {{ apellido }}</span>
        <span class="role">{{ username }}</span>
        </div>
      <button class="logout-btn-small" @click="cerrarSesion" title="Cerrar sesión">
          <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUser } from '@/api/storage/userStorage'; // Asegúrate de tener este import

// Mantenemos la lógica para obtener el nombre y apellido
const nombre = ref('');
const apellido = ref('');
const username = ref('asd');

onMounted(() => {
  const usuario = getUser();
  if (usuario) {
    nombre.value = usuario.nombre;
    apellido.value = usuario.apellido;
    username.value = usuario.usuario; // <--- AGREGA esta línea (asegúrate que 'usuario' es el nombre correcto del campo)
  }
});

// Eventos que el componente puede emitir
const emit = defineEmits(['logout', 'cambiarVista']);

// Función para emitir el cambio de vista
function cambiarVista(vista) {
  emit('cambiarVista', vista);
}

// Función para emitir el logout
function cerrarSesion() {
  emit('logout');
}
</script>

<style scoped>
/* Estilos generales del Sidebar (ajustados) */
.sidebar {
  width: 260px; /* Un poco más angosto */
  height: 100vh;
  background: rgba(31, 41, 55, 0.8); /* Fondo gris oscuro semi-transparente */
  backdrop-filter: blur(15px); /* Efecto blur para el fondo */
  color: #e5e7eb; /* Color de texto claro */
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem; /* Ajuste de padding */
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1); /* Borde más sutil */
  z-index: 1000;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.3); /* Sombra más pronunciada */
}

/* Contenedor del logo */
.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  max-width: 80%;
  height: auto;
  max-height: 85px; /* Ajusta según tu logo */
}

/* Menú principal */
.menu {
  flex-grow: 1; /* Ocupa el espacio disponible */
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Espacio entre botones */
}

/* Estilo común para botones del menú */
.menu-btn {
  background: none;
  border: none;
  color: #d1d5db; /* Color de texto grisáceo */
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem; /* Ligeramente más pequeño */
  text-align: left;
  padding: 0.8rem 1rem; /* Padding ajustado */
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px; /* Bordes redondeados */
  font-weight: 500;
  width: 100%;
  display: flex; /* Para alinear icono y texto */
  align-items: center; /* Centrar verticalmente */
  gap: 0.8rem; /* Espacio entre icono y texto */
}

.menu-btn:hover {
  color: #ffffff; /* Texto blanco al pasar el mouse */
  background: #374151; /* Fondo gris oscuro al pasar */
}

.menu-btn.activo {
  background: linear-gradient(90deg, #a8161d 0%, #f81f2c 100%); /* Degradado rojo */
  color: #ffffff;
  font-weight: 400;
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3); /* Sombra más notoria */
}
.menu-btn.activo .icon {
  color: #ffffff;
}

.menu-btn .icon {
  width: 18px; /* Tamaño del icono */
  text-align: center;
  color: #9ca3af; /* Color gris para iconos */
  transition: color 0.2s ease;
}
.menu-btn:hover .icon {
  color: #ffffff;
}

/* Separador */
.separator {
  border: none;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.5); /* Más sutil */
  margin: 1rem 0; /* Espacio vertical */
}

/* Botón Configurar Perfil (lo colocamos al final del flex) */
.profile-btn {
  margin-top: auto; /* EMPUJA este botón hacia abajo */
}

/* Información del usuario (abajo) */
/* Información del usuario (abajo) */
.user-info {
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05); /* Fondo muy sutil */
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1); /* Borde sutil */
}

.avatar {
  width: 36px;
  height: 36px;
  background: #4b5563; /* Fondo del avatar */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e5e7eb;
  font-size: 1.1rem;
}
.avatar i { line-height: 1; } /* Ajuste para centrar FontAwesome */

.user-details {
  flex-grow: 1; /* Ocupa espacio */
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap; /* Evita que el nombre se parta */
  overflow: hidden;
  text-overflow: ellipsis; /* Añade ... si el nombre es muy largo */
  max-width: 130px; /* Limita el ancho máximo del nombre */
}

.role { /* Si añades el rol */
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Botón pequeño de cerrar sesión */
.logout-btn-small {
  background: none;
  border: none;
  color: #9ca3af; /* Color gris */
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: auto; /* Lo empuja a la derecha */
  transition: color 0.2s ease;
  line-height: 1; /* Ajuste para el icono */
}

.logout-btn-small:hover {
  color: #ffffff; /* Blanco al pasar el mouse */
}

:deep(.menu-btn) {
  background: none;
  border: none;
  color: #d1d5db; /* Color de texto grisáceo por defecto */
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem; 
  text-align: left;
  padding: 0.8rem 1rem; 
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px; 
  font-weight: 500;
  width: 100%;
  display: flex; 
  align-items: center; 
  gap: 0.8rem; /* Espacio entre icono (si existe) y texto */
}
:deep(.menu-btn:hover) {
  color: #ffffff; /* Texto blanco al pasar */
  background: rgba(255, 255, 255, 0.05); /* Fondo sutil al pasar */
}
/*rgba(31, 41, 55, 0.8)
/* 3. Estilo ACTIVO con degradado ROJO para TODOS los botones */
:deep(.menu-btn.activo) {
  background: linear-gradient(90deg, #a70b13 1%, rgba(31, 41, 55, 0.8) 60%); /* Degradado rojo */
  color: #ffffff;
  font-weight: 400;
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3); 
}
:deep(.menu-btn.activo .icon) { /* Icono activo también blanco */
  color: #ffffff;
}

/* Estilo para los iconos (si los tienen) */
:deep(.menu-btn .icon) {
  width: 18px; 
  text-align: center;
  color: #9ca3af; /* Icono gris por defecto */
  transition: color 0.2s ease;
}
:deep(.menu-btn:hover .icon) {
   color: #ffffff; /* Icono blanco al pasar */
}
</style>