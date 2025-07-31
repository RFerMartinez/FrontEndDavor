<!-- src/components/Alumno/EstadoPago.vue -->
<template>
  <div
    class="estado"
    :class="pagada ? 'pagada' : 'pendiente'"
  >
    {{ pagada ? 'PAGADA' : 'PENDIENTE' }}
  </div>
</template>

<script setup>
defineProps({
  pagada: Boolean
})
</script>

<style scoped>
.estado {
  font-weight: bold;
  padding: 6px 10px;
  border-radius: 6px;
  text-align: center;
  color: black;
}

.pagada {
  background-color: #47d147;
}

.pendiente {
  background-color: #ff4d4d;
}
</style>
