<template>
  <div class="tabla-container">
    <table class="tabla-reclamos">
      <thead>
        <tr>
          <th>Nro Reclamo</th>
          <th>Fecha y Hora</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reclamo in reclamos" :key="reclamo.id" class="fila-reclamo">
          <td>#{{ reclamo.id }}</td>
          <td>{{ reclamo.fecha }}<br>{{ reclamo.hora }}</td>
          <td>{{ reclamo.descripcion }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  reclamos: Array
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

.tabla-reclamos {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Poppins', sans-serif;
}

th {
  text-align: left;
  vertical-align: middle;
  font-weight: bold;
  padding: 0.75rem;
  color: #333;
  font-size: 1rem;
}

thead {
  background-color: #f2f2f2;
}

.fila-reclamo {
  height: 64px;
  border-bottom: 1px solid #ccc;
}

td {
  vertical-align: middle;
  color: #222;
  padding: 0.75rem;
}
</style>