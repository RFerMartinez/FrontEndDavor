<template>
  <section class="black-section">
    <div class="container">
      <h2>Bienvenido a GIMNASIO Abito</h2>
      <p>Primera prueba de la página oficial del gimnasio Abito</p>

      <h2 class="section-title">Metodologías de trabajo</h2>
      <div class="grid">
        <!-- Ejemplo de tarjeta (harás dinámico luego) -->
        <div class="metodologia-card">
          <img src="@/assets/logo.png" alt="Metodología">
          <h3>Título ejemplo</h3>
          <button>Ver más</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.black-section {
  background-color: #000;
  color: white;
  padding: 100px 20px;
  min-height: 500px;
}

.section-title {
  text-align: center;
  padding-top: 30px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 30px;
  padding: 0 20px;
}

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

/* Animaciones */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
