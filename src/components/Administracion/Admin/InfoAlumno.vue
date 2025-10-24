<template>
  <div class="contenedor-info-alumno">
    <div class="encabezado-info" v-if="!mostrandoModificacion">
      <button class="btn-volver" @click="volverAlumnos">
        <i class="fas fa-arrow-left"></i>
        Volver a Alumnos
      </button>
      <h1 class="titulo">INFORMACIÓN DEL ALUMNO</h1>
    </div>

    <div v-if="mostrandoModificacion === 'datos'">
      <ModificarDatosAlumno
        :alumno="alumno"
        @guardar-cambios="manejarGuardarDatos"
        @cancelar="mostrandoModificacion = null"
      />
    </div>
    <div v-if="mostrandoModificacion === 'suscripcion-trabajo'">
      <ModificarSusTrabAlumno
        :alumno="alumno"
        :horarioAlumno="horariosAlumno"
        @guardar-cambios="manejarGuardarSuscripcionTrabajo"
        @cancelar="mostrandoModificacion = null"
      />
    </div>

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
        <DetallePersona :datos="alumno" />
        <div class="separador-seccion"></div>

        <div class="seccion-info">
          <TablaHorarios
            :horarios-alumno="horariosAlumno"
            :suscripcion="alumno.suscripcion"
            @horarios-actualizados="manejarHorariosActualizados"
          />
        </div>

        <div class="separador-seccion"></div>

        <div class="seccion-info">
          <h3 class="titulo-seccion">
            <i class="fas fa-history"></i>
            Historial de Cuotas
          </h3>
          <TablaCuota :modo="'infoAlumno'" :cuotas="cuotas" />
        </div>

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

    <div v-else-if="!mostrandoModificacion" class="sin-alumno">
         <i class="fas fa-exclamation-triangle fa-3x"></i>
         <h3>No se encontró información del alumno</h3>
         <p>Por favor, vuelve a la lista de alumnos</p>
         <button class="btn-volver-centrado" @click="volverAlumnos">
            <i class="fas fa-arrow-left"></i>
            Volver a Alumnos
         </button>
    </div>

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
import { ref, computed, onMounted } from 'vue'
import Estado from '../Estado.vue'
import TablaCuota from '../Usuario/TablaCuotas.vue'
import TablaHorarios from '../TablaHorarios.vue'
import ModificarDatosAlumno from './ModificarDatosAlumno.vue'
import ModificarSusTrabAlumno from './ModificarSusTrabAlumno.vue'
import DetallePersona from './DetallePersona.vue'; // <-- Importado

const props = defineProps({
  alumnoSeleccionado: Object
})

const emit = defineEmits(['volverAlumnos', 'actualizarHorarios'])

const mostrandoModificacion = ref(null)
const mensajeConfirmacion = ref('')
const alumnoID = computed(() => props.alumnoSeleccionado)



import { obtenerAlumnoPorDni, obtenerHorariosPorDni } from '@/api/services/alumnoService'
import { obtenerCuotasDeAlumno } from '@/api/services/cuotasService'
const loading = ref(false)
const alumno = ref(null)
const horariosAlumno = ref([])
const cuotas = ref([])
onMounted(async () => {
  loading.value = true
  try {
    if (alumnoID.value && alumnoID.value["dni"]) {
      const respuestaAlumno = await obtenerAlumnoPorDni(alumnoID.value["dni"])
      alumno.value = respuestaAlumno

      const respuestaHorarios = await obtenerHorariosPorDni(alumnoID.value["dni"])
      horariosAlumno.value = respuestaHorarios

      const respuestaCuotas = await obtenerCuotasDeAlumno(alumnoID.value["dni"])
      cuotas.value = respuestaCuotas
    }
  } catch (error) {
    console.error('Error al cargar la información del alumno:', error)
  } finally {
    loading.value = false
  }
})




const volverAlumnos = () => { emit('volverAlumnos') }

const manejarHorariosActualizados = (nuevosHorarios) => {
  console.log('Horarios actualizados:', nuevosHorarios)
  horariosAlumno.value = nuevosHorarios
}

const modificarDatos = () => { mostrandoModificacion.value = 'datos' }
const modificarSuscripcionTrabajo = () => { mostrandoModificacion.value = 'suscripcion-trabajo' }
const cambiarEstadoAlumno = () => {
    const nuevoEstado = !alumno.value.activo;
    alumno.value.activo = nuevoEstado;
    mensajeConfirmacion.value = nuevoEstado ? 'El alumno se activó correctamente' : 'El alumno se desactivó correctamente';
    setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
    console.log('Estado cambiado a:', alumno.value.activo ? 'ACTIVO' : 'INACTIVO');
}
const eliminarAlumno = () => { console.log('Eliminar alumno') }

