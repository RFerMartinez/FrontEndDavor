<template>
  <div class="auth-container">
    <div class="auth-header">
      <div class="brand-logo">
        <span class="brand-text">GIMNASIO</span>
        <span class="brand-accent">Abito</span>
      </div>
      <div class="form-tabs" v-if="modo !== 'registro' || paso === 1">
        <button 
          class="tab-btn" 
          :class="{ active: modo !== 'registro' }"
          @click="cambiarModo('login')"
        >
          Iniciar Sesión
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: modo === 'registro' }"
          @click="cambiarModo('registro')"
        >
          Registrarse
        </button>
      </div>
    </div>

    <div class="form-wrapper" v-if="modo !== 'registro'">
      <form class="auth-form" @submit.prevent="iniciarSesion">
        <div class="form-group">
          <input 
            v-model="loginData.username"
            type="text" 
            placeholder=" "
            class="form-input"
            required
            autocomplete="username"
          >
          <label class="form-label">Usuario</label>
          <div class="input-underline"></div>
        </div>

        <div class="form-group">
          <input 
            v-model="loginData.password"
            :type="passwordFieldType" 
            placeholder=" "
            class="form-input"
            required
            autocomplete="current-password"
          >
          <label class="form-label">Contraseña</label>
          <div class="input-underline"></div>
          
          <button 
            type="button" 
            @click="togglePasswordVisibility" 
            class="password-toggle-btn"
            aria-label="Mostrar u ocultar contraseña"
          >
            <svg v-if="passwordFieldType === 'password'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </button>
        </div>
        
        <div v-if="loginError" class="error-message">{{ loginError }}</div>

        <button type="submit" class="auth-btn primary" :disabled="loading">
          <span>INICIAR SESIÓN</span>
          <div class="btn-loader" v-if="loading"></div>
        </button>

        <div class="form-links">
          <router-link to="/" class="link-text">
            ← Volver al inicio
          </router-link>
        </div>
      </form>
    </div>

    <div class="form-wrapper" v-else-if="paso === 1">
      <form class="auth-form" @submit.prevent="siguientePaso">
        <div class="step-indicator">
          <div class="step active">1</div>
          <div class="step-line"></div>
          <div class="step">2</div>
        </div>

        <div class="form-group">
          <input 
            v-model="registerData.email"
            type="email" 
            placeholder=" "
            class="form-input"
            required
            autocomplete="email"
            @blur="validarEmail"
            @input="limpiarErrorEmail"
          >
          <label class="form-label">Correo Electrónico</label>
          <div class="input-underline"></div>
          <div class="error-message" v-if="emailError">{{ emailError }}</div>
        </div>

        <div class="form-group">
          <input 
            v-model="registerData.username"
            type="text" 
            placeholder=" "
            class="form-input"
            required
            autocomplete="username"
          >
          <label class="form-label">Usuario</label>
          <div class="input-underline"></div>
        </div>

        <div class="form-group">
          <input 
            v-model="registerData.password"
            :type="registerPasswordFieldType" 
            placeholder=" "
            class="form-input"
            required
            autocomplete="new-password"
            @input="limpiarErrorPassword"
          >
          <label class="form-label">Contraseña</label>
          <div class="input-underline"></div>
          <button 
            type="button" 
            @click="toggleRegisterPasswordVisibility" 
            class="password-toggle-btn"
            aria-label="Mostrar u ocultar contraseña"
          >
            <svg v-if="registerPasswordFieldType === 'password'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </button>
        </div>
        
        <div class="form-group">
          <input 
            v-model="registerData.confirmPassword"
            :type="registerConfirmPasswordFieldType" 
            placeholder=" "
            class="form-input"
            required
            autocomplete="new-password"
            @blur="validarContraseñas"
            @input="limpiarErrorPassword"
          >
          <label class="form-label">Confirmar Contraseña</label>
          <div class="input-underline"></div>
          <button 
            type="button" 
            @click="toggleRegisterConfirmPasswordVisibility" 
            class="password-toggle-btn"
            aria-label="Mostrar u ocultar contraseña"
          >
            <svg v-if="registerConfirmPasswordFieldType === 'password'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </button>
        </div>
        
        <div v-if="passwordError" class="error-message">{{ passwordError }}</div>

        <button type="submit" class="auth-btn primary">
          <span>CONTINUAR</span>
        </button>

        <div class="form-links">
          <router-link to="/" class="link-text">
            ← Volver al inicio
          </router-link>
        </div>
      </form>
    </div>

    <div class="form-wrapper" v-else-if="paso === 2">
      <form class="auth-form" @submit.prevent="mostrarExito">
        <div class="step-indicator">
          <div class="step completed">1</div>
          <div class="step-line completed"></div>
          <div class="step active">2</div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <input 
              type="text" 
              placeholder=" " 
              class="form-input" 
              required
              autocomplete="given-name"
            >
            <label class="form-label">Nombre</label>
            <div class="input-underline"></div>
          </div>

          <div class="form-group">
            <input 
              type="text" 
              placeholder=" " 
              class="form-input" 
              required
              autocomplete="family-name"
            >
            <label class="form-label">Apellido</label>
            <div class="input-underline"></div>
          </div>
        </div>

        <div class="form-group">
          <input 
            type="text" 
            placeholder=" " 
            class="form-input" 
            required
            autocomplete="off"
          >
          <label class="form-label">DNI</label>
            <div class="input-underline"></div>
        </div>

        <div class="form-group">
          <input 
            type="tel" 
            placeholder=" " 
            class="form-input" 
            required
            autocomplete="tel"
          >
          <label class="form-label">Teléfono</label>
            <div class="input-underline"></div>
        </div>

        <div class="form-group">
            <select class="form-input select-custom" required>
              <option value="" disabled selected>Seleccione sexo</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            <label class="form-label">Sexo</label>
            <div class="input-underline"></div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <select class="form-input select-custom" required autocomplete="address-level1">
              <option value="" disabled selected>Seleccione provincia</option>
              <option>Buenos Aires</option>
              <option>Córdoba</option>
              <option>Santa Fe</option>
              <option>Mendoza</option>
            </select>
            <label class="form-label">Provincia</label>
            <div class="input-underline"></div>
          </div>

          <div class="form-group">
            <select class="form-input select-custom" required autocomplete="address-level2">
              <option value="" disabled selected>Seleccione localidad</option>
              <option>La Plata</option>
              <option>Capital Federal</option>
              <option>Mar del Plata</option>
              <option>Bahía Blanca</option>
            </select>
            <label class="form-label">Localidad</label>
            <div class="input-underline"></div>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <input 
              type="text" 
              placeholder=" " 
              class="form-input" 
              required
              autocomplete="address-line1"
            >
            <label class="form-label">Calle</label>
            <div class="input-underline"></div>
          </div>

          <div class="form-group">
            <input 
              type="text" 
              placeholder=" " 
              class="form-input" 
              required
              autocomplete="address-line2"
            >
            <label class="form-label">Número</label>
            <div class="input-underline"></div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="auth-btn secondary" @click="paso = 1">
            VOLVER
          </button>
          <button type="submit" class="auth-btn primary">
            REGISTRARSE
          </button>
        </div>
      </form>
    </div>

    <div class="success-wrapper" v-else>
      <div class="success-content">
        <div class="checkmark-animation">
          <svg class="check-icon" viewBox="0 0 52 52">
            <circle class="check-circle" cx="26" cy="26" r="24" fill="none"/>
            <path class="check-mark" fill="none" d="M14 27l7 7 16-16"/>
          </svg>
        </div>
        
        <h3 class="success-title">¡Registro Exitoso!</h3>
        
        <div class="success-message">
          <p>Gracias por registrarte en <strong>GIMNASIO Abito</strong>.</p>
          <p>Tu cuenta ha sido creada exitosamente.</p>
          <p>Por favor, acércate al gimnasio para que podamos asignarte una suscripción y un horario.</p>
          <p class="location">📍 Calle 9 de julio 1355</p>
          <p>¡Gracias por elegirnos! Nos enorgullece que formes parte de nuestra comunidad.</p>
        </div>

        <router-link to="/" class="auth-btn primary">
          VOLVER AL INICIO
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// servicio de login
import { login } from '@/api/services/authService';

