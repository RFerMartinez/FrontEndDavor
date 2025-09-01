<template>
  <div class="precio-item">
    <span class="descripcion">{{ precio.descripcion }}</span>
    <span class="valor">{{ precio.precio }}</span>
  </div>
</template>

<script setup>
defineProps({
  precio: Object
})
</script>

<style scoped>
.precio-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #111;
  color: white;
  padding: 20px 30px;
  border-radius: 10px;
  margin: 0 auto 20px auto;
  box-shadow: 0 0 10px rgba(229, 9, 20, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  width: 70%; /* MÁS angosto */
  max-width: 600px; /* límite para pantallas grandes */
}
@media (max-width: 767px) {
  .precio-item {
    flex-direction: column;   /* ✅ apila elementos */
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 10px; /* espacio entre nombre y precio */
  }

  .descripcion {
    font-size: 1.2rem; /* un poco más chico para móvil */
  }

  .valor {
    font-size: 1.4rem;
  }
}
.precio-item:hover {
  transform: scale(1.02);
  box-shadow: 0 0 15px rgba(229, 9, 20, 0.5);
}

.descripcion {
  font-size: 1.4rem;
  font-weight: 500;
}

.valor {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e50914;
}
</style>
