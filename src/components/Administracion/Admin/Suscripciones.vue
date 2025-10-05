<template>
  <div class="contenedor-suscripciones">
    <!-- Encabezado -->
    <div class="encabezado-suscripciones">
      <h1 class="titulo">SUSCRIPCIONES</h1>
      <p class="subtitulo">Gestiona las suscripciones disponibles para los alumnos</p>
    </div>

    <!-- Botón para agregar nueva suscripción -->
    <transition name="fade-scale" @after-leave="mostrarFormularioDespuesDeBotón">
      <div v-if="!mostrarFormulario && !transicionEnProgreso" class="contenedor-boton-agregar">
        <button class="btn-agregar" @click="iniciarTransicionAFormulario">
          <i class="fas fa-plus"></i>
          Agregar Nueva Suscripción
        </button>
      </div>
    </transition>

    <!-- Formulario para agregar/editar suscripción -->
    <transition name="slide-down" @after-leave="transicionEnProgreso = false">
      <div v-if="mostrarFormulario" class="formulario-suscripcion">
        <h3 class="titulo-formulario">
          {{ suscripcionEditando ? 'Editar Suscripción' : 'Nueva Suscripción' }}
        </h3>
        
        <div class="campos-formulario">
          <div class="campo">
            <label for="descripcion">Descripción:</label>
            <input
              id="descripcion"
              v-model="nuevaSuscripcion.descripcion"
              type="text"
              placeholder="Ej: 5 Días a la semana"
              class="input-text"
            >
          </div>
          
          <div class="campo">
            <label for="precio">Precio:</label>
            <input
              id="precio"
              v-model="nuevaSuscripcion.precio"
              type="text"
              placeholder="Ej: $30.000"
              class="input-text"
            >
          </div>
        </div>

        <div class="botones-formulario">
          <button class="btn btn-guardar" @click="guardarSuscripcion">
            <i class="fas fa-save"></i>
            {{ suscripcionEditando ? 'Actualizar' : 'Guardar' }}
          </button>
          
          <button class="btn btn-cancelar" @click="iniciarTransicionABoton">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
        </div>
      </div>
    </transition>

    <!-- Lista de suscripciones -->
    <div class="lista-suscripciones">
      <div v-if="suscripciones.length === 0" class="sin-suscripciones">
        <i class="fas fa-info-circle fa-2x"></i>
        <p>No hay suscripciones cargadas</p>
      </div>

      <transition-group name="list" tag="div" class="tarjetas-suscripciones">
        <div
          v-for="suscripcion in suscripciones"
          :key="suscripcion.id"
          class="tarjeta-suscripcion"
        >
          <div class="contenido-tarjeta">
            <div class="info-suscripcion">
              <h3 class="descripcion">{{ suscripcion.descripcion }}</h3>
              <p class="precio">{{ suscripcion.precio }}</p>
            </div>
            
            <div class="acciones-tarjeta">
              <button
                class="btn-accion btn-editar"
                @click="editarSuscripcion(suscripcion)"
                title="Editar suscripción"
              >
                <i class="fas fa-edit"></i>
              </button>
              
              <button
                class="btn-accion btn-eliminar"
                @click="eliminarSuscripcion(suscripcion.id)"
                title="Eliminar suscripción"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Mensaje de confirmación -->
    <transition name="slide-in">
      <div v-if="mensajeConfirmacion" class="mensaje-confirmacion">
        <div class="contenido-mensaje">
          <i class="fas fa-check-circle"></i>
          <span>{{ mensajeConfirmacion }}</span>
          <button class="btn-cerrar-mensaje" @click="mensajeConfirmacion = ''">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Estado de las suscripciones
const suscripciones = ref([])
const mostrarFormulario = ref(false)
const suscripcionEditando = ref(null)
const mensajeConfirmacion = ref('')
const transicionEnProgreso = ref(false)

// Nueva suscripción temporal
const nuevaSuscripcion = ref({
  descripcion: '',
  precio: ''
})

// EVENTO: Cargar suscripciones al montar el componente
const cargarSuscripciones = async () => {
  try {
    // TODO: Reemplazar con llamada a API real
    const preciosData = await import('../../../../public/data/precios.json')
    suscripciones.value = preciosData.default.map((item, index) => ({
      id: index + 1,
      ...item
    }))
    console.log('Suscripciones cargadas:', suscripciones.value)
  } catch (error) {
    console.error('Error cargando suscripciones:', error)
    // Datos de ejemplo en caso de error
    suscripciones.value = [
      { id: 1, descripcion: "5 Días a la semana", precio: "$30.000" },
      { id: 2, descripcion: "3 Días a la semana", precio: "$20.000" },
      { id: 3, descripcion: "2 Días a la semana", precio: "$15.000" },
      { id: 4, descripcion: "Día Libre", precio: "$3.000" }
    ]
  }
}

// Iniciar transición hacia el formulario
const iniciarTransicionAFormulario = () => {
  nuevaSuscripcion.value = { descripcion: '', precio: '' }
  suscripcionEditando.value = null
  transicionEnProgreso.value = true
  // mostrarFormulario se activará después de que el botón desaparezca
}

// Mostrar formulario después de que el botón desaparezca
const mostrarFormularioDespuesDeBotón = () => {
  mostrarFormulario.value = true
}

// Iniciar transición hacia el botón
const iniciarTransicionABoton = () => {
  mostrarFormulario.value = false
  suscripcionEditando.value = null
  nuevaSuscripcion.value = { descripcion: '', precio: '' }
  // transicionEnProgreso se desactivará después de que el formulario desaparezca
}