export default {
  props: ['modo'],
  data() {
    return {
      paso: this.modo === 'registro' ? 1 : 0,
      loading: false,
      loginData: { // Objeto para v-model
        username: '',
        password: ''
      },
      loginError: '', // Para mostrar mensajes de error
      emailError: '',
      passwordFieldType: 'password', // Para login
      
      // --- DATOS DE REGISTRO MODIFICADOS ---
      registerData: {
        email: '', // <-- NUEVO
        username: '', // <-- NUEVO
        password: '',
        confirmPassword: ''
      },
      registerPasswordFieldType: 'password',
      registerConfirmPasswordFieldType: 'password',
      passwordError: '' // Error de contraseñas no coinciden
      // --- FIN MODIFICACIÓN ---
    }
  },
  methods: {
    cambiarModo(m) {
      this.$router.push({ path: '/login', query: { modo: m } })
    },
    async iniciarSesion() {
      this.loading = true;
      this.loginError = ''; // Limpia errores previos
      try {
        const userData = await login(this.loginData.username, this.loginData.password);
        
        // Redirigir según el rol
        if (userData.esAdmin) {
          this.$router.push('/admin');
        } else {
          this.$router.push('/usuario');
        }
      } catch (error) {
        // Manejar errores de la API (ej: contraseña incorrecta)
        this.loginError = 'Usuario o contraseña incorrectos. Inténtalo de nuevo.';
      } finally {
        this.loading = false;
      }
    },
    
    siguientePaso() {
      // Validar email aquí también si es necesario, o en el blur es suficiente
      this.validarContraseñas(); // Validar antes de continuar
      if (!this.passwordError && !this.emailError) { // Asegurarse de no avanzar con errores
        this.paso = 2;
      }
    },
    mostrarExito() {
      this.paso = 3
    },
    validarEmail(event) {
      // Usar el v-model en lugar de event.target.value
      const email = this.registerData.email;
      if (email && !this.esEmailValido(email)) {
        this.emailError = 'Por favor ingresa un correo electrónico válido';
      } else {
        this.emailError = '';
      }
    },
    limpiarErrorEmail() {
      this.emailError = '';
    },
    esEmailValido(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },
    
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },

    toggleRegisterPasswordVisibility() {
      this.registerPasswordFieldType = this.registerPasswordFieldType === 'password' ? 'text' : 'password';
    },
    toggleRegisterConfirmPasswordVisibility() {
      this.registerConfirmPasswordFieldType = this.registerConfirmPasswordFieldType === 'password' ? 'text' : 'password';
    },
    validarContraseñas() {
      if (this.registerData.password && this.registerData.confirmPassword && this.registerData.password !== this.registerData.confirmPassword) {
        this.passwordError = 'Las contraseñas no coinciden';
      } else {
        this.passwordError = '';
      }
    },
    limpiarErrorPassword() {
       this.passwordError = '';
    }
  },
  watch: {
    modo(nuevo) {
      this.paso = nuevo === 'registro' ? 1 : 0;
      this.loginError = ''; // Limpia errores al cambiar de modo
      this.passwordError = ''; // Limpia error de contraseña también
      this.emailError = '';
      // No limpiar registerData para que persista
    }
  }
}
</script>

