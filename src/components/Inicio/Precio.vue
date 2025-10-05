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
  background: linear-gradient(135deg, #111 0%, #222 100%);
  color: white;
  padding: 25px 30px;
  border-radius: 12px;
  margin: 0 auto 20px auto;
  border: 1px solid #333;
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  width: 70%;
  max-width: 600px;
  position: relative;
  overflow: hidden;
}

.precio-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.1), transparent);
  transition: left 0.5s ease;
}

.precio-item:hover::before {
  left: 100%;
}

.precio-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(255, 0, 0, 0.3);
  border-color: #e50914;
}

.descripcion {
  font-size: 1.4rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
}

.valor {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e50914;
  font-family: 'Poppins', sans-serif;
}

/* RESPONSIVE */
@media (max-width: 767px) {
  .precio-item {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 10px;
    padding: 20px 25px;
    width: 80%;
  }

  .descripcion {
    font-size: 1.2rem;
  }

  .valor {
    font-size: 1.4rem;
  }
}

@media (max-width: 480px) {
  .precio-item {
    padding: 18px 20px;
    width: 85%;
  }

  .descripcion {
    font-size: 1.1rem;
  }

  .valor {
    font-size: 1.3rem;
  }
}
</style>