const manejarGuardarDatos = (datosActualizados) => {
  alumno.value = { ...alumno.value, ...datosActualizados };
  mostrandoModificacion.value = null;
  mensajeConfirmacion.value = 'Los datos del alumno se actualizaron correctamente';
  setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
}
const manejarGuardarSuscripcionTrabajo = (datosActualizados) => {
  alumno.value = { ...alumno.value, ...datosActualizados.alumno };
  if (datosActualizados.horarios) {
    horariosAlumno.value = datosActualizados.horarios;
  }
  mostrandoModificacion.value = null;
  mensajeConfirmacion.value = 'La suscripción, trabajo y nivel se actualizaron correctamente';
  setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
}
</script>

<style scoped>
/* ESTILOS ORIGINALES COMPLETOS */
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

/* IMPORTANTE: Los estilos para .seccion-tabla, .titulo-seccion, etc. */
/* ahora deberían estar definidos DENTRO de DetallePersona.vue */
/* pero los mantenemos aquí por si se usan en las secciones específicas */

.separador-seccion {
  height: 1px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 2rem 0;
}

.seccion-info {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
}
/* Re-aplicamos estilo a h3 dentro de .seccion-info si DetallePersona no lo tiene */
.seccion-info .titulo-seccion {
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
.seccion-info .titulo-seccion i { color: #e91e63; }


.seccion-info:last-child {
  margin-bottom: 0;
}

.sin-alumno {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}
.sin-alumno i { margin-bottom: 1.5rem; color: #e9ecef; }
.sin-alumno h3 { margin-bottom: 1rem; color: #495057; font-size: 1.5rem; }
.sin-alumno p { margin-bottom: 2rem; font-size: 1rem; }
.btn-volver-centrado { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1.5rem; border: 2px solid #e91e63; background: white; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; font-family: 'Poppins', sans-serif; font-weight: 500; color: #e91e63; text-decoration: none; }
.btn-volver-centrado:hover { background: #e91e63; color: white; transform: translateY(-1px); }

.seccion-botones { margin-top: 3rem; padding-top: 2rem; border-top: 2px solid #e0e0e0; }
.botones-accion { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
.btn-accion { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem 1.5rem; border: none; border-radius: 10px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; }
.btn-modificar { background: #2196F3; color: white; }
.btn-modificar:hover { background: #1976D2; transform: translateY(-2px); }
.btn-suscripcion { background: #FF9800; color: white; }
.btn-suscripcion:hover { background: #F57C00; transform: translateY(-2px); }
.btn-estado { background: #4CAF50; color: white; }
.btn-estado:hover { background: #388E3C; transform: translateY(-2px); }
.btn-eliminar { background: #F44336; color: white; }
.btn-eliminar:hover { background: #D32F2F; transform: translateY(-2px); }

.mensaje-confirmacion { position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 1000; animation: slideIn 0.3s ease; }
.contenido-mensaje { display: flex; align-items: center; gap: 0.5rem; }
.btn-cerrar-mensaje { background: none; border: none; color: white; cursor: pointer; padding: 0.2rem; margin-left: 1rem; }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

@media (max-width: 1560px) { .botones-accion { grid-template-columns: repeat(2, 1fr); gap: 1rem; } }
@media (max-width: 768px) {
  .contenedor-info-alumno { padding: 1.5rem; }
  .encabezado-info { flex-direction: column; text-align: center; }
  .titulo { font-size: 1.6rem; }
  .tarjeta-header { padding: 1.5rem; flex-direction: column; gap: 1rem; text-align: center; }
  .nombre-completo { font-size: 1.5rem; }
  .tarjeta-contenido { padding: 1.5rem; }
  /* Los estilos responsive para .fila-tabla, .celda, etc. ahora deberían estar en DetallePersona.vue */
  .separador-seccion { margin: 1.5rem 0; }
  .seccion-info { padding: 1rem; }
  .botones-accion { grid-template-columns: 1fr; }
  .btn-accion { padding: 0.8rem 1rem; font-size: 0.9rem; }
  .mensaje-confirmacion { top: 10px; right: 10px; left: 10px; }
}
@media (max-width: 480px) {
  .contenedor-info-alumno { padding: 1rem; }
  .tarjeta-header { padding: 1rem; }
  .nombre-completo { font-size: 1.3rem; }
  .tarjeta-contenido { padding: 1rem; }
  /* Los estilos responsive para .celda, .valor, etc. ahora deberían estar en DetallePersona.vue */
  .separador-seccion { margin: 1rem 0; }
  .seccion-info { padding: 0.8rem; }
}
</style>