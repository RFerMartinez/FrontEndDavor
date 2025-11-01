<template>
  <div class="contenedor-info-alumno">
    <div class="encabezado-info" v-if="!mostrandoModificacion">
      <button class="btn-volver-global" @click="volverAlumnos">
        <i class="fas fa-arrow-left"></i>
        Volver a Alumnos
      </button>
      <Titulo texto="INFORMACIÓN DEL ALUMNO" />
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
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <span>Cargando información del alumno...</span>
    </div>
    <div class="tarjeta-alumno" v-else-if="alumno && !mostrandoModificacion">
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
          <template v-if="!mostrandoModificadorCuota">
            <TablaCuota 
              :modo="'infoAlumno'" 
              :cuotas="cuotas" 
              :cargando="loading"
              @solicitud-modificar-cuota="manejarSolicitudModificar"
              @solicitud-eliminar-cuota="manejarSolicitudEliminar"
            />
          </template>
          <template v-else>
            <ModificarCuota
              :cuota-original="cuotaParaModificar"
              @cancelar-modificacion="cancelarModificacionCuota"
              @guardar-modificacion-cuota="guardarModificacionCuota"
            />
          </template>
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
            <button 
              class="btn-accion" 
              :class="alumno.activo ? 'btn-estado-inactivo' : 'btn-estado-activo'" 
              @click="iniciarCambioEstado"
            >
              <i class="fas fa-power-off"></i>
              {{ alumno.activo ? 'Poner Inactivo' : 'Activar Alumno' }}
            </button>
            <button class="btn-accion btn-eliminar" @click="eliminarAlumno">
              <i class="fas fa-trash"></i>
              Eliminar Alumno
            </button>
          </div>
        </div>
        <Transition name="modal-fade">
          <div v-if="mostrarModalConfirmacionEstado" class="modal-overlay">
            
            <div class="modal-exito modal-confirmacion"> 
              
              <div class="modal-header-exito modal-header-advertencia"> 
                <i class="fas fa-exclamation-triangle"></i> <h3>Confirmar Cambio</h3>
              </div>
              
              <div class="modal-body-exito">
                <p v-if="alumno.activo">
                  ¿Está seguro que desea poner en inactivo a <strong>{{ alumno.nombre }} {{ alumno.apellido }}</strong>?
                </p>
                <p v-else>
                  ¿Está seguro que desea <strong>activar</strong> a {{ alumno.nombre }} {{ alumno.apellido }}?
                </p>
                <p v-if="alumno.activo" class="advertencia-modal"> 
                  Si confirma, se lo eliminará de los grupos a los que asiste y se le dejarán de generar las cuotas.
                </p>
              </div>
              
              <div class="modal-footer-exito">
                <button class="btn-modal-cancelar" @click="mostrarModalConfirmacionEstado = false">
                  Cancelar
                </button>
                <button 
                  class="btn-modal-confirmar" 
                  :class="alumno.activo ? 'btn-confirmar-peligro' : 'btn-confirmar-normal'"
                  @click="ejecutarCambioEstado"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </Transition>
        <Transition name="modal-fade">
          <div v-if="mostrarModalExito" class="modal-overlay">
            <div class="modal-exito">
              <div class="modal-header-exito">
                <i class="fas fa-check-circle"></i>
                <h3>Estado Actualizado</h3>
              </div>
              <div class="modal-body-exito">
                <p>{{ mensajeModalExito }}</p>
              </div>
              <div class="modal-footer-exito">
                <button class="btn-modal-continuar" @click="handleContinuarExito">
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </Transition>
        </div>
    </div>

    <div v-else-if="!mostrandoModificacion" class="sin-alumno">
        <i class="fas fa-exclamation-triangle fa-3x"></i>
        <h3>No se encontró información del alumno</h3>
        <p>Por favor, vuelve a la lista de alumnos</p>
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
import Titulo from '../Titulo.vue';
import ModificarCuota from './ModificarCuota.vue'; // <-- AÑADE ESTA LÍNEA (ajusta la ruta si es necesario)

// ... (debajo de 'const cuotas = ref([])')
const cuotaParaModificar = ref(null); // <-- AÑADE ESTA LÍNEA

// ... (debajo de 'const alumnoID = computed(...)')
const mostrandoModificadorCuota = computed(() => cuotaParaModificar.value !== null); // <-- AÑADE ESTA LÍNEA
const props = defineProps({
  alumnoSeleccionado: Object
})

const emit = defineEmits(['volverAlumnos', 'actualizarHorarios'])

