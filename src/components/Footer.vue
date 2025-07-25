<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-left">
        <!-- Reemplazá el src cuando tengas tu logo -->
        <img src="" alt="Logo" class="footer-logo" /> <!src= !@/assets/logo-footer.png>
      </div>

      <div class="footer-center">
        <p>© Copyright 2025 | Todos los derechos reservados</p>
        <! aca las politicas si hace falta>
      </div>

      <div class="footer-right">
        <!-- Íconos temporales, reemplazá los href luego -->
        <a href="https://www.instagram.com/gymabito/?igsh=MW5pdzkyY3YyY3NzOA%3D%3D#" target="_blank"><i class="fab fa-instagram"></i></a>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No necesita props de momento
</script>

<style scoped>
.footer {
  background-color: #000;
  color: white;
  padding: 30px 20px;
  font-family: 'Poppins', sans-serif;
  border-top: 1px solid #222;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  gap: 20px;
}

.footer-logo {
  height: 40px;
  margin-bottom: 10px;
}

.footer-left p {
  margin: 0;
  font-weight: 600;
}

.footer-center p {
  margin: 0;
  font-size: 0.9rem;
}

.footer-center a {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  margin: 0 5px;
}

.footer-right a {
  color: white;
  margin: 0 8px;
  font-size: 1.3rem;
  transition: color 0.3s;
}

.footer-right a:hover {
  color: #e50914;
}
</style>
