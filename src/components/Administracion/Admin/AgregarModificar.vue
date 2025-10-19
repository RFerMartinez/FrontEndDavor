<template>
  <div class="formulario-item">
    <h3 class="titulo-formulario">
      {{ esEdicion ? 'Editar' : 'Nueva' }} {{ config.tituloSingular }}
    </h3>
    
    <div class="campos-formulario" :class="{ 'stacked': config.layout === 'stacked' }">
      
      <div class="campo">
        <label :for="config.campo1.key">{{ config.campo1.label }}</label>
        <input
          v-if="!config.campo1.esTextarea"
          :id="config.campo1.key"
          v-model="itemLocal[config.campo1.key]"
          type="text"
          :placeholder="config.campo1.placeholder"
          class="input-text"
        >
        <textarea
          v-else
          :id="config.campo1.key"
          v-model="itemLocal[config.campo1.key]"
          :placeholder="config.campo1.placeholder"
          class="input-textarea"
          rows="4"
        ></textarea>
      </div>
      
      <div class="campo">
        <label :for="config.campo2.key">{{ config.campo2.label }}</label>
        <input
          v-if="!config.campo2.esTextarea"
          :id="config.campo2.key"
          v-model="itemLocal[config.campo2.key]"
          type="text"
          :placeholder="config.campo2.placeholder"
          class="input-text"
        >
        <textarea
          v-else
          :id="config.campo2.key"
          v-model="itemLocal[config.campo2.key]"
          :placeholder="config.campo2.placeholder"
          class="input-textarea"
          rows="4"
        ></textarea>
      </div>

    </div>

    <div class="botones-formulario">
      <button class="btn btn-guardar" @click="$emit('guardar')">
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
import { computed } from 'vue'

const props = defineProps({
  // Usamos modelValue para poder usar v-model en el padre
  modelValue: {
    type: Object,
    required: true
  },
  esEdicion: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object,
    required: true
  }
  // Ejemplo de config:
  // config = {
  //   tituloSingular: 'Suscripción',
  //   layout: 'inline', // 'inline' o 'stacked'
  //   campo1: { key: 'descripcion', label: 'Descripción:', placeholder: 'Ej: 5 Días', esTextarea: false },
  //   campo2: { key: 'precio', label: 'Precio:', placeholder: 'Ej: $30.000', esTextarea: false }
  // }
})

const emit = defineEmits(['update:modelValue', 'guardar', 'cancelar'])

// Este computed permite que v-model funcione en el componente
const itemLocal = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})
</script>

<style scoped>
/* Estilos combinados y limpios de .formulario-suscripcion y .formulario-trabajo */
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
}

/* Layout 'stacked' para Trabajos_Metodologias */
.campos-formulario.stacked {
  grid-template-columns: 1fr;
}

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

.input-text {
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.input-text:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}

.input-textarea {
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  resize: vertical;
  min-height: 100px;
}

.input-textarea:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}

.botones-formulario {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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
  .campos-formulario {
    grid-template-columns: 1fr; /* Siempre apilado en móvil */
  }
  
  .botones-formulario {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>