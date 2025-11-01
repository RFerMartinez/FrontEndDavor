<template>
  <div class="contenedor">
    <Titulo texto="Mis Horarios" />
    <div class="seccion-tabla-horarios">
      <TablaHorarios
        :horarios-alumno="horario"
        :suscripcion="'Día Libre'" 
      />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import Titulo from '../Titulo.vue';
import TablaHorarios from '../TablaHorarios.vue'; // <-- 3. Importar TablaHorarios

// 4. Nueva estructura de horarios añadida
const horario = ref({
  "horarios": [
    {
      "dia": "Lunes",
      "nroGrupo": "4 "
    },
    {
      "dia": "Miércoles",
      "nroGrupo": "3 "
    },
    {
      "dia": "Viernes",
      "nroGrupo": "4 "
    }
  ]
});
</script>

<style scoped>
.contenedor {
padding: 2rem; 
background-color: rgba(255, 255, 255, 0.85); /* Fondo translúcido */
border-radius: 20px;
box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
overflow: hidden; 
width: 100%;
}

/* Media query para dispositivos móviles */
@media (max-width: 768px) {
.contenedor {
width: 100%;
padding: 1.5rem;
margin: 0;
box-sizing: border-box;
}
}

@media (max-width: 480px) {
.contenedor {
padding: 1rem;
}
}
</style>