const mostrandoModificacion = ref(null)
const mostrarModalConfirmacionEstado = ref(false)
const mostrarModalExito = ref(false)
const mensajeModalExito = ref('') // Para el texto del modal de éxito
const alumnoID = computed(() => props.alumnoSeleccionado)

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

import {
  obtenerAlumnoPorDni,
  obtenerHorariosPorDni,
  actualizarHorariosAlumno,
  actualizarPerfilAlumno
} from '@/api/services/alumnoService'

import { obtenerCuotasDeAlumno } from '@/api/services/cuotasService'
const loading = ref(false)
const alumno = ref(null)
const horariosAlumno = ref([])
const cuotas = ref([])

async function cargarDatosCompletosAlumno() {
  // 1. Inicia el estado de carga
  loading.value = true
  // Opcional: Simula un retraso (quizás para UI)
  await sleep(700) 
  try {
    const dni = alumnoID.value?.dni // Acceso seguro usando optional chaining
    // 2. Verifica si tenemos un DNI válido antes de hacer las llamadas
    if (dni) {
      // 3. Ejecuta todas las peticiones
      // (Puedes ejecutarlas en paralelo si no dependen entre sí)
      const respuestaAlumno = await obtenerAlumnoPorDni(dni)
      alumno.value = respuestaAlumno

      const respuestaHorarios = await obtenerHorariosPorDni(dni)
      horariosAlumno.value = respuestaHorarios

      const respuestaCuotas = await obtenerCuotasDeAlumno(dni)
      cuotas.value = respuestaCuotas
      
    } else {
      console.warn('No se proporcionó un DNI para cargar los datos.');
    }
  } catch (error) {
    // 4. Manejo centralizado de errores
    console.error('Error al cargar la información del alumno:', error)
  } finally {
    // 5. Finaliza el estado de carga (siempre)
    loading.value = false
  }
}

onMounted(async () => {
  await cargarDatosCompletosAlumno()
  // alert(JSON.stringify(alumno.value, null, 2));
})




const volverAlumnos = () => { emit('volverAlumnos') }

const manejarHorariosActualizados = async (nuevosHorarios) => {
  try {
    await actualizarHorariosAlumno(alumnoID.value["dni"], nuevosHorarios["horarios"]);
    // 3. MANEJO DE ÉXITO (Profesional)
    console.log(`Horarios actualizados exitosamente para ${alumnoID.value["dni"]}`);
    // (Opcional: mostrar mensaje de éxito en la UI)
    // mensajeConfirmacion.value = "Horarios guardados con éxito.";
    // setTimeout(() => mensajeConfirmacion.value = '', 3000);
  } catch (error) {
    // 4. MANEJO DE ERRORES (Profesional)
    console.error("Error al modificar los datos:", error);
    // Muestra un mensaje de error claro al usuario
    alert(`Error al guardar: ${error.response?.data?.detail || 'No se pudieron actualizar los horarios. Verifique la capacidad.'}`);
  } finally {
    // Una vez finalizada la actualización, refresca los horarios
    console.log(`Refrescando horarios para ${alumnoID.value["dni"]}...`);
    
    try {
      // --- Tu lógica de API (Obtener horarios) ---
      const respuestaHorarios = await obtenerHorariosPorDni(alumnoID.value["dni"]);
      horariosAlumno.value = respuestaHorarios;
    } catch (fetchError) {
        console.error("Error al refrescar los horarios:", fetchError);
        alert("Se intentó guardar, pero hubo un error al recargar la vista. Por favor, verifique.");
    }
    // (Opcional: finalizar estado de carga)
    // actualizando.value = false;
  }
}

const modificarDatos = () => { mostrandoModificacion.value = 'datos' }
const modificarSuscripcionTrabajo = () => { mostrandoModificacion.value = 'suscripcion-trabajo' }

// ----- INICIO: Manejo de activar o descativar alumno (CON MODALES) -----

// 1. Muestra el modal de confirmación
const iniciarCambioEstado = () => {
  mostrarModalConfirmacionEstado.value = true;
}

