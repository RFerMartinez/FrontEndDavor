<template>
  <section class="hero-section">
    <slot></slot>
  </section>
</template>

<style scoped>
.hero-section {
  background: url('../assets/fondo.jpg') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  height: 100vh;
  position: relative;
}

.hero-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #000 100%);
}
</style>
