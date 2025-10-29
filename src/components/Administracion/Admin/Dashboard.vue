<template>
  <div class="contenedor">
    <div class="dashboard-admin-container">
      <!-- <h1 class="dashboard-title">Estadísticas Generales</h1> -->

      <DashboardSection title="Indicadores Clave">
        <KpiList :kpis="kpiData" />
      </DashboardSection>

      <div class="dashboard-grid">


        <DashboardSection title="Alumnos por Metodología">
          <DonutChart
              :chart-data="alumnosPorMetodologiaData"
              :chart-options="donutChartOptions"
              chart-title="Distribución por Metodología"
              height="300px"
          />
        </DashboardSection>

        <DashboardSection title="Alumnos por Turno Mensual">
          <BarChart
            :chart-data="alumnosPorTurnoMesData"
            :chart-options="stackedBarChartOptions"
            chart-title="Alumnos por Turno Mensual"
            height="300px"
          />
        </DashboardSection>

        <DashboardSection title="Ocupación y Asistencia" class="grid-span-2">
          <OccupancyGrid
            :occupancy-data="datosOcupacion"
            :loading="loadingOcupacion"
            :error="errorOcupacion"
          />
        </DashboardSection>

        


      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue';

import KpiList from '@/components/DashBoard/KPIs/KpiList.vue';
import OccupancyGrid from '@/components/DashBoard/Charts/OccupancyGrid.vue';
import DonutChart from '@/components/DashBoard/Charts/DonutChart.vue';
import BarChart from '@/components/DashBoard/Charts/BarChart.vue';

const kpiData = ref([]);


// Ref para los datos del gráfico de torta
const alumnosPorMetodologiaData = ref({
  labels: [],
  datasets: [{ backgroundColor: [], data: [] }]
});

// --- 👇 Variable local (ref) con los datos de ejemplo ---
const datosMetodologiaEjemplo = ref([
  {
    "id": 1,
    "data": [
      { "nombre": "Musculación", "cantidad": 85 }
    ]
  },
  {
    "id": 2,
    "data": [
      { "nombre": "Funcional", "cantidad": 42 }
    ]
  },
  {
    "id": 3,
    "data": [
      { "nombre": "Preparación Física", "cantidad": 26 }
    ]
  },
  {
    "id": 4,
    "data": [
      { "nombre": "Rehabilitación", "cantidad": 15 }
    ]
  }
  // Puedes añadir más objetos si necesitas
]);

const alumnosPorTurnoMesData = ref({
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"], // Puedes poner los 12 meses
  datasets: [
    {
      label: "Mañana",
      data: [65, 59, 80, 81, 56, 55, 40], // Datos de ejemplo
      backgroundColor: "rgba(210, 214, 222, 0.8)", // Gris claro
      borderColor: "rgba(210, 214, 222, 1)",
      borderWidth: 1
    },
    {
      label: "Tarde",
      data: [45, 68, 50, 39, 86, 27, 90], // Datos de ejemplo
      backgroundColor: "rgba(0, 192, 239, 0.8)", // Celeste info
      borderColor: "rgba(0, 192, 239, 1)",
      borderWidth: 1
    }
  ]
});

// --- 👇 Opciones Específicas para el Gráfico Apilado ---
const stackedBarChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
        display: false, // El título está en el DashboardSection
    },
    tooltip: { // Opcional: mostrar total en tooltip
        mode: 'index',
        intersect: false,
        callbacks: {
            footer: (tooltipItems) => {
                let sum = 0;
                tooltipItems.forEach(function(tooltipItem) {
                    sum += tooltipItem.parsed.y;
                });
                return 'Total: ' + sum;
            },
        },
    }
  },
  scales: {
    x: {
      stacked: true, // ¡Importante para apilar!
      grid: {
        display: false // Opcional: Ocultar líneas de grid verticales
      }
    },
    y: {
      stacked: true, // ¡Importante para apilar!
      beginAtZero: true,
      grid: {
        color: '#e9ecef' // Opcional: Color suave para líneas horizontales
      }
    }
  }
});


const loadingMetodologias = ref(true);
const errorMetodologias = ref(false);

// Opciones personalizadas (opcional)
const donutChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
       callbacks: { // Mostrar porcentaje en tooltip
          label: function(context) {
              let label = context.label || '';
              if (label) {
                  label += ': ';
              }
              if (context.parsed !== null) {
                  // Calcula el total
                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  // Calcula el porcentaje
                  const percentage = ((context.parsed / total) * 100).toFixed(1) + '%';
                  label += `${context.parsed} (${percentage})`;
              }
              return label;
          }
      }
    }
  }
});

