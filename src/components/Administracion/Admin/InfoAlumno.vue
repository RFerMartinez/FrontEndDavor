<template>
  <div class="contenedor-info-alumno">
    <!-- Encabezado con botón volver -->
    <div class="encabezado-info">
      <button class="btn-volver" @click="volverAlumnos">
        <i class="fas fa-arrow-left"></i>
        Volver a Alumnos
      </button>
      <h1 class="titulo">INFORMACIÓN DEL ALUMNO</h1>
    </div>

    <!-- Tarjeta de información del alumno -->
    <div class="tarjeta-alumno" v-if="alumno">
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
        <div class="seccion-info">
          <h3 class="seccion-titulo">
            <i class="fas fa-user"></i>
            Información Personal
          </h3>
          <div class="grid-info">
            <div class="info-item">
              <span class="info-label">Nombre:</span>
              <span class="info-value">{{ alumno.nombre }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Apellido:</span>
              <span class="info-value">{{ alumno.apellido }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">DNI:</span>
              <span class="info-value">{{ alumno.dni }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Turno:</span>
              <span class="info-value">{{ alumno.turno }}</span>
            </div>
          </div>
        </div>

        <div class="seccion-info">
          <h3 class="seccion-titulo">
            <i class="fas fa-chart-bar"></i>
            Estado y Cuotas
          </h3>
          <div class="grid-info">
            <div class="info-item">
              <span class="info-label">Estado:</span>
              <span class="info-value">
                <Estado :positivo="alumno.activo" :texto="alumno.activo ? 'ACTIVO' : 'INACTIVO'" />
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Cuotas Pendientes:</span>
              <span class="info-value">
                <span class="cuotas-info" :class="{'ninguna': alumno.cuotasPendientes === 0}">
                  {{ alumno.cuotasPendientes }}
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- Sección para información adicional (futura expansión) -->
        <div class="seccion-info">
          <h3 class="seccion-titulo">
            <i class="fas fa-history"></i>
            Historial de Cuotas
          </h3>
          <div class="mensaje-futuro">
            <i class="fas fa-clock"></i>
            <p>Esta sección estará disponible próximamente</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje si no hay alumno seleccionado -->
    <div v-else class="sin-alumno">
      <i class="fas fa-exclamation-triangle fa-3x"></i>
      <h3>No se encontró información del alumno</h3>
      <p>Por favor, vuelve a la lista de alumnos</p>
      <button class="btn-volver-centrado" @click="volverAlumnos">
        <i class="fas fa-arrow-left"></i>
        Volver a Alumnos
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Estado from '../Estado.vue'

const props = defineProps({
  alumnoSeleccionado: Object
})

const emit = defineEmits(['volverAlumnos'])

const alumno = computed(() => props.alumnoSeleccionado)

const volverAlumnos = () => {
  emit('volverAlumnos')
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

.seccion-info {
  margin-bottom: 2.5rem;
}

.seccion-info:last-child {
  margin-bottom: 0;
}

.seccion-titulo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.seccion-titulo i {
  color: #e91e63;
}

.grid-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #e91e63;
}

.info-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
}

.info-value {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
}

.cuotas-info {
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  background-color: #fce4ec;
  color: #d81b60;
  min-width: 30px;
  text-align: center;
  display: inline-block;
}

.cuotas-info.ninguna {
  background-color: #e8f5e9;
  color: #388e3c;
}

.mensaje-futuro {
  text-align: center;
  padding: 3rem 2rem;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px dashed #dee2e6;
  color: #6c757d;
}

.mensaje-futuro i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #adb5bd;
}

.mensaje-futuro p {
  margin: 0;
  font-size: 1rem;
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

/* Responsive */
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
  
  .grid-info {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .seccion-titulo {
    font-size: 1.1rem;
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
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>