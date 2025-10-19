<template>
  <div class="contenedor-trabajos">
    <div class="encabezado-trabajos">
      <h1 class="titulo">TRABAJOS Y METODOLOGÍAS</h1>
      <p class="subtitulo">Gestiona los tipos de entrenamiento disponibles para los alumnos</p>
    </div>

    <transition name="fade-scale" @after-leave="mostrarFormularioDespuesDeBoton">
      <div v-if="!mostrarFormulario && !transicionEnProgreso" class="contenedor-boton-agregar">
        <button class="btn-agregar" @click="iniciarTransicionAFormulario">
          <i class="fas fa-plus"></i>
          Agregar Nueva Metodología
        </button>
      </div>
    </transition>

    <transition name="slide-down" @after-leave="transicionEnProgreso = false">
      <AgregarModificar
        v-if="mostrarFormulario"
        v-model="nuevoTrabajo"
        :es-edicion="trabajoEditando !== null"
        :config="configFormulario"
        @guardar="guardarTrabajo"
        @cancelar="iniciarTransicionABoton"
      />
    </transition>

    <Items
      :items="trabajos"
      :config="configLista"
      empty-message="No hay metodologías cargadas"
      empty-icon="fas fa-dumbbell"
      @editar="editarTrabajo"
      @eliminar="eliminarTrabajo"
    />

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
// Importamos los nuevos componentes
import AgregarModificar from './AgregarModificar.vue' // Ajusta la ruta si es necesario
import Items from './Items.vue' // Ajusta la ruta si es necesario

// --- Configuración para los componentes hijos ---
const configFormulario = {
  tituloSingular: 'Metodología',
  layout: 'stacked', // 1fr (apilado)
  campo1: { key: 'nombre', label: 'Nombre:', placeholder: 'Ej: Musculación', esTextarea: false },
  campo2: { key: 'descripcion', label: 'Descripción:', placeholder: 'Describe la metodología...', esTextarea: true }
}

const configLista = {
  key1: 'nombre',    // Propiedad para el título
  showKey2: false,   // NO mostramos el segundo campo
  key2: 'descripcion', // (Igual lo pasamos por si acaso)
  styleKey2: 'descripcion'
}
// ----------------------------------------------


// Estado de los trabajos (TODA LA LÓGICA SE MANTIENE EN EL PADRE)
const trabajos = ref([])
const mostrarFormulario = ref(false)
const trabajoEditando = ref(null) // Ahora guarda el ID
const mensajeConfirmacion = ref('')
const transicionEnProgreso = ref(false)

// Nuevo trabajo temporal (usada por v-model en AgregarModificar)
const nuevoTrabajo = ref({
  nombre: '',
  descripcion: ''
})

// EVENTO: Cargar trabajos al montar el componente
const cargarTrabajos = async () => {
  try {
    // TODO: Reemplazar con llamada a API real
    const metodologiasData = await import('../../../../public/data/metodologias.json')
    trabajos.value = metodologiasData.default.map((item, index) => ({
      id: index + 1,
      nombre: item.nombre,
      descripcion: item.descripcion
    }))
    console.log('Trabajos cargados:', trabajos.value)
  } catch (error) {
    console.error('Error cargando trabajos:', error)
    // Datos de ejemplo en caso de error
    trabajos.value = [
      { 
        id: 1, 
        nombre: "Musculación", 
        descripcion: "Entrenamiento centrado en el desarrollo de la masa muscular y fuerza con cargas progresivas." 
      },
      { 
        id: 2, 
        nombre: "Funcional", 
        descripcion: "Ejercicios que imitan movimientos de la vida diaria, mejorando la movilidad y estabilidad general." 
      }
    ]
  }
}

// FUNCIÓN DE SCROLL INMEDIATO (Se mantiene por si el formulario queda lejos)
const scrollArribaInmediato = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Iniciar transición hacia el formulario (para "Agregar")
const iniciarTransicionAFormulario = () => {
  nuevoTrabajo.value = { nombre: '', descripcion: '' } // Limpiamos el v-model
  trabajoEditando.value = null
  transicionEnProgreso.value = true
  scrollArribaInmediato()
}

// Mostrar formulario después de que el botón desaparezca
const mostrarFormularioDespuesDeBoton = () => {
  mostrarFormulario.value = true
}

// Iniciar transición hacia el botón (para "Cancelar")
const iniciarTransicionABoton = () => {
  mostrarFormulario.value = false
  trabajoEditando.value = null
  nuevoTrabajo.value = { nombre: '', descripcion: '' }
}

// EVENTO: Editar trabajo existente (lo llama el @editar de Items)
const editarTrabajo = (trabajo) => {
  // Copiamos los datos del item al v-model del formulario
  nuevoTrabajo.value = { ...trabajo }
  trabajoEditando.value = trabajo.id
  
  if (!mostrarFormulario.value) {
    transicionEnProgreso.value = true // Oculta el botón
  }
  mostrarFormulario.value = true // Mostramos el formulario
  scrollArribaInmediato()
}

// EVENTO: Guardar trabajo (lo llama el @guardar de AgregarModificar)
const guardarTrabajo = () => {
  // Leemos los datos directamente desde el v-model (nuevoTrabajo)
  if (!nuevoTrabajo.value.nombre || !nuevoTrabajo.value.descripcion) {
    mensajeConfirmacion.value = 'Por favor completa todos los campos obligatorios'
    setTimeout(() => { mensajeConfirmacion.value = '' }, 3000)
    return
  }
  
  if (trabajoEditando.value) {
    // EVENTO: Actualizar trabajo existente
    const index = trabajos.value.findIndex(t => t.id === trabajoEditando.value)
    if (index !== -1) {
      trabajos.value[index] = { 
        ...nuevoTrabajo.value, 
        id: trabajoEditando.value,
      }
      mensajeConfirmacion.value = 'Metodología actualizada correctamente'
    }
  } else {
    // EVENTO: Crear nuevo trabajo
    const nuevoId = Math.max(...trabajos.value.map(t => t.id), 0) + 1
    trabajos.value.push({
      id: nuevoId,
      ...nuevoTrabajo.value,
    })
    mensajeConfirmacion.value = 'Metodología creada correctamente'
  }

  // Usamos la misma función de "Cancelar" para cerrar el formulario
  iniciarTransicionABoton()
  
  setTimeout(() => { mensajeConfirmacion.value = '' }, 3000)
}

// EVENTO: Eliminar trabajo (lo llama el @eliminar de Items)
const eliminarTrabajo = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta metodología?')) {
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
/* Estilos del Contenedor, Encabezado, Botón Agregar y Mensaje */
/* Todos los estilos del formulario y la lista se fueron a los hijos */
/* CSS limpiado de caracteres inválidos */

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
    
  .btn-agregar {
    width: 100%;
    justify-content: center;
  }
}
</style>