<template>
  <div class="contenedor-modificar-datos">
    <div class="tarjeta-modificacion">
      <div class="header-modificacion">
        <h2 class="titulo-modificacion">
          <i class="fas fa-edit"></i>
          Modificar Datos del Alumno
        </h2>
        <p class="subtitulo-modificacion">Editando información de {{ alumno.nombre }} {{ alumno.apellido }}</p>
      </div>

      <div class="contenido-modificacion">
        <form @submit.prevent="confirmarGuardar" class="formulario-modificacion">
          <!-- Información Personal -->
          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">Información Personal</h3>
            <div class="campos-grid">
              <div class="campo">
                <label for="nombre" class="etiqueta-campo">Nombre:</label>
                <input type="text" id="nombre" v-model="datosModificados.nombre" class="input-campo" required>
              </div>
              <div class="campo">
                <label for="apellido" class="etiqueta-campo">Apellido:</label>
                <input type="text" id="apellido" v-model="datosModificados.apellido" class="input-campo" required>
              </div>
              <div class="campo">
                <label for="dni" class="etiqueta-campo">DNI:</label>
                <input type="text" id="dni" v-model="datosModificados.dni" class="input-campo" required>
              </div>
              <div class="campo">
                <label for="email" class="etiqueta-campo">Email:</label>
                <input type="email" id="email" v-model="datosModificados.email" class="input-campo" required>
              </div>
              <div class="campo">
                <label for="telefono" class="etiqueta-campo">Teléfono:</label>
                <input type="tel" id="telefono" v-model="datosModificados.telefono" class="input-campo" required>
              </div>
            </div>
          </div>

          <!-- Dirección -->
          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">Dirección</h3>
            <div class="campos-grid">
              <div class="campo">
                <label for="provincia" class="etiqueta-campo">Provincia:</label>
                <input type="text" id="provincia" v-model="datosModificados.provincia" class="input-campo" required>
              </div>
              <div class="campo">
                <label for="localidad" class="etiqueta-campo">Localidad:</label>
                <input type="text" id="localidad" v-model="datosModificados.localidad" class="input-campo" required>
              </div>
              <div class="campo">
                <label for="calle" class="etiqueta-campo">Calle:</label>
                <input type="text" id="calle" v-model="datosModificados.Calle" class="input-campo" required>
              </div>
              <div class="campo">
                <label for="numero" class="etiqueta-campo">Número:</label>
                <input type="text" id="numero" v-model="datosModificados.nro" class="input-campo" required>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="botones-formulario">
            <button type="button" class="btn-cancelar" @click="cancelar">
              <i class="fas fa-times"></i>
              Cancelar Operación
            </button>
            <button type="submit" class="btn-guardar">
              <i class="fas fa-save"></i>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="mostrarConfirmacion" class="modal-overlay">
      <div class="modal-confirmacion">
        <div class="modal-header">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Confirmar Cambios</h3>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro que deseas actualizar los datos del alumno?</p>
        </div>
        <div class="modal-footer">
          <button class="btn-modal btn-cancelar-modal" @click="cancelarGuardar">
            No, Cancelar
          </button>
          <button class="btn-modal btn-confirmar-modal" @click="guardarCambios">
            Sí, Guardar Cambios
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de éxito -->
    <div v-if="mostrarExito" class="modal-overlay">
      <div class="modal-exito">
        <div class="modal-header">
          <i class="fas fa-check-circle"></i>
          <h3>¡Éxito!</h3>
        </div>
        <div class="modal-body">
          <p>Datos Actualizados Correctamente</p>
        </div>
        <div class="modal-footer">
          <button class="btn-modal btn-aceptar-modal" @click="cerrarExito">
            Aceptar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de sin cambios -->
    <div v-if="mostrarSinCambios" class="modal-overlay">
      <div class="modal-sin-cambios">
        <div class="modal-header">
          <i class="fas fa-info-circle"></i>
          <h3>Sin Cambios</h3>
        </div>
        <div class="modal-body">
          <p>No modificó ningún campo. ¿Qué desea hacer?</p>
        </div>
        <div class="modal-footer">
          <button class="btn-modal btn-volver-modal" @click="volverAEditar">
            Volver a Editar
          </button>
          <button class="btn-modal btn-cancelar-modal" @click="cancelarSinCambios">
            Cancelar y Volver
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  alumno: Object
})

const emit = defineEmits(['guardar-cambios', 'cancelar'])

const datosModificados = ref({})
const datosOriginales = ref({})
const mostrarConfirmacion = ref(false)
const mostrarExito = ref(false)
const mostrarSinCambios = ref(false)

onMounted(() => {
  // Guardar los datos originales para comparar
  datosOriginales.value = { ...props.alumno }
  // Copiar los datos del alumno para modificarlos
  datosModificados.value = { ...props.alumno }
})

