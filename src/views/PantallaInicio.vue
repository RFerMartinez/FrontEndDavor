<template>
  <div>
    <FondoInicio />

    <section id="metodologias" class="black-section" :class="{ 'section-blur': modalVisible }">
      <div class="container">
        <h2 class="section-title">Metodologías de trabajo</h2>
        <div class="grid">
          <Metodologia
            v-for="(item, index) in metodologias"
            :key="index"
            :metodo="item"
            @ver="abrirModal"
          />
        </div>
      </div>
    </section>

    <transition name="modal-fade">
      <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-content">
          <h3>{{ modalData.nombreTrabajo }}</h3>
          <p>{{ modalData.descripcion }}</p>
          <button @click="cerrarModal">Cerrar</button>
        </div>
      </div>
    </transition>

    <section id="precios" class="black-section" :class="{ 'section-blur': modalVisible }">
      <div class="container">
        <h2 class="section-title">Precios</h2>
        <div class="precios-grid">
          <Precio
            v-for="(item, index) in precios"
            :key="index"
            :precio="item"
          />
        </div>
      </div>
    </section>
    
    <Footer :class="{ 'section-blur': modalVisible }" />
  </div>
</template>

<script setup>
import Footer from '../components/Inicio/Footer.vue'
import FondoInicio from '@/components/Inicio/FondoInicio.vue'
import Metodologia from '../components/Inicio/Metodologias.vue'
import Precio from '../components/Inicio/Precio.vue'
import { ref, onMounted } from 'vue'

import { obtenerTrabajos } from '@/api/services/trabajoService.js'
import { obtenerSuscripciones } from '@/api/services/suscripcionesService'

// Metodologías
const metodologias = ref([])
const modalVisible = ref(false)
const modalData = ref({})
const precios = ref([])

function abrirModal(metodo) {
  modalData.value = metodo
  modalVisible.value = true
}

function cerrarModal() {
  modalVisible.value = false
}

onMounted(async () => {
  try {
    metodologias.value = await obtenerTrabajos();
  } catch (error) {
    console.error("Error al cargar metodologías desde la API:", error);
    // Opcional: puedes poner datos de respaldo si falla la API
    // metodologias.value = [{ nombre: "Error al cargar", descripcion: "Intente más tarde" }];
  }
  try {
    precios.value = await obtenerSuscripciones();
  } catch (error) {
    console.error("Error al cargar suscripciones desde la API:", error);
  }
});

</script>

<style scoped>
.black-section {
  background-color: #000;
  color: white;
  padding: 80px 20px;
  min-height: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* TÍTULOS PROFESIONALES Y MINIMALISTAS */
.section-title {
  text-align: center;
  font-size: 2.8rem;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 50px;
  color: #ffffff;
  font-weight: 300;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    #e50914 50%, 
    transparent 100%);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.precios-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  margin-top: 30px;
}

/* BLUR EFFECT */
.section-blur {
  filter: blur(8px);
  pointer-events: none;
  transition: filter 0.3s ease;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #111 0%, #222 100%);
  color: white;
  padding: 3rem;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  border: 1px solid #333;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  z-index: 1001;
}

.modal-content h3 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #fff;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

.modal-content p {
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #ccc;
  text-align: center;
}

.modal-content button {
  background: linear-gradient(135deg, #e50914 0%, #ff2a2a 100%);
  border: none;
  padding: 12px 30px;
  color: white;
  cursor: pointer;
  border-radius: 25px;
  font-weight: 500;
  display: block;
  margin: 0 auto;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.modal-content button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
}

/* ANIMACIONES MODAL */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .section-title {
    font-size: 2.2rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 10px;
  }
  
  .modal-content {
    padding: 2rem;
    margin: 20px;
  }
  
  .modal-content h3 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .black-section {
    padding: 60px 15px;
  }
  
  .section-title {
    font-size: 1.8rem;
    padding-bottom: 12px;
  }
  
  .section-title::after {
    width: 60px;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
}
</style>