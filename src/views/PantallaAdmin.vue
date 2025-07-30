<template>
  <Background>
    <div class="dashboard">
      <Sidebar :nombre="usuario.nombre" :apellido="usuario.apellido">
        <button class="menu-btn">Alumnos</button>
        <button class="menu-btn">Deudores</button>
        <button class="menu-btn">Trabajos</button>
        <button class="menu-btn">Subscripciones</button>
        <button class="menu-btn">Empleados</button>
        <button class="menu-btn">Grupos/Horarios</button>
        <!-- Otros botones según el rol -->
      </Sidebar>

      <div class="contenido">
        <!-- Aquí va la info dinámica de la pantalla -->
      </div>
    </div>
  </Background>
</template>

<script setup>
import Background from '@/components/Administracion/Background.vue';
import Sidebar from '@/components/Administracion/Sidebar.vue'


const usuario = {
  nombre: 'Juan',
  apellido: 'Pérez'
}
</script>

<style scoped>
.dashboard {
  display: flex;
}

.contenido {
  margin-left: 250px;
  padding: 2rem;
  color: white;
  flex: 1;
}

.menu-btn {
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
}

.menu-btn:hover {
  color: #ff4757;
  background: rgba(255, 255, 255, 0.05);
}
</style>