// 2. Se llama desde el modal de confirmación
const ejecutarCambioEstado = () => {
  // 1. Cerrar el modal de confirmación
  mostrarModalConfirmacionEstado.value = false;

  const nuevoEstado = !alumno.value.activo;

  // -----------------------------------------------------------------
  // TODO: AQUÍ VA LA LLAMADA A LA API
  //
  // Aquí deberías llamar a tu servicio de API para actualizar
  // el estado del alumno. La lógica de simulación de abajo
  // debería ir DENTRO del 'try' o '.then' de la llamada exitosa.
  //
  // Ejemplo:
  // try {
  //   await api.actualizarEstadoAlumno(alumno.value.dni, { activo: nuevoEstado });
  //   
  //   // Lógica de éxito (la simulación de abajo):
  //   alumno.value.activo = nuevoEstado;
  //   mensajeModalExito.value = nuevoEstado 
  //     ? 'El alumno se activó correctamente' 
  //     : 'El alumno se desactivó correctamente';
  //   mostrarModalExito.value = true; // Mostrar modal de éxito
  //
  // } catch (error) {
  //   console.error('Error al cambiar el estado:', error);
  //   // Aquí podrías mostrar un modal de ERROR
  // }
  // -----------------------------------------------------------------

  // --- INICIO: Simulación (reemplazar con la llamada API) ---
  // Esta parte simula el éxito de la API.
  alumno.value.activo = nuevoEstado;
  mensajeModalExito.value = nuevoEstado
    ? 'El alumno se activó correctamente'
    : 'El alumno se desactivó correctamente';
  
  // 2. Mostrar el modal de ÉXITO
  mostrarModalExito.value = true;
  console.log('Estado cambiado (simulación):', alumno.value.activo ? 'ACTIVO' : 'INACTIVO');
  // --- FIN: Simulación ---
}

// 3. Se llama desde el modal de éxito (igual que en IngresoPersona)
const handleContinuarExito = () => {
  mostrarModalExito.value = false;
}
// ----- FIN: Manejo de activar o descativar alumno -----

//manejador para eliminar al alumno
const eliminarAlumno = () => { console.log('Eliminar alumno') }


// await cargarDatosCompletosAlumno();

const manejarGuardarDatos = async (datosActualizados) => {
  try {
    const dni = alumnoID.value["dni"];

    const payload = {
      nombre: datosActualizados["nombre"],
      apellido: datosActualizados["apellido"],
      sexo: datosActualizados["sexo"],
      email: datosActualizados["email"],
      telefono: datosActualizados["telefono"],
      nomProvincia: datosActualizados["provincia"],
      nomLocalidad: datosActualizados["localidad"],
      calle: datosActualizados["calle"],
      numero: datosActualizados["nro"]
    };

    await actualizarPerfilAlumno(dni, payload);
  } catch (error) {
    console.error("error", error);
  } finally {
    await cargarDatosCompletosAlumno();
  }

  mostrandoModificacion.value = null;
  mostrarModalExito.value = true;
  setTimeout(() => { mensajeModalExito.value = 'Los datos del alumno se actualizaron correctamente' }, 3000);
}


const manejarGuardarSuscripcionTrabajo = (datosActualizados) => {
    alumno.value = { ...alumno.value, ...datosActualizados.alumno };
    if (datosActualizados.horarios) {
    horariosAlumno.value = datosActualizados.horarios;
  }
  mostrandoModificacion.value = null;

  // Corrección: Usa el nuevo modal en lugar del banner
   mensajeModalExito.value = 'La suscripción, trabajo y nivel se actualizaron correctamente';
  mostrarModalExito.value = true;
}


// ----- INICIO: Manejo de Modificación/Eliminación de Cuotas -----

/**
 * (Handler para "Eliminar")
 * Se activa cuando FilaCuota -> TablaCuota emiten 'solicitud-eliminar-cuota'.
 */
const manejarSolicitudEliminar = (cuota) => {
  console.log('Solicitud para ELIMINAR cuota:', cuota.idCuota);
  
  // TODO: Implementar un modal de confirmación aquí
  
  if (confirm(`¿Estás seguro que deseas eliminar la cuota #${cuota.idCuota} del mes ${cuota.mes}?`)) {
    // ---------------------------------------------------
    // TODO: AQUÍ IRÍA LA LLAMADA A LA API PARA ELIMINAR
    //
    // Ejemplo:
    // try {
    //   await api.eliminarCuota(cuota.idCuota);
    //   mostrarModalExito('Cuota eliminada correctamente');
    //   await cargarDatosCompletosAlumno(); // Recargar cuotas
    // } catch (error) {
    //   console.error(error);
    //   alert('Error al eliminar la cuota');
    // }
    // ---------------------------------------------------
    
    // Simulación de éxito:
    alert(`Simulación: Eliminar cuota ID ${cuota.idCuota}`);
  }
};

/**
 * (Handler para "Modificar")
 * Se activa cuando FilaCuota -> TablaCuota emiten 'solicitud-modificar-cuota'.
 * Oculta la tabla y muestra el formulario de edición.
 */
const manejarSolicitudModificar = (cuota) => {
  console.log('Solicitud para MODIFICAR cuota InfoAlumno:', cuota);
  cuotaParaModificar.value = cuota;
};

