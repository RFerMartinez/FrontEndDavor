import { createRouter, createWebHistory } from 'vue-router'
import PantallaInicio from '../views/PantallaInicio.vue'
import LoginView from '../views/LoginView.vue'
import PantallaUsuario from '../views/PantallaUsuario.vue'
import PantallaAdmin from '@/views/PantallaAdmin.vue'

// Funciones del storage
import { getToken, getUser } from '@/api/storage/userStorage'

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: PantallaInicio
  },
    {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/Usuario',
    name: 'PantallaUsuario',  
    component: PantallaUsuario,
    meta: { requiresAuth: true, isAdmin: false }
  },
  {
    path: '/Admin',
    name: 'PantallaAdmin',
    component: PantallaAdmin,
    meta: { requiresAuth: true, isAdmin: true }
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation Guard Global
router.beforeEach((to, from, next) => {
  const loggedIn = !!getToken();
  const user = getUser();

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    // Si el usuario NO está logueado, redirige al login
    if (!loggedIn) {
      next({ name: 'login' });
    } else {
      // Si está logueado, verifica el rol (isAdmin)
      const isAdminRoute = to.meta.isAdmin;
      const userIsAdmin = user && user.esAdmin;

      if (isAdminRoute && !userIsAdmin) {
        // Si intenta acceder a una ruta de admin sin serlo, redirige a /usuario
        next({ name: 'PantallaUsuario' });
      } else if (!isAdminRoute && userIsAdmin) {
        // Si un admin intenta acceder a una ruta de usuario, redirige a /admin
        next({ name: 'PantallaAdmin' });
      } else {
        // Si tiene el rol correcto, permite el acceso
        next();
      }
    }
  } else {
    // Si la ruta no requiere autenticación, permite el acceso
    next();
  }
});

export default router
