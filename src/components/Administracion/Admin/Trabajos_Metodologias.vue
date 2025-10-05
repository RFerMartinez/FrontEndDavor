<template>
  <div class="contenedor-trabajos" ref="contenedorPrincipal">
    <!-- Encabezado -->
    <div class="encabezado-trabajos">
      <h1 class="titulo">TRABAJOS Y METODOLOGÍAS</h1>
      <p class="subtitulo">Gestiona los tipos de entrenamiento disponibles para los alumnos</p>
    </div>

    <!-- Botón para agregar nuevo trabajo -->
    <transition name="fade-scale" @after-leave="mostrarFormularioDespuesDeBoton">
      <div v-if="!mostrarFormulario && !transicionEnProgreso" class="contenedor-boton-agregar">
        <button class="btn-agregar" @click="iniciarTransicionAFormulario">
          <i class="fas fa-plus"></i>
          Agregar Nueva Metodología
        </button>
      </div>
    </transition>

    <!-- Formulario para agregar/editar trabajo -->
    <transition name="slide-down" @after-leave="transicionEnProgreso = false">
      <div v-if="mostrarFormulario" class="formulario-trabajo">
        <h3 class="titulo-formulario">
          {{ trabajoEditando ? 'Editar Metodología' : 'Nueva Metodología' }}
        </h3>
        
        <div class="campos-formulario">
          <div class="campo">
            <label for="nombre">Nombre:</label>
            <input
              id="nombre"
              v-model="nuevoTrabajo.nombre"
              type="text"
              placeholder="Ej: Musculación"
              class="input-text"
            >
          </div>
          
          <div class="campo campo-imagen">
            <label for="imagen">Imagen:</label>
            <div class="contenedor-input-imagen">
              <input
                id="imagen"
                type="file"
                accept="image/*"
                @change="manejarSeleccionImagen"
                class="input-file"
              >
              <label for="imagen" class="label-file">
                <i class="fas fa-upload"></i>
                {{ imagenSeleccionada ? 'Cambiar imagen' : 'Seleccionar imagen' }}
              </label>
              <span v-if="imagenSeleccionada" class="nombre-archivo">
                {{ imagenSeleccionada.name }}
              </span>
            </div>
            <div v-if="trabajoEditando && !imagenSeleccionada" class="imagen-actual">
              <img :src="nuevoTrabajo.imagen" :alt="nuevoTrabajo.nombre" class="vista-previa">
              <span class="texto-ayuda">Imagen actual</span>
            </div>
          </div>
          
          <div class="campo campo-descripcion">
            <label for="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              v-model="nuevoTrabajo.descripcion"
              placeholder="Describe la metodología de entrenamiento..."
              class="input-textarea"
              rows="4"
            ></textarea>
          </div>
        </div>

        <div class="botones-formulario">
          <button class="btn btn-guardar" @click="guardarTrabajo">
            <i class="fas fa-save"></i>
            {{ trabajoEditando ? 'Actualizar' : 'Guardar' }}
          </button>
          
          <button class="btn btn-cancelar" @click="iniciarTransicionABoton">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
        </div>
      </div>
    </transition>

    <!-- Lista de trabajos -->
    <div class="lista-trabajos">
      <div v-if="trabajos.length === 0" class="sin-trabajos">
        <i class="fas fa-dumbbell fa-2x"></i>
        <p>No hay metodologías cargadas</p>
      </div>

      <transition-group v-else name="list" tag="div" class="tarjetas-trabajos">
        <div
          v-for="trabajo in trabajos"
          :key="trabajo.id"
          class="tarjeta-trabajo"
        >
          <div class="imagen-trabajo">
            <img :src="trabajo.imagen" :alt="trabajo.nombre" class="img-trabajo">
          </div>
          <div class="contenido-tarjeta">
            <div class="info-trabajo">
              <h3 class="nombre">{{ trabajo.nombre }}</h3>
              <p class="descripcion">{{ trabajo.descripcion }}</p>
            </div>
            
            <div class="acciones-tarjeta">
              <button
                class="btn-accion btn-editar"
                @click="editarTrabajo(trabajo)"
                title="Editar metodología"
              >
                <i class="fas fa-edit"></i>
              </button>
              
              <button
                class="btn-accion btn-eliminar"
                @click="eliminarTrabajo(trabajo.id)"
                title="Eliminar metodología"
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