/**
 * Se activa cuando ModificarCuota emite 'cancelar-modificacion'.
 * Oculta el formulario y muestra la tabla.
 */
const cancelarModificacionCuota = () => {
  cuotaParaModificar.value = null;
};

/**
 * (Handler para "Guardar")
 * Se activa cuando ModificarCuota emite 'guardar-modificacion-cuota'.
 */
const guardarModificacionCuota = async (cuotaModificada) => {
  console.log('Guardando cuota modificada:', cuotaModificada);
  
  // ---------------------------------------------------
  // TODO: AQUÍ VA LA ESTRUCTURA MODIFICADA Y LA LLAMADA API
  //
  // 'cuotaModificada' ES EL PAYLOAD QUE NECESITAS ENVIAR A LA API
  //
  // Ejemplo:
  // try {
  //   await api.actualizarCuota(cuotaModificada.idCuota, cuotaModificada);
  //   
  //   // Éxito:
  //   cuotaParaModificar.value = null; // Cierra el formulario
  //   await cargarDatosCompletosAlumno(); // Recarga los datos
  //   mostrarModalExito('Cuota actualizada con éxito');
  //
  // } catch (error) {
  //   console.error('Error al guardar cuota:', error);
  //   alert('Error al guardar la cuota.');
  // }
  // ---------------------------------------------------
  
  // Simulación de éxito:
  alert('Simulación: Cuota guardada');
  cuotaParaModificar.value = null;
  await cargarDatosCompletosAlumno(); // Recargar
};

// ----- FIN: Manejo de Cuotas -----


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
display: grid; 
grid-template-columns: 1fr auto 1fr; 
align-items: center;
margin-bottom: 2rem;
flex-wrap: wrap; 
gap: 1rem;
}
.encabezado-info .btn-volver-global {
justify-self: start; 
}

.tarjeta-alumno {
background: white;
border-radius: 15px;
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
overflow: hidden;
}

/* --- CORRECCIÓN --- */
/* Quitamos el padding de la tarjeta principal */
.tarjeta-contenido {
/* padding: 2rem; */ /* <- Eliminado */
padding: 0; /* <- Añadido */
}

