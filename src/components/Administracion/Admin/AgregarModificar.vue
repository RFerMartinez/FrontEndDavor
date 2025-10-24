<template>
  <div class="formulario-item">
    <h3 class="titulo-formulario">
      {{ esEdicion ? 'Editar' : 'Nueva' }} {{ config.tituloSingular }}
    </h3>

    <div class="campos-formulario" :class="{ 'stacked': config.layout === 'stacked' }">

      <div class="campo">
        <label :for="config.campo1.key">{{ config.campo1.label }}</label>

        <div v-if="esContextoSuscripciones && esEdicion" class="readonly-text-display">
          {{ itemLocal[config.campo1.key] }}
        </div>
        <template v-else>
          <input
            v-if="!config.campo1.esTextarea"
            :id="config.campo1.key"
            v-model="itemLocal[config.campo1.key]"
            :type="config.campo1.tipoInput || 'text'"
            :min="config.campo1.min"
            :placeholder="config.campo1.placeholder"
            class="input-text"
            :class="{ 'input-dias': esContextoSuscripciones && !esEdicion }" 
            :readonly="config.campo1.readonly || false"
            :step="config.campo1.tipoInput === 'number' ? '1' : undefined"
          >
          <textarea
            v-else
            :id="config.campo1.key"
            v-model="itemLocal[config.campo1.key]"
            :placeholder="config.campo1.placeholder"
            class="input-textarea"
            rows="4"
            :readonly="config.campo1.readonly || false"
          ></textarea>
        </template>
      </div>

      <div class="campo">
        <label :for="config.campo2.key">{{ config.campo2.label }}</label>
        <input
          v-if="!config.campo2.esTextarea"
          :id="config.campo2.key"
          v-model="itemLocal[config.campo2.key]"
          :type="config.campo2.tipoInput || 'text'"
          :min="config.campo2.min"
          :placeholder="config.campo2.placeholder"
          class="input-text"
          :readonly="config.campo2.readonly || false"
          :step="config.campo2.tipoInput === 'number' ? 'any' : undefined"
        >
        <textarea
          v-else
          :id="config.campo2.key"
          v-model="itemLocal[config.campo2.key]"
          :placeholder="config.campo2.placeholder"
          class="input-textarea"
          rows="4"
          :readonly="config.campo2.readonly || false"
        ></textarea>
      </div>

    </div>

    <div class="botones-formulario">
      <button class="btn btn-guardar" @click="emitirGuardar">
        <i class="fas fa-save"></i>
        {{ esEdicion ? 'Actualizar' : 'Guardar' }}
      </button>
      <button class="btn btn-cancelar" @click="$emit('cancelar')">
        <i class="fas fa-times"></i>
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: Object, required: true },
  esEdicion: { type: Boolean, default: false },
  config: { type: Object, required: true }
});

const emit = defineEmits(['update:modelValue', 'guardar', 'cancelar']);

// Computed para v-model
const itemLocal = computed({
  get: () => props.modelValue,
  set: (value) => { emit('update:modelValue', value); }
});

// --- NUEVO: Computed para saber si es contexto suscripciones ---
// (Reintroducido porque es necesario en el template)
const esContextoSuscripciones = computed(() => props.config.contexto === 'suscripciones');
// --- FIN NUEVO ---

// Emitir guardar
const emitirGuardar = () => { emit('guardar', itemLocal.value); };
</script>

<style scoped>
/* --- ESTILOS INDENTADOS Y CON MODIFICACIONES --- */

.formulario-item {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.titulo-formulario {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.campos-formulario {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Layout 'inline' por defecto */
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  align-items: start; /* Alinea los items al inicio verticalmente */
}

/* Layout 'stacked' */
.campos-formulario.stacked {
  grid-template-columns: 1fr;
}

/* V V V NUEVA REGLA ESPECÍFICA PARA LAYOUT DE AGREGAR SUSCRIPCIÓN V V V */
/* Ajusta las columnas solo cuando NO está apilado Y es el input de días */
.campos-formulario:not(.stacked) .campo:has(.input-dias) {
  grid-column: 1 / 2; /* Asegura que el campo días esté en la primera columna */
}

.campos-formulario:not(.stacked) .campo:has(.input-dias) + .campo {
  grid-column: 2 / 3; /* Asegura que el campo precio esté en la segunda */
}

/* Aplica 'auto 1fr' cuando el primer campo (días) tiene la clase .input-dias */
.campos-formulario:not(.stacked):has(.campo .input-dias) {
  grid-template-columns: auto 1fr; /* Columna 1 (días) auto, Columna 2 (precio) llena el resto */
}
/* ^ ^ ^ FIN NUEVA REGLA ^ ^ ^ */


.campo {
  display: flex;
  flex-direction: column;
}

.campo label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
  font-size: 0.95rem;
}

.input-text,
.input-textarea,
.readonly-text-display {
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  box-sizing: border-box;
}

.input-text:focus,
.input-textarea:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}

.input-textarea {
  resize: vertical;
  min-height: 100px;
}

.readonly-text-display {
  background-color: #f8f9fa;
  color: #495057;
  border-color: #e0e0e0;
  min-height: calc(0.8rem * 2 + 1rem + 4px);
  display: flex;
  align-items: center;
  cursor: default;
}

/* Estilo para input de días (mantiene el ancho limitado) */
.input-text.input-dias {
  max-width: 150px;
  /* El layout del grid se encarga del espacio ahora */
}

.botones-formulario {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-guardar {
  background: #C2185B;
  color: white;
  box-shadow: 0 2px 8px rgba(194, 24, 91, 0.3);
}
.btn-guardar:hover {
  background: #AD1457;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(194, 24, 91, 0.4);
}

.btn-cancelar {
  background: #9E9E9E;
  color: white;
  box-shadow: 0 2px 8px rgba(158, 158, 158, 0.3);
}
.btn-cancelar:hover {
  background: #757575;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(158, 158, 158, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .campos-formulario,
  .campos-formulario:not(.stacked):has(.campo .input-dias) { /* Anula la regla específica en móvil */
    grid-template-columns: 1fr; /* Siempre apilado */
  }

  .botones-formulario {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .input-text.input-dias {
      max-width: 100%; /* Ancho completo en móvil */
  }
}
</style>