<style scoped>
.error-message {
  color: #ff4757;
  font-size: 0.9rem;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}

.auth-container {
  width: 100%;
  max-width: 480px;
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-logo {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 1.5rem;
  font-family: 'Poppins', sans-serif;
}

.brand-text {
  color: #ffffff;
}

.brand-accent {
  color: #e50914;
}

.form-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.tab-btn.active {
  background: rgba(229, 9, 20, 0.2);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(229, 9, 20, 0.3);
}

.tab-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.form-wrapper {
  animation: fadeIn 0.4s ease;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-form[gap="1.5rem"] .form-group {
    margin-bottom: 0; 
}
.auth-form .error-message {
    margin-top: -0.5rem; 
    margin-bottom: 0;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.step.active {
  background: rgba(229, 9, 20, 0.2);
  color: #e50914;
  border-color: #e50914;
}

.step.completed {
  background: #00ff88;
  color: #000;
}

.step-line {
  flex: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  max-width: 60px;
  transition: all 0.3s ease;
}

.step-line.completed {
  background: #00ff88;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  position: relative;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 1rem 0 0.5rem;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* V--- ESTILOS DE SELECT MODIFICADOS ---V */
.select-custom {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 30px;
  cursor: pointer;
  
  /* NUEVO: Oculta el texto inicial (ej: "Seleccione...") */
  color: transparent; 
}

/* NUEVO: Muestra el texto en blanco SÓLO cuando se selecciona una opción válida */
.select-custom:valid {
  color: #ffffff;
}

.select-custom option {
  background: #1a1a1a;
  color: white;
  /* padding: 8px; (eliminado, no funciona bien) */
}
/* ^--- FIN ESTILOS DE SELECT ---^ */


.select-custom:focus {
  outline: none;
  border-bottom-color: #e50914;
}

.select-custom:focus + .form-label,
.select-custom:valid + .form-label {
  transform: translateY(-1.5rem) scale(0.85);
  color: #e50914;
}

.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover,
.form-input:-webkit-autofill:focus {
  -webkit-text-fill-color: #ffffff;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset;
  transition: background-color 5000s ease-in-out 0s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.form-input:focus {
  outline: none;
  border-bottom-color: #e50914;
}

.form-input:focus + .form-label,
.form-input:not(:placeholder-shown) + .form-label {
  transform: translateY(-1.5rem) scale(0.85);
  color: #e50914;
}

.form-input.select-custom:required:valid + .form-label {
    transform: translateY(-1.5rem) scale(0.85);
    color: #e50914;
}

.form-label {
  position: absolute;
  top: 1rem;
  left: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #e50914, #ff4757);
  transition: width 0.3s ease;
}

.form-input:focus ~ .input-underline {
  width: 100%;
}

.password-toggle-btn {
  position: absolute;
  top: 1rem; 
  right: 0;
  transform: translateY(0);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.3s ease;
}

.password-toggle-btn:focus {
  outline: none;
}

.password-toggle-btn svg {
  width: 20px;
  height: 20px;
}

.password-toggle-btn:hover {
  color: #e50914; 
}

.form-group + .error-message {
    margin-top: -1rem; 
    margin-bottom: 0.5rem;
}
.form-group .error-message { 
  color: #ff4757;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  font-family: 'Inter', sans-serif;
  animation: slideDown 0.3s ease;
}


.auth-btn {
  position: relative;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
}

.auth-btn.primary {
  background: linear-gradient(135deg, #e50914, #ff4757);
  color: white;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
}

.auth-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
}

.auth-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.form-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.form-links {
  text-align: center;
  margin-top: 1.5rem;
}

.link-text {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.link-text:hover {
  color: #e50914;
}

.success-wrapper {
  animation: fadeIn 0.6s ease;
}

.success-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.checkmark-animation {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
}

.check-icon {
  width: 100%;
  height: 100%;
  stroke: #00ff88;
  stroke-width: 4;
  stroke-miterlimit: 10;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.check-circle {
  stroke-dasharray: 150;
  stroke-dashoffset: 150;
  animation: stroke-circle 0.6s ease-in-out forwards;
}

.check-mark {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke-check 0.4s 0.6s ease-in-out forwards;
}

.success-title {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-family: 'Poppins', sans-serif;
  text-align: center;
}

.success-message {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
}

.success-message p {
  margin-bottom: 1rem;
  text-align: center;
}

.location {
  color: #00ff88;
  font-weight: 600;
  text-align: center;
}

.btn-loader {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Animaciones */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes stroke-circle {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes stroke-check {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .auth-container {
    margin: 1rem;
    padding: 2rem 1.5rem;
    max-width: none;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    grid-template-columns: 1fr;
  }

  .brand-logo {
    font-size: 1.5rem;
  }

  .auth-btn {
    padding: 0.875rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 1.5rem 1rem;
    margin: 0.5rem;
  }

  .form-tabs {
    flex-direction: column;
  }

  .tab-btn {
    padding: 1rem;
  }
}
</style>