// EVENTO: Editar suscripción existente
const editarSuscripcion = (suscripcion) => {
  nuevaSuscripcion.value = { ...suscripcion }
  suscripcionEditando.value = suscripcion.id
  transicionEnProgreso.value = true
  // mostrarFormulario se activará después de que el botón desaparezca
}

// EVENTO: Guardar suscripción (crear o actualizar)
const guardarSuscripcion = () => {
  if (!nuevaSuscripcion.value.descripcion || !nuevaSuscripcion.value.precio) {
    mensajeConfirmacion.value = 'Por favor completa todos los campos'
    setTimeout(() => { mensajeConfirmacion.value = '' }, 3000)
    return
  }

  if (suscripcionEditando.value) {
    // EVENTO: Actualizar suscripción existente
    const index = suscripciones.value.findIndex(s => s.id === suscripcionEditando.value)
    if (index !== -1) {
      suscripciones.value[index] = { ...nuevaSuscripcion.value, id: suscripcionEditando.value }
      mensajeConfirmacion.value = 'Suscripción actualizada correctamente'
    }
  } else {
    // EVENTO: Crear nueva suscripción
    const nuevoId = Math.max(...suscripciones.value.map(s => s.id), 0) + 1
    suscripciones.value.push({
      id: nuevoId,
      ...nuevaSuscripcion.value
    })
    mensajeConfirmacion.value = 'Suscripción creada correctamente'
  }

  mostrarFormulario.value = false
  suscripcionEditando.value = null
  
  setTimeout(() => { mensajeConfirmacion.value = '' }, 3000)
}

// EVENTO: Eliminar suscripción
const eliminarSuscripcion = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta suscripción?')) {
    // EVENTO: Eliminar suscripción
    suscripciones.value = suscripciones.value.filter(s => s.id !== id)
    mensajeConfirmacion.value = 'Suscripción eliminada correctamente'
    setTimeout(() => { mensajeConfirmacion.value = '' }, 3000)
  }
}

// Cargar suscripciones al montar el componente
onMounted(() => {
  cargarSuscripciones()
})
</script>

<style scoped>
.contenedor-suscripciones {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
}

.encabezado-suscripciones {
  text-align: center;
  margin-bottom: 2rem;
}

.titulo {
  font-size: 2.2rem;
  color: #e91e63;
  margin-bottom: 0.5rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
}

.subtitulo {
  color: #666;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* Botón agregar */
.contenedor-boton-agregar {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn-agregar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #C2185B;
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(194, 24, 91, 0.3);
}

.btn-agregar:hover {
  background: #AD1457;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(194, 24, 91, 0.4);
}

/* Animaciones secuenciales */
.fade-scale-enter-active {
  transition: all 0.3s ease-out;
}
.fade-scale-leave-active {
  transition: all 0.3s ease-in;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.slide-down-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Formulario */
.formulario-suscripcion {
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
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
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

/* Lista de suscripciones */
.lista-suscripciones {
  margin-top: 2rem;
}

.sin-suscripciones {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.sin-suscripciones i {
  margin-bottom: 1rem;
  color: #adb5bd;
  font-size: 3rem;
  opacity: 0.7;
}

/* Animaciones para las tarjetas */
.list-enter-active {
  transition: all 0.4s ease;
}
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.list-move {
  transition: transform 0.4s ease;
}

.tarjetas-suscripciones {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.tarjeta-suscripcion {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  overflow: hidden;
}

.tarjeta-suscripcion:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.contenido-tarjeta {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-suscripcion {
  flex: 1;
}

.descripcion {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
  line-height: 1.4;
}

.precio {
  font-size: 1.4rem;
  color: #e91e63;
  font-weight: 700;
  margin: 0;
}

.acciones-tarjeta {
  display: flex;
  gap: 0.5rem;
}

.btn-accion {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-editar {
  background: #FF9800;
  color: white;
  box-shadow: 0 2px 6px rgba(255, 152, 0, 0.3);
}

.btn-editar:hover {
  background: #F57C00;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(255, 152, 0, 0.4);
}

.btn-eliminar {
  background: #D32F2F;
  color: white;
  box-shadow: 0 2px 6px rgba(211, 47, 47, 0.3);
}

.btn-eliminar:hover {
  background: #C62828;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(211, 47, 47, 0.4);
}

/* Mensaje de confirmación */
.slide-in-enter-active {
  transition: all 0.3s ease-out;
}
.slide-in-leave-active {
  transition: all 0.2s ease-in;
}
.slide-in-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-in-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.mensaje-confirmacion {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #C2185B;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(194, 24, 91, 0.3);
  z-index: 1000;
}

.contenido-mensaje {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.btn-cerrar-mensaje {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.3rem;
  margin-left: 1rem;
  border-radius: 50%;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cerrar-mensaje:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .contenedor-suscripciones {
    padding: 1.5rem;
  }
  
  .titulo {
    font-size: 1.8rem;
  }
  
  .campos-formulario {
    grid-template-columns: 1fr;
  }
  
  .tarjetas-suscripciones {
    grid-template-columns: 1fr;
  }
  
  .contenido-tarjeta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .acciones-tarjeta {
    align-self: stretch;
    justify-content: center;
  }
  
  .botones-formulario {
    flex-direction: column;
  }
  
  .mensaje-confirmacion {
    top: 10px;
    right: 10px;
    left: 10px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .contenedor-suscripciones {
    padding: 1rem;
  }
  
  .titulo {
    font-size: 1.6rem;
  }
  
  .formulario-suscripcion {
    padding: 1.5rem;
  }
  
  .btn-agregar {
    width: 100%;
    justify-content: center;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>