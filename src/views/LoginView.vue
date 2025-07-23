<template>
  <HeroSection>
    <LoginRegistro :modo="$route.query.modo" />
  </HeroSection>
</template>

<script>
import HeroSection from '@/components/HeroSection.vue'
import LoginRegistro from '@/components/LoginRegistro.vue'

export default {
  components: {
    HeroSection,
    LoginRegistro
  }
}

</script>