.separador-seccion {
height: 1px;
background: linear-gradient(to right, transparent, #e0e0e0, transparent);
/* Añadimos margen horizontal para que no toque los bordes */
margin: 2rem 2rem; 
}

/* --- CORRECCIÓN --- */
/* Añadimos padding a las secciones internas */
.seccion-info {
margin-bottom: 2.5rem;
padding: 1.5rem 2rem; /* Añadido padding horizontal */
background: #fafafa;
border-radius: 10px;
border: 1px solid #f0f0f0;
/* Las tablas ahora están dentro de la sección blanca, 
   así que ajustamos el margen para que no se peguen */
margin-left: 2rem;
margin-right: 2rem;
}
.seccion-info .titulo-seccion {
display: flex;
align-items: center;
gap: 0.8rem;
font-size: 1.3rem;
color: #2c3e50;
margin-bottom: 1.5rem;
font-weight: 600;
border-bottom: 2px solid #d32f2f;
padding-bottom: 0.5rem;
}
.seccion-info .titulo-seccion i { color: #d32f2f; }


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

/* --- CORRECCIÓN --- */
/* Añadimos padding a la sección de botones */
.seccion-botones { 
margin-top: 3rem; 
padding: 2rem; /* Añadido padding */
border-top: 2px solid #e0e0e0; 
}
.botones-accion { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
.btn-accion { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem 1.5rem; border: none; border-radius: 10px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; }
.btn-modificar { background: #2196F3; color: white; }
.btn-modificar:hover { background: #1976D2; transform: translateY(-2px); }
.btn-suscripcion { background: #FF9800; color: white; }
.btn-suscripcion:hover { background: #F57C00; transform: translateY(-2px); }
.btn-estado-activo { 
background: #4CAF50; /* Verde */
color: white; 
}
.btn-estado-activo:hover { 
background: #388E3C; 
transform: translateY(-2px); 
}

.btn-estado-inactivo { 
background: #FF7043; /* Naranja Intenso (Distinto del rojo F44336 de eliminar) */ 
color: white; 
}
.btn-estado-inactivo:hover { 
background: #F4511E; /* Naranja más oscuro */ 
transform: translateY(-2px); 
}
.btn-eliminar { background: #F44336; color: white; }
.btn-eliminar:hover { background: #D32F2F; transform: translateY(-2px); }

/* ----- INICIO: Estilos para Modales (Confirmación y Éxito) ----- */
.modal-confirmacion {
border-top: 5px solid #E65100 !important;
}
.modal-header-advertencia {
flex-direction: column; 
align-items: center; 
padding-top: 1.5rem; 
padding-bottom: 0.5rem; 
border-bottom: none; 
}

.modal-header-advertencia i {
color: #E65100; 
font-size: 3.5rem; 
margin-bottom: 0.8rem; 
}

.modal-header-advertencia h3 {
font-size: 1.6rem; 
font-weight: 600;
color: #333; 
margin: 0;
text-align: center;
}

.modal-body-exito p:not(.advertencia-modal) {
font-size: 1.05rem; 
line-height: 1.5;
color: #444;
text-align: center; 
}

.advertencia-modal {
font-size: 0.95rem; 
font-weight: 500;
color: #B71C1C; 
background-color: #FFEBEE; 
padding: 1rem 1.2rem; 
border-radius: 10px; 
border: 1px solid #FFCDD2;
margin-top: 1.5rem; 
text-align: center; 
max-width: 90%; 
margin-left: auto; 
margin-right: auto; 
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); 
}

.modal-footer-exito {
justify-content: center; 
gap: 1.2rem; 
padding-top: 1.5rem; 
padding-bottom: 1.5rem; 
border-top: none; 
background: none; 
}

.btn-modal-cancelar, .btn-modal-confirmar {
font-family: 'Poppins', sans-serif;
font-weight: 600;
font-size: 1rem; 
padding: 0.8rem 1.8rem; 
border-radius: 30px; 
border: none;
cursor: pointer;
transition: all 0.2s ease-in-out; 
box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
}

.btn-modal-cancelar {
background: #EEEEEE; 
color: #555;
}
.btn-modal-cancelar:hover {
background: #D5D5D5;
transform: translateY(-1px); 
box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.btn-confirmar-normal {
background-color: #4CAF50; 
color: white;
}
.btn-confirmar-normal:hover {
background-color: #388E3C;
transform: translateY(-1px); 
box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.btn-confirmar-peligro {
background-color: #F44336; 
color: white;
}
.btn-confirmar-peligro:hover {
background-color: #D32F2F;
transform: translateY(-1px); 
box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

@media (max-width: 600px) {
.modal-footer-exito {
flex-direction: column; 
gap: 0.8rem; 
}
.btn-modal-cancelar, .btn-modal-confirmar {
width: 100%; 
}
}

/* ----- FIN: Estilos para Modales ----- */

@media (max-width: 1560px) 
{ 
.botones-accion { 
grid-template-columns: repeat(2, 1fr); 
gap: 1rem; } 
}

/* --- INICIO DE CAMBIOS RESPONSIVE --- */
@media (max-width: 768px) 
{
.contenedor-info-alumno { 
padding: 1.5rem; 
} 

.encabezado-info {
display: flex; 
flex-direction: column;
text-align: center;
align-items: stretch;
grid-template-columns: none; 
}
.encabezado-info .btn-volver-global {
justify-content: center;
margin-bottom: 1rem;
justify-self: auto;
}

/* CORRECCIÓN: 
  La tarjeta blanca SÍ mantiene su padding horizontal.
*/
.tarjeta-contenido { 
padding: 1.5rem; 
}

.separador-seccion { 
margin: 1.5rem 0; 
}

/* CORRECCIÓN: 
  La sección de la tabla QUITA su padding horizontal
  y su fondo para que la tabla se expanda.
*/
.seccion-info { 
padding: 1rem 0; 
border: none;
background: none; 
/* CORRECCIÓN: Quitamos márgenes laterales */
margin-left: 0;
margin-right: 0;
}

/* CORRECCIÓN: 
  Añadimos padding horizontal SÓLO al título de la sección,
  para que coincida con el padding de .tarjeta-contenido
*/
.seccion-info .titulo-seccion {
padding-left: 1.5rem;
padding-right: 1.5rem;
}

/* CORRECCIÓN: 
  Añadimos padding a la sección de botones en móvil
*/
.seccion-botones {
  padding: 2rem 1.5rem 0 1.5rem;
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

.tarjeta-contenido { 
padding: 1rem; 
}

.separador-seccion { margin: 1rem 0; }

.seccion-info { 
padding: 0.8rem 0; 
}

.seccion-info .titulo-seccion {
padding-left: 1rem;
padding-right: 1rem;
}

/* CORRECCIÓN: 
  Añadimos padding a la sección de botones en móvil
*/
.seccion-botones {
  padding: 2rem 1rem 0 1rem;
}
}
/* --- FIN DE CAMBIOS RESPONSIVE --- */
</style>