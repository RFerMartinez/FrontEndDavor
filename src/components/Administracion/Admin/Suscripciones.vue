<template>
  <div class="contenedor-suscripciones">
    <div class="encabezado-suscripciones">
      <h1 class="titulo">SUSCRIPCIONES</h1>
      <p class="subtitulo">Gestiona las suscripciones disponibles para los alumnos</p>
    </div>

    <transition name="fade-scale" @after-leave="mostrarFormularioDespuesDeBotón">
      <div v-if="!mostrarFormulario && !transicionEnProgreso" class="contenedor-boton-agregar">
        <button class="btn-agregar" @click="iniciarTransicionAFormulario">
          <i class="fas fa-plus"></i>
          Agregar Nueva Suscripción
        </button>
      </div>
    </transition>

    <transition name="slide-down" @after-leave="transicionEnProgreso = false">
      <AgregarModificar
        v-if="mostrarFormulario"
        v-model="nuevaSuscripcion"
        :es-edicion="suscripcionEditando !== null"
        :config="configFormulario"
        @guardar="guardarSuscripcion"
        @cancelar="iniciarTransicionABoton"
      />
    </transition>

    <Items
      :items="suscripciones"
      :config="configLista"
      empty-message="No hay suscripciones cargadas"
      empty-icon="fas fa-info-circle"
      @editar="editarSuscripcion"
      @eliminar="eliminarSuscripcion"
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
  tituloSingular: 'Suscripción',
  layout: 'inline', // 1fr 1fr
  campo1: { key: 'descripcion', label: 'Descripción:', placeholder: 'Ej: 5 Días a la semana', esTextarea: false },
  campo2: { key: 'precio', label: 'Precio:', placeholder: 'Ej: $30.000', esTextarea: false }
}

const configLista = {
  key1: 'descripcion', // Propiedad para el título
  showKey2: true,      // Sí mostramos el segundo campo
  key2: 'precio',      // Propiedad para el detalle
  styleKey2: 'precio'  // Clase CSS para el detalle
}
// ----------------------------------------------


// Estado de las suscripciones (TODA LA LÓGICA SE MANTIENE EN EL PADRE)
const suscripciones = ref([])
const mostrarFormulario = ref(false)
const suscripcionEditando = ref(null) // Ahora guarda el ID
const mensajeConfirmacion = ref('')
const transicionEnProgreso = ref(false)

// Nueva suscripción temporal (usada por v-model en AgregarModificar)
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

// Iniciar transición hacia el formulario (para "Agregar")
const iniciarTransicionAFormulario = () => {
  nuevaSuscripcion.value = { descripcion: '', precio: '' } // Limpiamos el v-model
  suscripcionEditando.value = null
  transicionEnProgreso.value = true
  // mostrarFormulario se activará después de que el botón desaparezca
}

// Mostrar formulario después de que el botón desaparezca
const mostrarFormularioDespuesDeBotón = () => {
  mostrarFormulario.value = true
}

// Iniciar transición hacia el botón (para "Cancelar")
const iniciarTransicionABoton = () => {
  mostrarFormulario.value = false
  suscripcionEditando.value = null
  nuevaSuscripcion.value = { descripcion: '', precio: '' }
  // transicionEnProgreso se desactivará después de que el formulario desaparezca
}

// EVENTO: Editar suscripción existente (lo llama el @editar de Items)
const editarSuscripcion = (suscripcion) => {
  // Copiamos los datos del item al v-model del formulario
  nuevaSuscripcion.value = { ...suscripcion } 
  suscripcionEditando.value = suscripcion.id
  
  if (!mostrarFormulario.value) {
    transicionEnProgreso.value = true // Oculta el botón
    // El @after-leave se encargará de mostrar el formulario
  }
  // Si el formulario ya estaba visible, simplemente se actualizan los datos
  mostrarFormulario.value = true; // Forzamos la muestra por si acaso
}

// EVENTO: Guardar suscripción (lo llama el @guardar de AgregarModificar)
const guardarSuscripcion = () => {
  // Leemos los datos directamente desde el v-model (nuevaSuscripcion)
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

  // Usamos la misma función de "Cancelar" para cerrar el formulario
  iniciarTransicionABoton()
  
  setTimeout(() => { mensajeConfirmacion.value = '' }, 3000)
}

// EVENTO: Eliminar suscripción (lo llama el @eliminar de Items)
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
/* Estilos del Contenedor, Encabezado, Botón Agregar y Mensaje */
/* Todos los estilos del formulario y la lista se fueron a los hijos */
/* CSS limpiado de caracteres inválidos */

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
    
  .btn-agregar {
    width: 100%;
    justify-content: center;
  }
}
</style>