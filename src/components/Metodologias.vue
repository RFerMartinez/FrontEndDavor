<template>
  <div class="metodologia-card">
    <img :src="metodo.imagen" :alt="metodo.nombre" />
    <h3>{{ metodo.nombre }}</h3>
    <button @click="$emit('ver', metodo)">Más Info</button>
  </div>
</template>

<script setup>
defineProps({
  metodo: Object
})
</script>

<style scoped>
.metodologia-card {
  background: #111;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  width: 100%;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
  animation: fadeUp 0.5s ease forwards, zoomIn 0.3s ease forwards;
}

.metodologia-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.metodologia-card h3 {
  margin: 10px 0;
}

.metodologia-card button {
  background-color: #e50914;
  border: none;
  padding: 10px 15px;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.metodologia-card button:hover {
  background-color: #ff2a2a;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}
</style>
