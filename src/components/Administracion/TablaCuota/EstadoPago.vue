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
  padding: 5px 8px;
  border-radius: 4px;
  text-align: center;
  color: black;
  font-size: 0.85rem;
  white-space: nowrap;
}

.pagada {
  background-color: #47d147;
}

.pendiente {
  background-color: #ff4d4d;
}

@media (max-width: 768px) {
  .estado {
    padding: 4px 7px;
    font-size: 0.8rem;
  }
}
</style>