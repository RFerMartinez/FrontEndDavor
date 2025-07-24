import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import '../public/data/metodologias.json'

createApp(App).use(router).mount('#app')