// Estado de los trabajos
const trabajos = ref([])
const mostrarFormulario = ref(false)
const trabajoEditando = ref(null)
const mensajeConfirmacion = ref('')
const transicionEnProgreso = ref(false)
const imagenSeleccionada = ref(null)

// Nuevo trabajo temporal
const nuevoTrabajo = ref({
  nombre: '',
  imagen: '',
  descripcion: ''
})

// EVENTO: Cargar trabajos al montar el componente
const cargarTrabajos = async () => {
  try {
    // TODO: Reemplazar con llamada a API real
    const metodologiasData = await import('../../../../public/data/metodologias.json')
    trabajos.value = metodologiasData.default.map((item, index) => ({
      id: index + 1,
      ...item
    }))
    console.log('Trabajos cargados:', trabajos.value)
  } catch (error) {
    console.error('Error cargando trabajos:', error)
    // Datos de ejemplo en caso de error
    trabajos.value = [
      { 
        id: 1, 
        nombre: "Musculación", 
        imagen: "/data/imgMetod/musculacion.jpg", 
        descripcion: "Entrenamiento centrado en el desarrollo de la masa muscular y fuerza con cargas progresivas." 
      },
      { 
        id: 2, 
        nombre: "Funcional", 
        imagen: "img/metodologias/funcional.jpg", 
        descripcion: "Ejercicios que imitan movimientos de la vida diaria, mejorando la movilidad y estabilidad general." 
      }
    ]
  }
}

// Manejar selección de imagen
const manejarSeleccionImagen = (event) => {
  const file = event.target.files[0]
  if (file) {
    imagenSeleccionada.value = file
    // Crear URL temporal para vista previa
    nuevoTrabajo.value.imagen = URL.createObjectURL(file)
  }
}

// FUNCIÓN DE SCROLL INMEDIATO
const scrollArribaInmediato = () => {
  // Scroll inmediato sin delay
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Iniciar transición hacia el formulario
const iniciarTransicionAFormulario = () => {
  nuevoTrabajo.value = { nombre: '', imagen: '', descripcion: '' }
  imagenSeleccionada.value = null
  trabajoEditando.value = null
  transicionEnProgreso.value = true
  // Scroll inmediato
  scrollArribaInmediato()
}

// Mostrar formulario después de que el botón desaparezca
const mostrarFormularioDespuesDeBoton = () => {
  mostrarFormulario.value = true
}

// Iniciar transición hacia el botón
const iniciarTransicionABoton = () => {
  mostrarFormulario.value = false
  trabajoEditando.value = null
  nuevoTrabajo.value = { nombre: '', imagen: '', descripcion: '' }
  imagenSeleccionada.value = null
}

// EVENTO: Editar trabajo existente
const editarTrabajo = (trabajo) => {
  nuevoTrabajo.value = { ...trabajo }
  imagenSeleccionada.value = null
  trabajoEditando.value = trabajo.id
  transicionEnProgreso.value = true
  
  // Scroll inmediato ANTES de mostrar el formulario
  scrollArribaInmediato()
  
  // Mostrar formulario
  mostrarFormulario.value = true
}

// EVENTO: Guardar trabajo (crear o actualizar)
const guardarTrabajo = () => {
  if (!nuevoTrabajo.value.nombre || !nuevoTrabajo.value.descripcion) {
    mensajeConfirmacion.value = 'Por favor completa todos los campos obligatorios'
    setTimeout(() => { mensajeConfirmacion.value = '' }, 3000)
    return
  }

  // TODO: Aquí deberías implementar la lógica para guardar la imagen
  // en la ruta ../../../../public/data/imgMetod/ con el nombre de la metodología
  if (imagenSeleccionada.value) {
    console.log('Imagen a guardar:', imagenSeleccionada.value)
    console.log('Ruta destino:', `../../../../public/data/imgMetod/${nuevoTrabajo.value.nombre.toLowerCase().replace(/\s+/g, '_')}.jpg`)
  }

  if (trabajoEditando.value) {
    // EVENTO: Actualizar trabajo existente
    const index = trabajos.value.findIndex(t => t.id === trabajoEditando.value)
    if (index !== -1) {
      trabajos.value[index] = { 
        ...nuevoTrabajo.value, 
        id: trabajoEditando.value,
        // En una implementación real, aquí actualizarías la ruta de la imagen
        imagen: imagenSeleccionada.value ? `/data/imgMetod/${nuevoTrabajo.value.nombre.toLowerCase().replace(/\s+/g, '_')}.jpg` : nuevoTrabajo.value.imagen
      }
      mensajeConfirmacion.value = 'Metodología actualizada correctamente'
    }
  } else {
    // EVENTO: Crear nuevo trabajo
    const nuevoId = Math.max(...trabajos.value.map(t => t.id), 0) + 1
    trabajos.value.push({
      id: nuevoId,
      ...nuevoTrabajo.value,
      // En una implementación real, aquí guardarías la imagen y usarías la nueva ruta
      imagen: imagenSeleccionada.value ? `/data/imgMetod/${nuevoTrabajo.value.nombre.toLowerCase().replace(/\s+/g, '_')}.jpg` : 'img/metodologias/default.jpg'
    })
    mensajeConfirmacion.value = 'Metodología creada correctamente'
  }

  mostrarFormulario.value = false
  trabajoEditando.value = null
  imagenSeleccionada.value = null
  
  setTimeout(() => { mensajeConfirmacion.value = '' }, 3000)
}

// EVENTO: Eliminar trabajo
const eliminarTrabajo = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta metodología?')) {
    // EVENTO: Eliminar trabajo
    // TODO: Aquí también deberías eliminar la imagen del servidor
    trabajos.value = trabajos.value.filter(t => t.id !== id)
    mensajeConfirmacion.value = 'Metodología eliminada correctamente'
    setTimeout(() => { mensajeConfirmacion.value = '' }, 3000)
  }
}

