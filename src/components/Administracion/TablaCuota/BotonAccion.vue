<template>
  <button
    class="boton"
    :class="pagada ? 'descargar' : 'pagar'"
    @click="manejarClick"
  >
    {{ pagada ? 'Ver Comprobante' : 'PAGAR' }}
  </button>
</template>

<script setup>
defineProps({
  pagada: Boolean
})

function manejarClick() {
  // Lógica futura para pago/descarga
}
</script>

<style scoped>
.boton {
  padding: 8px 12px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
  white-space: nowrap;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin: 0 auto; /* ✅ CORRECCIÓN: Añadido para centrar */
  width: fit-content; /* ✅ CORRECCIÓN: Ajusta al contenido */
}

.boton:hover {
  transform: scale(1.05);
}

.pagar {
  background: white;
  border: 1px solid #000;
}

.descargar {
  background: #f0f0f0;
  color: #000;
}

@media (max-width: 768px) {
  .boton {
    padding: 10px 14px;
    font-size: 0.95rem;
    min-height: 42px;
    min-width: 120px;
  }
}
</style>