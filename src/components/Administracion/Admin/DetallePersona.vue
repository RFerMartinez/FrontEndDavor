<template>
  <div>
    <div class="seccion-tabla">
      <h3 class="titulo-seccion">
        <i class="fas fa-user"></i>
        Información Personal
      </h3>
      <div class="tabla-datos">
        <div class="fila-tabla">
          <div class="celda etiqueta">Nombre:</div>
          <div class="celda valor">{{ datos.nombre || 'N/A' }}</div>
          <div class="celda etiqueta">Apellido:</div>
          <div class="celda valor">{{ datos.apellido || 'N/A' }}</div>
        </div>
        <div class="fila-tabla">
          <div class="celda etiqueta">DNI:</div>
          <div class="celda valor">{{ datos.dni || 'N/A' }}</div>
          <div class="celda etiqueta">Email:</div>
          <div class="celda valor">{{ datos.email || 'No especificado' }}</div>
        </div>
        <div class="fila-tabla">
          <div class="celda etiqueta">Teléfono:</div>
          <div class="celda valor">{{ datos.telefono || 'No especificado' }}</div>
          <template v-if="datos.hasOwnProperty('sexo')">
            <div class="celda etiqueta">Sexo:</div>
            <div class="celda valor">{{ datos.sexo === 'F' ? 'Femenino' : (datos.sexo === 'M' ? 'Masculino' : 'No especificado') }}</div>
          </template>
          <template v-else>
            <div class="celda etiqueta"></div>
            <div class="celda valor"></div>
          </template>
        </div>
      </div>
    </div>

    <div class="separador-seccion"></div>

    <div class="seccion-tabla">
      <h3 class="titulo-seccion">
        <i class="fas fa-map-marker-alt"></i>
        Dirección
      </h3>
      <div class="tabla-datos">
        <div class="fila-tabla">
          <div class="celda etiqueta">Provincia:</div>
          <div class="celda valor">{{ datos.provincia || 'No especificada' }}</div>
          <div class="celda etiqueta">Localidad:</div>
          <div class="celda valor">{{ datos.localidad || 'No especificada' }}</div>
        </div>
        <div class="fila-tabla">
          <div class="celda etiqueta">Calle:</div>
          <div class="celda valor">{{ datos.Calle || 'No especificada' }}</div>
          <div class="celda etiqueta">Número:</div>
          <div class="celda valor">{{ datos.nro || 'S/N' }}</div>
        </div>
      </div>
    </div>

    <template v-if="datos.hasOwnProperty('turno') || datos.hasOwnProperty('suscripcion') || datos.hasOwnProperty('trabajoactual') || datos.hasOwnProperty('nivel')">
        <div class="separador-seccion"></div>
        <div class="seccion-tabla">
          <h3 class="titulo-seccion">
            <i class="fas fa-dumbbell"></i>
            Información del Gimnasio
          </h3>
          <div class="tabla-datos">
            <div class="fila-tabla">
              <div class="celda etiqueta">Turno:</div>
              <div class="celda valor">{{ datos.turno || 'N/A' }}</div>
              <div class="celda etiqueta">Suscripción:</div>
              <div class="celda valor">{{ datos.suscripcion || 'N/A' }}</div>
            </div>
            <div class="fila-tabla">
              <div class="celda etiqueta">Trabajo Actual:</div>
              <div class="celda valor">{{ datos.trabajoactual || 'N/A' }}</div>
              <div class="celda etiqueta">Nivel:</div>
              <div class="celda valor">{{ datos.nivel || 'N/A' }}</div>
            </div>
          </div>
        </div>
    </template>

    <template v-if="datos.hasOwnProperty('activo') || datos.hasOwnProperty('cuotasPendientes')">
        <div class="separador-seccion"></div>
        <div class="seccion-tabla">
          <h3 class="titulo-seccion">
            <i class="fas fa-chart-bar"></i>
            Estado y Cuotas
          </h3>
          <div class="tabla-datos">
            <div class="fila-tabla">
              <div class="celda etiqueta">Estado:</div>
              <div class="celda valor">
                 <span :class="datos.activo ? 'estado-activo' : 'estado-inactivo'">
                   {{ datos.activo ? 'ACTIVO' : 'INACTIVO' }}
                 </span>
                 </div>
              <div class="celda etiqueta">Cuotas Pendientes:</div>
              <div class="celda valor">
                <span class="badge-cuota" :class="{'ninguna': datos.cuotasPendientes === 0}">
                  {{ datos.cuotasPendientes }}
                </span>
              </div>
            </div>
          </div>
        </div>
     </template>

  </div>
</template>

<script setup>
// Importa Estado si decides usar el componente en lugar de texto simple
// import Estado from '../Estado.vue';

