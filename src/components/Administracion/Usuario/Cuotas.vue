<template>
  <div class="contenedor-cuotas">
    <h1 class="titulo">CUOTAS</h1>
    <TablaCuotas :cuotas="cuotas" />
  </div>
</template>

<script setup>
import TablaCuotas from '../TablaCuota/TablaCuotas.vue'

const cuotas = [
  {
    mes: "Junio",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: false
  },
  {
    mes: "Mayo",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: false
  },
  {
    mes: "Abril",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Marzo",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Febrero",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Enero",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  } 
]
</script>

<style scoped>
.contenedor-cuotas {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%; /* ✅ Cambiado a 100% */
  max-width: none; /* ✅ Eliminado el límite máximo */
  margin: 0; /* ✅ Sin márgenes */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
}

.titulo {
  font-size: 2rem;
  color: #e91e63;
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .contenedor-cuotas {
    padding: 1.5rem;
    border-radius: 16px;
    margin: 0;
    width: 100%;
  }
  
  .titulo {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .contenedor-cuotas {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .titulo {
    font-size: 1.6rem;
  }
}
</style>