<!-- src/components/Alumno/BotonAccion.vue -->
<template>
  <button
    class="boton"
    :class="pagada ? 'descargar' : 'pagar'"
    @click="manejarClick"
  >
    {{ pagada ? 'Descargar comprobante' : 'PAGAR' }}
  </button>
</template>

<script setup>
defineProps({
  pagada: Boolean
})

function manejarClick() {
  if (pagada) {
    // Lógica futura para descargar comprobante
  } else {
    // Lógica futura para abrir pantalla de pago
  }
}
</script>

<style scoped>
.boton {
  padding: 8px 12px;
  font-size: 0.9em;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.boton:hover {
  transform: scale(1.05);
}

.pagar {
  background: white;
  border: 1px solid #000;
  font-weight: bold;
}

.descargar {
  background: #f0f0f0;
  color: #000;
}
</style>
