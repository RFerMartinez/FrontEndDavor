<template>
  <div class="metodologia-card">
    <div class="metodologia-content">
      <div class="content-wrapper">
        <h3>{{ metodo.nombre }}</h3>
        <button class="btn-info" @click="$emit('ver', metodo)">Más Info</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  metodo: Object
})
</script>

<style scoped>
.metodologia-card {
  background: linear-gradient(135deg, #111 0%, #222 100%);
  border: 1px solid #333;
  border-radius: 12px;
  padding: 25px 20px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.metodologia-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.1), transparent);
  transition: left 0.5s ease;
}

.metodologia-card:hover::before {
  left: 100%;
}

.metodologia-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(255, 0, 0, 0.3);
  border-color: #e50914;
}

.metodologia-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-wrapper {
  text-align: center;
  width: 100%;
}

.content-wrapper h3 {
  margin: 0 0 20px 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  line-height: 1.3;
  min-height: 3.2em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-info {
  background: linear-gradient(135deg, #e50914 0%, #ff2a2a 100%);
  border: none;
  padding: 12px 24px;
  color: white;
  cursor: pointer;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  width: auto;
  min-width: 120px;
}

.btn-info:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .metodologia-card {
    padding: 20px 15px;
  }
  
  .content-wrapper h3 {
    font-size: 1.2rem;
    min-height: 2.8em;
  }
  
  .btn-info {
    padding: 10px 20px;
    font-size: 0.9rem;
    min-width: 110px;
  }
}

@media (max-width: 480px) {
  .metodologia-card {
    padding: 18px 12px;
  }
  
  .content-wrapper h3 {
    font-size: 1.1rem;
    min-height: 2.6em;
    margin-bottom: 15px;
  }
  
  .btn-info {
    padding: 10px 18px;
    font-size: 0.85rem;
    min-width: 100px;
  }
}
</style>