const props = defineProps({
  datos: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
/* Copia aquí TODOS los estilos relevantes de InfoAlumno o IngresoPersona */
/* para .seccion-tabla, .titulo-seccion, .tabla-datos, .fila-tabla, */
/* .celda, .etiqueta, .valor, .separador-seccion, .badge-cuota, */
/* y si usas el componente Estado, sus estilos o los de .estado-activo/.estado-inactivo */

/* Estilos copiados y adaptados */
.seccion-tabla {
  margin-bottom: 2rem; /* Ajustado respecto a InfoAlumno */
}

.titulo-seccion {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
  border-bottom: 2px solid #e91e63; /* Color principal */
  padding-bottom: 0.5rem;
}

.titulo-seccion i {
  color: #e91e63; /* Color principal */
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
  padding: 1rem 1.2rem; /* Ajustado */
  display: flex;
  align-items: center;
}

.etiqueta {
  font-weight: 600;
  color: #495057;
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  min-width: 150px; /* Ajustado */
  width: 150px;     /* Ajustado */
  font-size: 0.95rem; /* Ajustado */
  justify-content: flex-start;
}

.valor {
  font-weight: 500;
  color: #2c3e50;
  background-color: white;
  font-size: 1rem;   /* Ajustado */
  flex: 1;
  justify-content: flex-start;
  padding-left: 1.5rem; /* Ajustado */
  border-left: 1px solid #f0f0f0;
  word-break: break-word; /* Para emails largos */
}

/* Separación entre pares de campos */
.fila-tabla .celda:nth-child(2) {
  border-right: 1px solid #e0e0e0;
}

.fila-tabla .celda:nth-child(3) {
  /* Si hay 4 celdas (como en info personal), la 3ra no necesita borde derecho */
   border-right: none;
}
/* Asegurar borde si la 3ra celda es la última etiqueta (como en Dirección) */
.fila-tabla .celda.etiqueta:nth-child(3) {
    border-right: 1px solid #e0e0e0;
}


/* Separador visual */
.separador-seccion {
  height: 1px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 2rem 0;
}

/* Badge Cuotas (si aplica) */
.badge-cuota {
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: #ffebee; /* Rojo claro */
  color: #d32f2f; /* Rojo oscuro */
  font-size: 1.1rem;
  min-width: 40px;
  text-align: center;
  display: inline-block;
}

.badge-cuota.ninguna {
  background-color: #e8f5e9; /* Verde claro */
  color: #2e7d32; /* Verde oscuro */
}

/* Estilos para Estado (si no usas el componente) */
.estado-activo {
    background-color: #4CAF50; /* Verde */
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-weight: 600;
    font-size: 0.9rem;
}
.estado-inactivo {
    background-color: #F44336; /* Rojo */
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-weight: 600;
    font-size: 0.9rem;
}


/* Responsive (copiado y adaptado) */
@media (max-width: 768px) {
  .fila-tabla {
    flex-direction: column;
    border-bottom: 1px solid #e0e0e0; /* Borde entre filas en móvil */
  }
  .fila-tabla:last-child {
      border-bottom: none; /* Sin borde extra al final */
  }

  .celda {
    padding: 0.8rem 1rem; /* Menos padding */
    width: 100% !important;
    min-width: auto !important;
    border-right: none !important;
    border-bottom: 1px solid #f0f0f0; /* Línea entre etiqueta y valor */
    justify-content: space-between; /* Etiqueta a la izq, valor a la der */
  }

  .celda:last-child {
    border-bottom: none; /* La última celda de una fila no necesita borde inferior */
  }

  .etiqueta {
    background-color: #f8f9fa;
    font-weight: 600;
    border-right: none;
    border-bottom: none; /* Quitar borde inferior específico de etiqueta */
    width: auto !important; /* Ancho automático */
    min-width: auto;
  }

  .valor {
    border-left: none;
    padding-left: 1rem; /* Menos padding izq */
    justify-content: flex-end; /* Alinear valor a la derecha */
    text-align: right;
    border-bottom: none; /* Quitar borde inferior específico de valor */
  }

  /* Ocultar celdas vacías en móvil */
  .celda.etiqueta:empty, .celda.valor:empty {
      display: none;
  }
  /* Ajustar la última fila si tiene celdas vacías */
   .fila-tabla:last-child .celda:not(:empty):last-child {
       border-bottom: none;
   }

  .separador-seccion {
    margin: 1.5rem 0;
  }
}

@media (max-width: 480px) {
    .celda {
        padding: 0.7rem;
        font-size: 0.9rem;
    }
    .valor {
        font-size: 0.95rem;
    }
     .separador-seccion {
        margin: 1rem 0;
    }
}
</style>