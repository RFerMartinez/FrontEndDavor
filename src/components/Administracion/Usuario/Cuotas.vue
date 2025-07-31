<template>
  <div class="contenedor-cuotas">
    <h1 class="titulo">CUOTAS   </h1>
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
  max-width: 1100px;
  margin: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh; /* ✅ Deja que el contenido crezca */
  overflow-y: auto;
}

.titulo {
  font-size: 2rem;
  color: #e91e63;
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}
</style>