const procesarDatosMetodologia = (rawData) => {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    alumnosPorMetodologiaData.value = { labels: [], datasets: [{ data: [] }] };
    return;
  }

  const labels = [];
  const data = [];

  rawData.forEach(item => {
    // Accede a 'nombre' y 'cantidad' dentro del array 'data'
    if (item.data && Array.isArray(item.data) && item.data.length > 0) {
       // Asume que el array data solo tiene un objeto con nombre y cantidad
      const info = item.data.find(d => d.nombre && typeof d.cantidad === 'number');
      if (info) {
            labels.push(info.nombre); // El nombre de la metodología
            data.push(info.cantidad); // La cantidad de alumnos
        }
    }
  });


  // Paleta de colores (sin cambios)
  const backgroundColors = [
    '#E74C3C', '#2ECC71', '#F1C40F', '#3498DB', '#9B59B6',
    '#34495E', '#1ABC9C', '#E67E22', '#BDC3C7', '#7F8C8D'
  ];

  alumnosPorMetodologiaData.value = {
    labels: labels,
    datasets: [
      {
        backgroundColor: backgroundColors.slice(0, labels.length),
        data: data
      }
    ]
  };
};

import { obtenerHorariosCompletos } from '@/api/services/horarioService';



const datosOcupacion = ref([]);
//const loadingOcupacion = ref(true);
const errorOcupacion = ref(false);
const horariosPicoData = ref({});



const cantCuotas = 25; // Ejemplo de dato
const deudaTotal = 50000; // Ejemplo de dato
// `Deuda Total: $${deudaTotal}`
const cargarDatosDashboard = async () => {
  // --- Datos de Ejemplo ---
  kpiData.value = [
    { title: 'Alumnos Activos', value: '153', icon: 'fas fa-users', color: 'info' }, // Usa 'info' o tu mapeo
    { title: 'Cuotas Vencidas', value: `${cantCuotas}|$${deudaTotal}`, icon: 'fas fa-dollar-sign', color: 'success' },
    { title: 'Ingreso Mensual (cobrado)', value: '$35.000', icon: 'fas fa-exclamation-triangle', color: 'warning' },
    { title: 'Ingreso mensual (facturado)', value: '75%', icon: 'fas fa-chart-pie', color: 'danger' }, // Ejemplo con %
  ];
  console.log('Datos de KPIs cargados (ejemplo)');

  // Carga datos de ocupación
  errorOcupacion.value = false;
  try {
    const response = await obtenerHorariosCompletos();
    datosOcupacion.value = response;
    console.log("Datos de ocupación cargados:", datosOcupacion.value);
  } catch (error) {
    console.error("Error al cargar datos de ocupación:", error);
    errorOcupacion.value = true;
  } finally {
    // carga del componente finalizada
  }


  procesarDatosMetodologia(datosMetodologiaEjemplo.value);
};

onMounted(() => {
  cargarDatosDashboard();
});

</script>

<style scoped>
.contenedor {
  padding: 2rem; /* <-- RESTAURADO: Padding general */
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  /* max-width: 900px; */ /* <-- Eliminado para que ocupe el ancho */
  /* margin: auto; */ /* <-- Eliminado para que no se centre */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  overflow: hidden; /* Mantenido para contener bordes de DetallePersona */
  width: 100%;
}

/* El estilo del título se elimina porque el h2 está comentado/eliminado */
/* .titulo { ... } */


/* Media query para dispositivos móviles */
@media (max-width: 768px) {
  .contenedor {
    width: 100%; /* Asegura ancho completo */
    padding: 1.5rem; /* <-- RESTAURADO: Padding mediano */
    margin: 0; /* Asegura que no haya margen auto */
    box-sizing: border-box; /* Asegura que el padding no desborde */
  }
}

@media (max-width: 480px) {
  .contenedor {
     padding: 1rem; /* <-- RESTAURADO: Padding pequeño */
  }
}

.dashboard-admin-container {
  padding: 1rem;
}
.dashboard-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two equal columns */
  gap: 1.5rem;
}

.grid-span-2 {
  grid-column: span 2; /* Make this item span both columns */
}

@media (max-width: 992px) { /* On smaller screens, switch to one column */
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .grid-span-2 {
    grid-column: span 1;
  }
}

</style>