// Cargar trabajos al montar el componente
onMounted(() => {
  cargarTrabajos()
})
</script>

<style scoped>
.contenedor-trabajos {
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

.encabezado-trabajos {
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

/* Animaciones secuenciales - MÁS RÁPIDAS */
.fade-scale-enter-active {
  transition: all 0.2s ease-out;
}
.fade-scale-leave-active {
  transition: all 0.2s ease-in;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.slide-down-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-down-leave-active {
  transition: all 0.25s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-15px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Formulario */
.formulario-trabajo {
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
  grid-template-columns: 1fr;
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

/* Estilos para el campo de imagen */
.campo-imagen {
  position: relative;
}

.contenedor-input-imagen {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.input-file {
  display: none;
}

.label-file {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: #2196F3;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.label-file:hover {
  background: #1976D2;
  transform: translateY(-1px);
}

.nombre-archivo {
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
}

.imagen-actual {
  margin-top: 1rem;
  text-align: center;
}

.vista-previa {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.texto-ayuda {
  display: block;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.85rem;
}

/* Campo de descripción */
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

/* Lista de trabajos */
.lista-trabajos {
  margin-top: 2rem;
}

.sin-trabajos {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.sin-trabajos i {
  margin-bottom: 1rem;
  color: #adb5bd;
  font-size: 3rem;
  opacity: 0.7;
}

/* Animaciones para las tarjetas - MÁS RÁPIDAS */
.list-enter-active {
  transition: all 0.3s ease;
}
.list-leave-active {
  transition: all 0.25s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-15px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(15px);
}
.list-move {
  transition: transform 0.3s ease;
}

.tarjetas-trabajos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.tarjeta-trabajo {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tarjeta-trabajo:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.imagen-trabajo {
  height: 200px;
  overflow: hidden;
}

.img-trabajo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.tarjeta-trabajo:hover .img-trabajo {
  transform: scale(1.05);
}

.contenido-tarjeta {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.info-trabajo {
  flex: 1;
  margin-bottom: 1rem;
}

.nombre {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 0.8rem;
  font-weight: 700;
}

.descripcion {
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.acciones-tarjeta {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
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

/* Mensaje de confirmación - MÁS RÁPIDO */
.slide-in-enter-active {
  transition: all 0.25s ease-out;
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
  .contenedor-trabajos {
    padding: 1.5rem;
  }
  
  .titulo {
    font-size: 1.8rem;
  }
  
  .tarjetas-trabajos {
    grid-template-columns: 1fr;
  }
  
  .contenedor-input-imagen {
    flex-direction: column;
    align-items: flex-start;
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
  .contenedor-trabajos {
    padding: 1rem;
  }
  
  .titulo {
    font-size: 1.6rem;
  }
  
  .formulario-trabajo {
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
  
  .imagen-trabajo {
    height: 150px;
  }
}
</style>