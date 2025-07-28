<template>
  <div class="login-layout">
    <FondoInicio>
      <LoginRegistro :modo="$route.query.modo" />
    </FondoInicio>
    <Footer />
  </div>
</template>

<script>
import FondoInicio from '@/components/Inicio/FondoInicio.vue'
import LoginRegistro from '@/components/Inicio/LoginRegistro.vue'
import Footer from '@/components/Inicio/Footer.vue';

export default {
  components: {
    FondoInicio,
    LoginRegistro,
    Footer
  }
}

</script>
