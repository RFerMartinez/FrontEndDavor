<template>
  <div>
    <NavBar />
    <HeroSection/>

    <section class="black-section">
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
      <div v-if="modalVisible" class="modal" @click.self="cerrarModal">
        <div class="modal-content">
          <img :src="modalData.imagen" :alt="modalData.nombre" />
          <h3>{{ modalData.nombre }}</h3>
          <p>{{ modalData.descripcion }}</p>
          <button @click="cerrarModal">Cerrar</button>
        </div>
      </div>
    </transition>
      <section class="black-section">
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
  <Footer />
  </div> 


  
</template>


<script setup>
import Footer from '../components/Footer.vue'
import NavBar from '@/components/NavBar.vue'
import HeroSection from '@/components/HeroSection.vue'
import Metodologia from '../components/Metodologias.vue'
import Precio from '../components/Precio.vue'
import { ref, onMounted } from 'vue'

// Metodologías
const metodologias = ref([])
const modalVisible = ref(false)
const modalData = ref({})

fetch('/data/metodologias.json')
  .then(res => res.json())
  .then(data => {
    metodologias.value = data
  })

function abrirModal(metodo) {
  modalData.value = metodo
  modalVisible.value = true
}
function cerrarModal() {
  modalVisible.value = false
}

// Precios
const precios = ref([])

fetch('/data/precios.json')
  .then(res => res.json())
  .then(data => {
    precios.value = data
  })
</script>

<style scoped>
.black-section {
  background-color: #000;
  color: white;
  padding: 60px 20px 100px; /* menos padding arriba */
  min-height: 500px;
}

.section-title {
  text-align: center;
  padding-top: 10px;
  font-size: 2.5rem;
  font-family: 'Poppins', sans-serif;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 30px;
  padding: 0 20px;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: #111;
  color: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  transform-origin: center;
  overflow: hidden; /* para evitar que haya desbordes que muestren fondo */
  transform-origin: center center; /* importante para que la escala sea centrada */
}
.modal-content img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
}

.modal-content button {
  background-color: #e50914;
  border: none;
  padding: 10px 15px;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
}
/* Animación del modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); /* easing bounce */
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9); /* quitamos translateY */
  transform-origin: center center; /* para que escale desde el centro */
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

.precios-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

</style>
