<template>
  <div class="tabla-container">
    <table class="tabla-cuotas">
      <thead>
        <tr>
          <th>Mes / Año</th>
          <th>Trabajo / Suscripción</th>
          <th>Monto</th>
          <th></th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <FilaCuota
          v-for="(cuota, index) in cuotas"
          :key="index"
          :cuota="cuota"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import FilaCuota from './FilaCuota.vue'
defineProps({
  cuotas: Array
})
</script>

<style scoped>
.tabla-container {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  overflow-x: auto;
}

.tabla-cuotas {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Poppins', sans-serif;
}

th {
  text-align: center;
  vertical-align: middle;
  font-weight: bold;
  padding: 0.75rem;
  color: #333;
  font-size: 1rem;
}
thead {
  background-color: #f2f2f2;
}
</style>
