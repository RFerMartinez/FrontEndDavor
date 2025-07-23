[⚠️ Suspicious Content] <template>
  <div class="form-container">
    <!-- INICIAR SESIÓN -->
    <div class="form-box" v-if="modo !== 'registro'">
      <h2 class="form-title">INICIAR SESIÓN</h2>
      <label>Usuario</label>
      <input type="text" placeholder="Ingrese su usuario">
      <label>Contraseña</label>
      <input type="password" placeholder="Ingrese su contraseña">
      <button @click="iniciarSesion">INICIAR SESIÓN</button>
      <div class="form-inline-links">
        <span class="small-link" @click="cambiarModo('registro')">Registrarse</span>
        <router-link class="small-link" to="/">Volver al inicio</router-link>
      </div>
    </div>

    <!-- REGISTRO PASO 1 -->
    <div class="form-box" v-else-if="paso === 1">
      <h2 class="form-title">REGISTRO - PASO 1</h2>
      <label>Correo Electronico</label>
      <input type="email" placeholder="ejemplo@gmail.com">
      <label>Usuario</label>
      <input type="text" placeholder="Nombre de usuario">
      <label>Contraseña</label>
      <input type="password" placeholder="Contraseña">
      <button @click="paso = 2">Siguiente</button>
      <div class="form-links">
        <router-link class="small-link" to="/">Volver al inicio</router-link>
        <span class="small-link" @click="cambiarModo('login')">Ir a Iniciar Sesión</span>
      </div>
    </div>

    <!-- REGISTRO PASO 2 -->
    <div class="form-box" v-else-if="paso === 2">
      <h2 class="form-title">REGISTRO - PASO 2</h2>
      <input type="text" placeholder="Nombre">
      <input type="text" placeholder="Apellido">
      <input type="text" placeholder="DNI">
      <input type="text" placeholder="Teléfono">
      <select>
        <option>Provincia</option>
        <option>Buenos Aires</option>
      </select>
      <select>
        <option>Localidad</option>
        <option>La Plata</option>
      </select>
      <input type="text" placeholder="Calle">
      <input type="text" placeholder="Número">
      <button @click="mostrarExito">Registrarse</button>
      <div class="form-links">
        <span class="small-link" @click="paso = 1">Volver al paso anterior</span>
        <span class="small-link" @click="cambiarModo('login')">Ir a Iniciar Sesión</span>
        <router-link class="small-link" to="/">Volver al inicio</router-link>
      </div>
    </div>

    <!-- MENSAJE DE ÉXITO -->
    <div class="mensaje-exito" id="mensajeExito" v-else >
     <div class="checkmark">&#10004;</div>
        <h3 >¡Registro Exitoso!</h3>
        <p>Gracias por registrarte en <strong>GYM Abito</strong>.<br>
        Tu cuenta ha sido creada exitosamente.<br>
        Por favor, acércate al gimnasio para que podamos asignarte una suscripción y un horario.<br>
        Estamos ubicados en calle 9 de julio 1355.<br>
        ¡Gracias por elegirnos! Nos enorgullece que formes parte de nuestra comunidad.</p>
      <router-link class="small-link" to="/">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ['modo'],
  data() {
    return {
      paso: this.modo === 'registro' ? 1 : 0
    }
  },
  methods: {
    cambiarModo(m) {
      this.$router.push({ path: '/login', query: { modo: m } })
    },
    iniciarSesion() {
      alert('Simulación de inicio de sesión')
    },
    mostrarExito() {
      this.paso = 3
    }
  },
  watch: {
    modo(nuevo) {
      this.paso = nuevo === 'registro' ? 1 : 0
    }
  }
}
</script>

<style scoped>
.form-container {
  width: 90%;
  max-width: 400px;
  position: relative;
  z-index: 2;
  height: 100vh;             /* Altura total de la pantalla */
  display: flex;
  justify-content: center;   /* Centra horizontalmente */
  align-items: center;       /* Centra verticalmente */
  margin: 0 auto;            /* Centra horizontalmente si no está flex */
  box-sizing: border-box;    /* Para que padding no afecte ancho */
}
.form-box {
  background-color: rgba(30, 30, 30, 0.95);
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: fadeIn 0.4s ease-in-out;
}
input, select {
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
}
button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #e50914;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
button:hover {
  background-color: #ff2a2a;
}
label {
  color: white;
}
.form-title {
  text-align: center;
  margin-bottom: 10px;
  color: white;
}
.form-links, .form-inline-links {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
  align-items: center;
}
.small-link {
  font-size: 0.85rem;
  color: #aaa;
  cursor: pointer;
  text-decoration: underline;
}
.small-link:hover {
  color: white;
}
.mensaje-exito {
  background-color: rgba(20, 20, 20, 0.95);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,255,0,0.2);
  text-align: center;
}
.checkmark {
  font-size: 50px;
  color: #00ff88;
  animation: pop 0.4s ease;
  margin-bottom: 10px;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.mensaje-exito {
  background-color: rgba(20, 20, 20, 0.95);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,255,0,0.2);
  animation: fadeIn 0.5s ease-in-out;
  text-align: center;
  color: white;
}
</style>
