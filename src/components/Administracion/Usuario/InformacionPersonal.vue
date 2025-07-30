<template>
  <div class="contenedor">
    <h2 class="titulo">Información Personal</h2>

    <!-- DATOS PERSONALES -->
    <div class="bloque">
      <h3 class="subtitulo">Datos Personales</h3>
      <div class="grid">
        <div class="campo">
          <label>Nombre:</label>
          <input type="text" value="Juan" disabled />
        </div>
        <div class="campo">
          <label>Apellido:</label>
          <input type="text" value="Pérez" disabled />
        </div>
        <div class="campo">
          <label>DNI:</label>
          <input type="text" value="12345678" disabled />
        </div>
      </div>
    </div>

    <!-- CONTACTO -->
    <div class="bloque">
      <h3 class="subtitulo">Información de Contacto</h3>
      <div class="grid">
        <div class="campo">
          <label>Gmail:</label>
          <input type="email" value="juan.perez@gmail.com" disabled />
        </div>
        <div class="campo">
          <label>Teléfono:</label>
          <input type="tel" value="1122334455" disabled />
        </div>
      </div>
    </div>

    <!-- DIRECCIÓN -->
    <div class="bloque">
      <h3 class="subtitulo">Dirección</h3>
      <div class="grid">
        <div class="campo">
          <label>Provincia:</label>
          <input type="text" value="Buenos Aires" disabled />
        </div>
        <div class="campo">
          <label>Localidad:</label>
          <input type="text" value="La Plata" disabled />
        </div>
        <div class="campo">
          <label>Calle:</label>
          <input type="text" value="Av. 7" disabled />
        </div>
        <div class="campo">
          <label>Número:</label>
          <input type="text" value="1234" disabled />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contenedor {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  max-width: 900px; /* Ancho aumentado ligeramente */
  margin: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  overflow-y: auto; /* Scroll interno */
}

.titulo {
  font-size: 2rem;
  color: #e91e63;
  margin-bottom: 1rem;
  text-align: center;
}

.subtitulo {
  font-size: 1.2rem;
  color: #333;
  margin: 1rem 0 0.5rem;
  border-bottom: 1px solid #e91e63;
  padding-bottom: 0.2rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.campo {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 0.3rem;
  color: #555;
}

input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f5f5f5;
  color: #333;
}
</style>
