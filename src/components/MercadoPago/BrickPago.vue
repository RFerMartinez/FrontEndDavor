<template>
    <div>
        <h4>Confirmar Pago</h4>
        <p v-if="!error">Se generará un botón de pago para la cuota con monto: <strong>${{ monto }}</strong></p>
        
        <div id="wallet_container"></div>

        <div v-if="cargando" class="loading">
        Cargando...
        </div>
        <div v-if="error" class="error">
        {{ error }}
        </div>
    </div>
</template>

<script>
import { crearPreferenciaDePago } from "@/api/services/pagoService.js";
// 1. ELIMINA esta importación que falla
// import { getCuotaById } from "@/api/services/cuotasService.js"; 

export default {
    name: "BrickPago",
    props: {
        cuotaId: {
        type: Number,
        required: true,
        },
        // 2. AÑADE el prop 'monto' que viene desde el padre
        monto: {
        type: Number,
        required: true,
        }
    },
    data() {
        return {
        mp: null,
        cargando: false,
        error: null,
        // 3. Ya no necesitamos 'monto' en data, porque es un prop
        };
    },
    async mounted() {
        this.mp = new MercadoPago("TU-PUBLIC-KEY-DE-SANDBOX", {
        locale: "es-AR",
        });

        // 4. ELIMINA la llamada a la función que no existe
        // await this.obtenerDatosCuota();

        // Inicia el pago directamente
        await this.iniciarPago();
    },
    methods: {
        // 5. ELIMINA toda esta función
        /*
        async obtenerDatosCuota() {
        try {
            const cuota = await getCuotaById(this.cuotaId);
            this.monto = cuota.monto; 
        } catch (err) {
            console.error("Error al obtener datos de la cuota:", err);
            this.error = "No se pudieron cargar los detalles de la cuota.";
        }
        },
        */

        async iniciarPago() {
        this.cargando = true;
        this.error = null;

        try {
            const data = await crearPreferenciaDePago(this.cuotaId);
            const preferenceId = data.preference_id;
            this.renderizarBrick(preferenceId);
        } catch (err) {
            console.error("Error al crear la preferencia:", err);
            this.error = "Error al contactar con MercadoPago. Intente más tarde.";
        } finally {
            this.cargando = false;
        }
        },

        async renderizarBrick(preferenceId) {
        // ... (este método queda igual)
        const bricksBuilder = this.mp.bricks();
        const container = document.getElementById("wallet_container");
        if (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
            preferenceId: preferenceId,
            },
            customization: {
            texts: {
                valueProp: 'smart_option',
            },
            },
        });
        },
    },
    watch: {
        cuotaId() {
        this.iniciarPago();
        }
    }
};
</script>

<style scoped>
.loading, .error {
    text-align: center;
    padding: 20px;
}
.error {
    color: red;
}
</style>