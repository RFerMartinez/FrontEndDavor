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
        v-model="datosFormulario" :es-edicion="suscripcionEditando !== null"
        :config="configFormularioComputada" @guardar="guardarSuscripcion"
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

    <div v-if="suscripcionNuevaGuardada" style="margin-top: 2rem; padding: 1rem; border: 1px dashed blue; background: #eef;">
        <strong>Suscripción Nueva Guardada (Temporal):</strong>
        <pre>{{ suscripcionNuevaGuardada }}</pre>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; // Añadir computed
import AgregarModificar from './AgregarModificar.vue';
import Items from './Items.vue';

// --- CONFIGURACIÓN ---
// Configuración base para el formulario (será ajustada por la computada)
const configFormBase = {
  tituloSingular: 'Suscripción',
  layout: 'inline',
  contexto: 'suscripciones', // <-- CONTEXTO
  // Los campos se definen en la computada
};

// Configuración para la lista (ahora con formatoPrecio)
const configLista = ref({
  contexto: 'suscripciones', // <-- CONTEXTO
  key1: 'descripcion',
  showKey2: true,
  key2: 'precio',
  styleKey2: 'precio',
  formatoPrecio: true // <-- Indica a Items que formatee el precio
});
// --------------------


// --- ESTADO ---
const suscripciones = ref([]); // Lista principal
const mostrarFormulario = ref(false);
const suscripcionEditando = ref(null); // Guarda el ID del item en edición
const mensajeConfirmacion = ref('');
const transicionEnProgreso = ref(false);
const datosFormulario = ref({ descripcion: '', precio: '' }); // v-model para AgregarModificar
const suscripcionNuevaGuardada = ref(null); // <-- NUEVO: Para guardar temporalmente
// --------------


// --- CONFIGURACIÓN COMPUTADA DEL FORMULARIO ---
const configFormularioComputada = computed(() => {
  const esEdicion = suscripcionEditando.value !== null;
  return {
    ...configFormBase, // Copia la base
    campo1: esEdicion
      ? { key: 'descripcion', label: 'Descripción:', placeholder: 'Descripción (No editable)', esTextarea: false, tipoInput: 'text', readonly: true } // Edición: readonly
      : { key: 'descripcion', label: 'Días por semana:', placeholder: 'Ej: 3', esTextarea: false, tipoInput: 'number', min: '1', readonly: false }, // Agregado: number
    campo2: { key: 'precio', label: 'Precio (número):', placeholder: 'Ej: 20000', esTextarea: false, tipoInput: 'number', min: '0', readonly: false } // Siempre number
  };
});
// ------------------------------------------

// --- FUNCIONES ---
const parsePriceString = (priceString) => {
    if (typeof priceString !== 'string') return NaN;
    // Quitar puntos de miles (si los hubiera) y reemplazar coma decimal por punto
    const cleanedString = priceString.replace(/\./g, '').replace(',', '.');
    const number = parseFloat(cleanedString);
    return isNaN(number) ? NaN : number; // Devolver NaN si falla
};

const cargarSuscripciones = async () => {
  try {
    const preciosData = await import('../../../../public/data/precios.json');
    suscripciones.value = preciosData.default.map((item, index) => {
        const precioNum = parsePriceString(item.precio); // Parsea el string del JSON
        if (isNaN(precioNum)) {
             console.warn(`Precio inválido en JSON para "${item.descripcion}": ${item.precio}`);
        }
        return {
            id: index + 1,
            descripcion: item.descripcion,
            precio: isNaN(precioNum) ? 0 : precioNum // Guarda como número, 0 si falla
        };
    });
    console.log('Suscripciones cargadas (precio como número):', suscripciones.value);
  } catch (error) {
    console.error('Error cargando suscripciones:', error);
    suscripciones.value = [ // Datos de ejemplo con precio numérico
        { id: 1, descripcion: '1 Día a la semana', precio: 10000 },
        { id: 2, descripcion: '2 Días a la semana', precio: 15000 },
        { id: 3, descripcion: '3 Días a la semana', precio: 20000 },
        { id: 4, descripcion: 'Día Libre', precio: 3000 }
     ];
  }
};

const iniciarTransicionAFormulario = () => {
  datosFormulario.value = { descripcion: '', precio: '' };
  suscripcionEditando.value = null;
  suscripcionNuevaGuardada.value = null; // Limpiar temp al abrir para agregar
  transicionEnProgreso.value = true;
};

