<template>
  <div class="auth-layout">
    <AuthBackground>
      <LoginRegistro :modo="$route.query.modo" />
    </AuthBackground>
    <Footer />
  </div>
</template>

<script>
import AuthBackground from '../components/Inicio/AuthBackground.vue'
import LoginRegistro from '@/components/Inicio/LoginRegistro.vue'
import Footer from '@/components/Inicio/Footer.vue';

export default {
  components: {
    AuthBackground,
    LoginRegistro,
    Footer
  }
}
</script>