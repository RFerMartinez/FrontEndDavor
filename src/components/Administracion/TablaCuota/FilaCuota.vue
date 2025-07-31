<template>
  <tr class="fila-cuota">
    <td>{{ cuota.mes }} / {{ cuota.anio }}</td>
    <td>
      <div class="trabajo">{{ cuota.trabajo }}</div>
      <div class="suscripcion">{{ cuota.suscripcion }}</div>
    </td>
    <td>${{ cuota.monto.toLocaleString('es-AR') }}</td>
    <td>
      <div class="boton-wrapper">
        <BotonAccion :pagada="cuota.pagada" />
      </div>
    </td>
    <td>
      <EstadoPago :pagada="cuota.pagada" />
    </td>
  </tr>
</template>

<script setup>
import BotonAccion from './BotonAccion.vue'
import EstadoPago from './EstadoPago.vue'

defineProps({
  cuota: Object
})
</script>

<style scoped>
.fila-cuota {
  height: 64px;
  border-bottom: 1px solid #ccc;
  font-family: 'Poppins', sans-serif;
}

td {
  text-align: center;
  vertical-align: middle;
  color: #222;
  padding: 0.5rem;
}

.trabajo {
  font-weight: 600;
}

.suscripcion {
  font-size: 0.85em;
  color: #555;
}

.boton-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
