import { createRouter, createWebHistory } from 'vue-router'
import PantallaInicio from '../views/PantallaInicio.vue'
import LoginView from '../views/LoginView.vue'
import PantallaUsuario from '../views/PantallaUsuario.vue'

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
    path: '/PantallaUsuario',
    name: 'PantallaUsuario',  
    component: PantallaUsuario
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
