<template>
  <div class="nuevo-reclamo-container">
    <h2 class="subtitulo">Nuevo Reclamo</h2>
    
    <!-- FORMULARIO COMPACTO (SOLO ELIMINAR ESPACIADO) -->
    <div class="form-group compacto">  <!-- Clase adicional -->
      <label>Descripción:</label>
      <textarea 
        v-model="descripcion" 
        class="campo-texto"
        rows="4"
        required
      ></textarea>
    </div>
    
    <div class="acciones">
      <button type="submit" @click="guardar" class="btn-guardar">Guardar</button>
      <button type="button" @click="cancelar" class="btn-cancelar">Cancelar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['guardar', 'cancelar'])

const descripcion = ref('')

const guardar = () => {
  const nuevoReclamo = {
    id: Math.floor(Math.random() * 900) + 100,
    fecha: new Date().toLocaleDateString('es-AR'),
    hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    descripcion: descripcion.value
  }
  emit('guardar', nuevoReclamo)
  descripcion.value = ''
}

const cancelar = () => {
  emit('cancelar')
}
</script>

<style scoped>
.nuevo-reclamo-container {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.subtitulo {
  font-size: 1.5rem;
  color: #e91e63;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
}

.formulario-reclamo {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
  font-family: 'Poppins', sans-serif;
}

.campo-texto {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  resize: vertical;
}

.acciones {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-guardar {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-guardar:hover {
  background-color: #3aa876;
}

.btn-cancelar {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-cancelar:hover {
  background-color: #e53935;
}

.ejemplo-reclamo {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  font-family: 'Poppins', sans-serif;
}

.ejemplo-reclamo h3 {
  margin-top: 0;
  color: #555;
  font-size: 1.1rem;
}
.compacto {
  margin-top: 0; /* Elimina espacio superior */
  padding-top: 0; /* Elimina padding superior */
}
</style>