// Función para verificar si hay cambios
const hayCambios = () => {
  const campos = ['nombre', 'apellido', 'dni', 'email', 'telefono', 'provincia', 'localidad', 'Calle', 'nro']
  
  for (const campo of campos) {
    if (datosModificados.value[campo] !== datosOriginales.value[campo]) {
      return true
    }
  }
  return false
}

const confirmarGuardar = () => {
  // Validar que el formulario esté completo
  if (!validarFormulario()) {
    return
  }
  
  // Verificar si hay cambios
  if (!hayCambios()) {
    mostrarSinCambios.value = true
    return
  }
  
  mostrarConfirmacion.value = true
}

const validarFormulario = () => {
  const camposRequeridos = ['nombre', 'apellido', 'dni', 'email', 'telefono', 'provincia', 'localidad', 'Calle', 'nro']
  
  for (const campo of camposRequeridos) {
    if (!datosModificados.value[campo] || datosModificados.value[campo].toString().trim() === '') {
      alert(`El campo ${campo} es requerido`)
      return false
    }
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(datosModificados.value.email)) {
    alert('Por favor ingresa un email válido')
    return false
  }
  
  return true
}

const guardarCambios = () => {
  // Cerrar modal de confirmación
  mostrarConfirmacion.value = false
  
  try {
    // Simular guardado (aquí iría la llamada a la API)
    console.log('Guardando cambios:', datosModificados.value)
    
    // Emitir los datos modificados al componente padre
    emit('guardar-cambios', datosModificados.value)
    
    // Mostrar mensaje de éxito
    mostrarExito.value = true
    
  } catch (error) {
    console.error('Error al guardar cambios:', error)
    alert('Error al guardar los cambios. Por favor, intenta nuevamente.')
  }
}

const cancelarGuardar = () => {
  mostrarConfirmacion.value = false
}

const cerrarExito = () => {
  mostrarExito.value = false
  // El componente se cerrará automáticamente porque el padre maneja el estado
}

// Funciones para el modal de sin cambios
const volverAEditar = () => {
  mostrarSinCambios.value = false
  // El usuario sigue en el formulario para editar
}

const cancelarSinCambios = () => {
  mostrarSinCambios.value = false
  // Cerrar el componente y volver a InfoAlumno
  emit('cancelar')
}

const cancelar = () => {
  emit('cancelar')
}
</script>

<style scoped>
.contenedor-modificar-datos {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
}

.tarjeta-modificacion {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header-modificacion {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  padding: 2rem;
  color: white;
}

.titulo-modificacion {
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.subtitulo-modificacion {
  margin: 0;
  opacity: 0.9;
}

.contenido-modificacion {
  padding: 2rem;
}

.seccion-formulario {
  margin-bottom: 2.5rem;
}

.titulo-seccion-formulario {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #2196F3;
  padding-bottom: 0.5rem;
}

.campos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.etiqueta-campo {
  font-weight: 600;
  color: #495057;
  font-size: 1rem;
}

.input-campo {
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-campo:focus {
  outline: none;
  border-color: #2196F3;
}

.botones-formulario {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.btn-cancelar, .btn-guardar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancelar {
  background: #f44336;
  color: white;
}

.btn-cancelar:hover {
  background: #d32f2f;
  transform: translateY(-1px);
}

.btn-guardar {
  background: #4caf50;
  color: white;
}

.btn-guardar:hover {
  background: #388e3c;
  transform: translateY(-1px);
}

/* Estilos para los modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-confirmacion, .modal-exito, .modal-sin-cambios {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: modalAppear 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.modal-header i {
  font-size: 2rem;
}

.modal-confirmacion .modal-header i {
  color: #ff9800;
}

.modal-exito .modal-header i {
  color: #4caf50;
}

.modal-sin-cambios .modal-header i {
  color: #2196F3;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.modal-body {
  margin-bottom: 2rem;
}

.modal-body p {
  margin: 0;
  font-size: 1.1rem;
  color: #495057;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-modal {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancelar-modal {
  background: #f44336;
  color: white;
}

.btn-cancelar-modal:hover {
  background: #d32f2f;
}

.btn-confirmar-modal {
  background: #4caf50;
  color: white;
}

.btn-confirmar-modal:hover {
  background: #388e3c;
}

.btn-aceptar-modal {
  background: #2196F3;
  color: white;
}

.btn-aceptar-modal:hover {
  background: #1976D2;
}

.btn-volver-modal {
  background: #2196F3;
  color: white;
}

.btn-volver-modal:hover {
  background: #1976D2;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .contenedor-modificar-datos {
    padding: 1rem;
  }
  
  .campos-grid {
    grid-template-columns: 1fr;
  }
  
  .botones-formulario {
    flex-direction: column;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-confirmacion, .modal-exito, .modal-sin-cambios {
    padding: 1.5rem;
    margin: 1rem;
  }
}
</style>