<template>
  <div class="contenedor-info-alumno">
    <!-- Encabezado con botón volver -->
    <div class="encabezado-info" v-if="!mostrandoModificacion">
      <button class="btn-volver" @click="volverAlumnos">
        <i class="fas fa-arrow-left"></i>
        Volver a Alumnos
      </button>
      <h1 class="titulo">INFORMACIÓN DEL ALUMNO</h1>
    </div>

    <!-- Mostrar componente de modificación de datos -->
    <div v-if="mostrandoModificacion === 'datos'">
      <ModificarDatosAlumno 
        :alumno="alumno"
        @guardar-cambios="manejarGuardarDatos"
        @cancelar="mostrandoModificacion = null"
      />
    </div>

    <!-- Mostrar componente de modificación de suscripción y trabajo -->
    <div v-if="mostrandoModificacion === 'suscripcion-trabajo'">
      <ModificarSusTrabAlumno 
        :alumno="alumno"
        :horarioAlumno="horariosAlumno"
        @guardar-cambios="manejarGuardarSuscripcionTrabajo"
        @cancelar="mostrandoModificacion = null"
      />
    </div>

    <!-- Tarjeta de información del alumno (solo se muestra cuando no estamos modificando) -->
    <div class="tarjeta-alumno" v-if="alumno && !mostrandoModificacion">
      <div class="tarjeta-header">
        <div class="info-principal">
          <h2 class="nombre-completo">{{ alumno.nombre }} {{ alumno.apellido }}</h2>
          <p class="dni-alumno">DNI: {{ alumno.dni }}</p>
        </div>
        <div class="estado-alumno">
          <Estado :positivo="alumno.activo" :texto="alumno.activo ? 'ACTIVO' : 'INACTIVO'" />
        </div>
      </div>

      <div class="tarjeta-contenido">
        <!-- Información Personal -->
        <div class="seccion-tabla">
          <h3 class="titulo-seccion">
            <i class="fas fa-user"></i>
            Información Personal
          </h3>
          <div class="tabla-datos">
            <div class="fila-tabla">
              <div class="celda etiqueta">Nombre:</div>
              <div class="celda valor">{{ alumno.nombre }}</div>
              <div class="celda etiqueta">Apellido:</div>
              <div class="celda valor">{{ alumno.apellido }}</div>
            </div>
            <div class="fila-tabla">
              <div class="celda etiqueta">DNI:</div>
              <div class="celda valor">{{ alumno.dni }}</div>
              <div class="celda etiqueta">Email:</div>
              <div class="celda valor">{{ alumno.email }}</div>
            </div>
            <div class="fila-tabla">
              <div class="celda etiqueta">Teléfono:</div>
              <div class="celda valor">{{ alumno.telefono }}</div>
              <div class="celda etiqueta"></div>
              <div class="celda valor"></div>
            </div>
          </div>
        </div>

        <!-- Separador visual -->
        <div class="separador-seccion"></div>

        <!-- Dirección -->
        <div class="seccion-tabla">
          <h3 class="titulo-seccion">
            <i class="fas fa-map-marker-alt"></i>
            Dirección
          </h3>
          <div class="tabla-datos">
            <div class="fila-tabla">
              <div class="celda etiqueta">Provincia:</div>
              <div class="celda valor">{{ alumno.provincia }}</div>
              <div class="celda etiqueta">Localidad:</div>
              <div class="celda valor">{{ alumno.localidad }}</div>
            </div>
            <div class="fila-tabla">
              <div class="celda etiqueta">Calle:</div>
              <div class="celda valor">{{ alumno.Calle }}</div>
              <div class="celda etiqueta">Número:</div>
              <div class="celda valor">{{ alumno.nro }}</div>
            </div>
          </div>
        </div>

        <!-- Separador visual -->
        <div class="separador-seccion"></div>

        <!-- Información del Gimnasio -->
        <div class="seccion-tabla">
          <h3 class="titulo-seccion">
            <i class="fas fa-dumbbell"></i>
            Información del Gimnasio
          </h3>
          <div class="tabla-datos">
            <div class="fila-tabla">
              <div class="celda etiqueta">Turno:</div>
              <div class="celda valor">{{ alumno.turno }}</div>
              <div class="celda etiqueta">Suscripción:</div>
              <div class="celda valor">{{ alumno.suscripcion }}</div>
            </div>
            <div class="fila-tabla">
              <div class="celda etiqueta">Trabajo Actual:</div>
              <div class="celda valor">{{ alumno.trabajoactual }}</div>
              <div class="celda etiqueta"></div>
              <div class="celda valor"></div>
            </div>
          </div>
        </div>

        <!-- Separador visual -->
        <div class="separador-seccion"></div>

        <!-- Estado y Cuotas -->
        <div class="seccion-tabla">
          <h3 class="titulo-seccion">
            <i class="fas fa-chart-bar"></i>
            Estado y Cuotas
          </h3>
          <div class="tabla-datos">
            <div class="fila-tabla">
              <div class="celda etiqueta">Estado:</div>
              <div class="celda valor">
                <Estado :positivo="alumno.activo" :texto="alumno.activo ? 'ACTIVO' : 'INACTIVO'" />
              </div>
              <div class="celda etiqueta">Cuotas Pendientes:</div>
              <div class="celda valor">
                <span class="badge-cuota" :class="{'ninguna': alumno.cuotasPendientes === 0}">
                  {{ alumno.cuotasPendientes }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Separador visual -->
        <div class="separador-seccion"></div>

        <!-- Sección de Horarios -->
        <div class="seccion-info">
          <TablaHorarios 
            :horarios-alumno="horariosAlumno"
            :suscripcion="alumno.suscripcion"
            @horarios-actualizados="manejarHorariosActualizados"
          />
        </div>

        <!-- Separador visual -->
        <div class="separador-seccion"></div>

        <!-- Sección de Historial de Cuotas -->
        <div class="seccion-info">
          <h3 class="titulo-seccion">
            <i class="fas fa-history"></i>
            Historial de Cuotas
          </h3>
          <TablaCuota :modo="'infoAlumno'" :cuotas="cuotas" />
        </div>

        <!-- Botones de acciones -->
        <div class="seccion-botones">
          <div class="botones-accion">
            <button class="btn-accion btn-modificar" @click="modificarDatos">
              <i class="fas fa-edit"></i>
              Modificar Datos
            </button>
            
            <button class="btn-accion btn-suscripcion" @click="modificarSuscripcionTrabajo">
              <i class="fas fa-sync-alt"></i>
              Modificar Suscripción y Trabajo
            </button>
            
            <button class="btn-accion btn-estado" @click="cambiarEstadoAlumno">
              <i class="fas fa-power-off"></i>
              {{ alumno.activo ? 'Poner Inactivo' : 'Activar Alumno' }}
            </button>
            
            <button class="btn-accion btn-eliminar" @click="eliminarAlumno">
              <i class="fas fa-trash"></i>
              Eliminar Alumno
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje si no hay alumno seleccionado -->
    <div v-else-if="!mostrandoModificacion" class="sin-alumno">
      <i class="fas fa-exclamation-triangle fa-3x"></i>
      <h3>No se encontró información del alumno</h3>
      <p>Por favor, vuelve a la lista de alumnos</p>
      <button class="btn-volver-centrado" @click="volverAlumnos">
        <i class="fas fa-arrow-left"></i>
        Volver a Alumnos
      </button>
    </div>

    <!-- Mensaje de confirmación -->
    <div v-if="mensajeConfirmacion" class="mensaje-confirmacion" :class="{'mostrar': mensajeConfirmacion}">
      <div class="contenido-mensaje">
        <i class="fas fa-check-circle"></i>
        <span>{{ mensajeConfirmacion }}</span>
        <button class="btn-cerrar-mensaje" @click="mensajeConfirmacion = ''">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Estado from '../Estado.vue'
import TablaCuota from '../Usuario/TablaCuotas.vue'
import TablaHorarios from '../TablaHorarios.vue'
import ModificarDatosAlumno from './ModificarDatosAlumno.vue'
import ModificarSusTrabAlumno from './ModificarSusTrabAlumno.vue'

const props = defineProps({
  alumnoSeleccionado: Object
})

const emit = defineEmits(['volverAlumnos', 'actualizarHorarios'])

// Controlar qué componente de modificación mostrar
const mostrandoModificacion = ref(null)

// Mensaje de confirmación
const mensajeConfirmacion = ref('')

// Para identificar al alumno 
const alumnoID = computed(() => props.alumnoSeleccionado)

// Datos completos del alumno
const alumno = ref({
  dni: "48573921",
  nombre: "Lucía",
  apellido: "Ortega",
  email: "lucia_ortega@gmail.com",
  telefono: "+543731457384",
  activo: false,
  cuotasPendientes: 5,
  turno: "Tarde",
  suscripcion: "2 Días a la semana",
  trabajoactual: "Musculacion",
  provincia: "Chaco",
  localidad: "Las Breñas",
  Calle: "Republica Chaca",
  nro: "235",
})

// Datos de horarios del alumno
const horariosAlumno = ref([
  {
    dia: "Lunes",
    horario: "10:00-13:00"
  },
  {
    dia: "Viernes",
    horario: "10:00-13:00"
  }
])

// Datos de cuotas
const cuotas = ref([
  {
    mes: "Junio",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: false
  },
  {
    mes: "Mayo",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: false
  },
  {
    mes: "Abril",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Marzo",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Febrero",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  },
  {
    mes: "Enero",
    anio: "2025",
    trabajo: "Musculación",
    suscripcion: "3 días a la semana",
    monto: 20000,
    pagada: true
  }
])

const volverAlumnos = () => {
  emit('volverAlumnos')
}

const manejarHorariosActualizados = (nuevosHorarios) => {
  console.log('Horarios actualizados:', nuevosHorarios)
  horariosAlumno.value = nuevosHorarios
  emit('actualizarHorarios', nuevosHorarios)
}

// Funciones para los botones
const modificarDatos = () => {
  mostrandoModificacion.value = 'datos'
}

const modificarSuscripcionTrabajo = () => {
  mostrandoModificacion.value = 'suscripcion-trabajo'
}

const cambiarEstadoAlumno = () => {
  const nuevoEstado = !alumno.value.activo
  alumno.value.activo = nuevoEstado
  
  // Mostrar mensaje de confirmación
  mensajeConfirmacion.value = nuevoEstado ? 'El alumno se activó correctamente' : 'El alumno se desactivó correctamente'
  
  // Ocultar mensaje después de 3 segundos
  setTimeout(() => {
    mensajeConfirmacion.value = ''
  }, 3000)
  
  console.log('Estado cambiado a:', alumno.value.activo ? 'ACTIVO' : 'INACTIVO')
}

const eliminarAlumno = () => {
  console.log('Eliminar alumno')
}

// Manejar guardado de datos desde los componentes hijos
const manejarGuardarDatos = (datosActualizados) => {
  // Actualizar los datos del alumno
  alumno.value = { ...alumno.value, ...datosActualizados }
  
  // Volver a la vista principal
  mostrandoModificacion.value = null
  
  // Mostrar mensaje de confirmación
  mensajeConfirmacion.value = 'Los datos del alumno se actualizaron correctamente'
  
  // Ocultar mensaje después de 3 segundos
  setTimeout(() => {
    mensajeConfirmacion.value = ''
  }, 3000)
}

const manejarGuardarSuscripcionTrabajo = (datosActualizados) => {
  // Actualizar suscripción y trabajo
  alumno.value = { ...alumno.value, ...datosActualizados.alumno }
  
  // Actualizar horarios si se enviaron
  if (datosActualizados.horarios) {
    horariosAlumno.value = datosActualizados.horarios
  }
  
  // Volver a la vista principal
  mostrandoModificacion.value = null
  
  // Mostrar mensaje de confirmación
  mensajeConfirmacion.value = 'La suscripción y trabajo se actualizaron correctamente'
  
  // Ocultar mensaje después de 3 segundos
  setTimeout(() => {
    mensajeConfirmacion.value = ''
  }, 3000)
}
</script>

<style scoped>
.contenedor-info-alumno {
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
  position: relative;
}

.encabezado-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-volver {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  border: 2px solid #e91e63;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #e91e63;
  text-decoration: none;
}

.btn-volver:hover {
  background: #e91e63;
  color: white;
  transform: translateY(-1px);
}

.titulo {
  font-size: 2rem;
  color: #e91e63;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  margin: 0;
}

.tarjeta-alumno {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tarjeta-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
}

.nombre-completo {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.dni-alumno {
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0;
  font-weight: 500;
}

.tarjeta-contenido {
  padding: 2rem;
}

/* Estilos mejorados para las secciones tipo tabla */
.seccion-tabla {
  margin-bottom: 2.5rem;
}

.titulo-seccion {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
  border-bottom: 2px solid #e91e63;
  padding-bottom: 0.5rem;
}

.titulo-seccion i {
  color: #e91e63;
}

.tabla-datos {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.fila-tabla {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  background: white;
}

.fila-tabla:last-child {
  border-bottom: none;
}

.celda {
  padding: 1.2rem 1.5rem;
  display: flex;
  align-items: center;
}

.etiqueta {
  font-weight: 600;
  color: #495057;
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  min-width: 180px;
  width: 180px;
  font-size: 1rem;
  justify-content: flex-start;
}

.valor {
  font-weight: 500;
  color: #2c3e50;
  background-color: white;
  font-size: 1.1rem;
  flex: 1;
  justify-content: flex-start;
  padding-left: 2rem;
  border-left: 1px solid #f0f0f0;
}

/* Mejorar la separación entre pares de campos */
.fila-tabla .celda:nth-child(2) {
  border-right: 1px solid #e0e0e0;
}

.fila-tabla .celda:nth-child(3) {
  border-right: none;
}

/* Badge de cuotas mejorado */
.badge-cuota {
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: #ffebee;
  color: #d32f2f;
  font-size: 1.1rem;
  min-width: 40px;
  text-align: center;
  display: inline-block;
}

.badge-cuota.ninguna {
  background-color: #e8f5e9;
  color: #2e7d32;
}

/* Separador visual entre secciones */
.separador-seccion {
  height: 1px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 2rem 0;
}

/* Estilos para las secciones existentes (horarios y cuotas) */
.seccion-info {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
}

.seccion-info:last-child {
  margin-bottom: 0;
}

.sin-alumno {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.sin-alumno i {
  margin-bottom: 1.5rem;
  color: #e9ecef;
}

.sin-alumno h3 {
  margin-bottom: 1rem;
  color: #495057;
  font-size: 1.5rem;
}

.sin-alumno p {
  margin-bottom: 2rem;
  font-size: 1rem;
}

.btn-volver-centrado {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: 2px solid #e91e63;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #e91e63;
  text-decoration: none;
}

.btn-volver-centrado:hover {
  background: #e91e63;
  color: white;
  transform: translateY(-1px);
}

/* Estilos para los botones de acción */
.seccion-botones {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
}

.botones-accion {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.btn-accion {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-modificar {
  background: #2196F3;
  color: white;
}

.btn-modificar:hover {
  background: #1976D2;
  transform: translateY(-2px);
}

.btn-suscripcion {
  background: #FF9800;
  color: white;
}

.btn-suscripcion:hover {
  background: #F57C00;
  transform: translateY(-2px);
}

.btn-estado {
  background: #4CAF50;
  color: white;
}

.btn-estado:hover {
  background: #388E3C;
  transform: translateY(-2px);
}

.btn-eliminar {
  background: #F44336;
  color: white;
}

.btn-eliminar:hover {
  background: #D32F2F;
  transform: translateY(-2px);
}

/* Estilos para el mensaje de confirmación */
.mensaje-confirmacion {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #4CAF50;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.contenido-mensaje {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cerrar-mensaje {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.2rem;
  margin-left: 1rem;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
/* Responsive */
@media (max-width: 1560px) {
  .botones-accion {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .contenedor-info-alumno {
    padding: 1.5rem;
  }
  
  .encabezado-info {
    flex-direction: column;
    text-align: center;
  }
  
  .titulo {
    font-size: 1.6rem;
  }
  
  .tarjeta-header {
    padding: 1.5rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .nombre-completo {
    font-size: 1.5rem;
  }
  
  .tarjeta-contenido {
    padding: 1.5rem;
  }
  
  .fila-tabla {
    flex-direction: column;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .celda {
    padding: 1rem;
    width: 100% !important;
    min-width: auto !important;
    border-right: none !important;
    border-bottom: 1px solid #f0f0f0;
    justify-content: space-between;
  }
  
  .celda:last-child {
    border-bottom: none;
  }
  
  .etiqueta {
    background-color: #f8f9fa;
    font-weight: 600;
    border-right: none;
  }
  
  .valor {
    border-left: none;
    padding-left: 1rem;
    justify-content: flex-end;
    text-align: right;
  }
  
  .separador-seccion {
    margin: 1.5rem 0;
  }
  
  .seccion-info {
    padding: 1rem;
  }
  
  .botones-accion {
    grid-template-columns: 1fr;
  }
  
  .btn-accion {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
  
  .mensaje-confirmacion {
    top: 10px;
    right: 10px;
    left: 10px;
  }
}

@media (max-width: 480px) {
  .contenedor-info-alumno {
    padding: 1rem;
  }
  
  .tarjeta-header {
    padding: 1rem;
  }
  
  .nombre-completo {
    font-size: 1.3rem;
  }
  
  .tarjeta-contenido {
    padding: 1rem;
  }
  
  .celda {
    padding: 0.8rem;
    font-size: 0.95rem;
  }
  
  .valor {
    font-size: 1rem;
  }
  
  .separador-seccion {
    margin: 1rem 0;
  }
  
  .seccion-info {
    padding: 0.8rem;
  }
}
</style>