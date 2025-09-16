<template>
  <tr class="fila-cuota">
    <td class="col-mes-anio">{{ cuota.mes }} / {{ cuota.anio }}</td>
    <td class="col-trabajo-suscripcion">
      <div class="trabajo">{{ cuota.trabajo }}</div>
      <div class="suscripcion">{{ cuota.suscripcion }}</div>
    </td>
    <td class="col-monto">${{ cuota.monto.toLocaleString('es-AR') }}</td>
    <td class="col-accion">
      <BotonAccion :pagada="cuota.pagada" :is-mobile="false" />
    </td>
    <td class="col-estado">
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
  height: 70px;
  border-bottom: 1px solid #ccc;
  font-family: 'Poppins', sans-serif;
  font-size: 1.05rem;
}

td {
  text-align: center;
  vertical-align: middle;
  color: #222;
  padding: 0.75rem;
}

.trabajo {
  font-weight: 600;
  font-size: 1.05rem;
}

.suscripcion {
  font-size: 0.9em;
  color: #555;
}

@media (max-width: 768px) {
  .fila-cuota {
    display: flex;
    flex-direction: column;
    height: auto;
    padding: 1rem;
    border-bottom: 2px solid #eee;
    margin-bottom: 1rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .fila-cuota td {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.5rem 0;
    border: none;
  }

  .col-mes-anio {
    font-weight: 600;
    font-size: 1.1rem;
    color: #2c3e50;
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 0.75rem;
  }

  .col-trabajo-suscripcion {
    padding: 0.75rem 0;
  }

  .trabajo {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .suscripcion {
    font-size: 0.9rem;
    color: #666;
  }

  .col-monto {
    font-weight: 700;
    font-size: 1.2rem;
    color: #2c3e50;
    padding: 0.5rem 0;
  }

  .col-accion, .col-estado {
    padding: 0.75rem 0;
  }
}

@media (max-width: 480px) {
  .fila-cuota {
    padding: 1rem;
  }

  .col-mes-anio {
    font-size: 1rem;
  }

  .trabajo {
    font-size: 0.95rem;
  }

  .suscripcion {
    font-size: 0.85rem;
  }

  .col-monto {
    font-size: 1.1rem;
  }
}
</style>