const mostrarFormularioDespuesDeBotón = () => { mostrarFormulario.value = true; };

const iniciarTransicionABoton = () => {
  mostrarFormulario.value = false;
  suscripcionEditando.value = null;
  datosFormulario.value = { descripcion: '', precio: '' };
  // No limpiar suscripcionNuevaGuardada aquí para poder verla
};

const editarSuscripcion = (suscripcion) => {
  // Al editar, pasamos la descripción textual y el precio numérico LIMPIO
  datosFormulario.value = {
      descripcion: suscripcion.descripcion,
      precio: suscripcion.precio // Ya debería ser número por cargarSuscripciones
  };
  suscripcionEditando.value = suscripcion.id;
  suscripcionNuevaGuardada.value = null; // Limpiar temp al abrir para editar
  if (!mostrarFormulario.value) { transicionEnProgreso.value = true; }
  mostrarFormulario.value = true;
};

const guardarSuscripcion = (datosRecibidos) => {
  const claveCampo1 = configFormularioComputada.value.campo1.key; // 'descripcion'
  const claveCampo2 = configFormularioComputada.value.campo2.key; // 'precio'

  const valorCampo1 = datosRecibidos[claveCampo1]; // Puede ser número (días) o string (descripción en edición)
  const valorCampo2 = datosRecibidos[claveCampo2]; // Debería ser un string numérico del input

  // Validaciones
  if (valorCampo1 === '' || valorCampo1 === null || valorCampo1 === undefined ||
      valorCampo2 === '' || valorCampo2 === null || valorCampo2 === undefined) {
    mensajeConfirmacion.value = 'Por favor completa todos los campos';
    setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
    return;
  }

  const precioNum = parseFloat(valorCampo2);
  if (isNaN(precioNum) || precioNum < 0) {
      mensajeConfirmacion.value = 'El precio debe ser un número válido mayor o igual a 0.';
      setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
      return;
  }

  if (suscripcionEditando.value !== null) { // Editando
    const index = suscripciones.value.findIndex(s => s.id === suscripcionEditando.value);
    if (index !== -1) {
      // --- Lógica API Actualización (SOLO PRECIO) ---
      suscripciones.value[index].precio = precioNum; // Actualiza solo el precio
      console.log("Llamando a API para ACTUALIZAR suscripción:", suscripciones.value[index]);
      mensajeConfirmacion.value = 'Precio de suscripción actualizado';
      // --- Fin Lógica API ---
    }
  } else { // Agregando
    const diasNum = parseInt(valorCampo1); // valorCampo1 son los días
     if (isNaN(diasNum) || diasNum <= 0) {
        mensajeConfirmacion.value = 'La cantidad de días debe ser un número entero mayor a 0.';
        setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
        return;
    }
    const descripcionFormateada = `${diasNum} ${diasNum === 1 ? 'Día' : 'Días'} a la semana`;
    if (suscripciones.value.some(s => s.descripcion === descripcionFormateada)) {
        mensajeConfirmacion.value = `La suscripción "${descripcionFormateada}" ya existe.`;
        setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
        return;
    }

    const nuevoId = Math.max(...suscripciones.value.map(s => s.id), 0) + 1;
    const nuevaSub = {
      id: nuevoId,
      descripcion: descripcionFormateada,
      precio: precioNum
    };
    // --- Lógica API Creación ---
    suscripcionNuevaGuardada.value = { ...nuevaSub }; // <-- Guarda en variable temporal
    suscripciones.value.push(nuevaSub); // Añade a la lista principal
    console.log("Llamando a API para CREAR suscripción:", nuevaSub);
    mensajeConfirmacion.value = 'Suscripción creada correctamente';
    // --- Fin Lógica API ---
  }

  iniciarTransicionABoton(); // Cierra el formulario
  setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
};

const eliminarSuscripcion = (id) => { /* ... sin cambios ... */
    if (confirm('¿Estás seguro de que quieres eliminar esta suscripción?')) {
        console.log("Llamando a API para ELIMINAR suscripción con ID:", id);
        suscripciones.value = suscripciones.value.filter(s => s.id !== id);
        mensajeConfirmacion.value = 'Suscripción eliminada correctamente';
        setTimeout(() => { mensajeConfirmacion.value = '' }, 3000);
    }
};
// --------------

onMounted(cargarSuscripciones);
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