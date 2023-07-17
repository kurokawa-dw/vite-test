import { createApp } from 'vue'
import App from './vue/sample.vue'
import indexPage from './pages/index/script'
console.log('メインjs');

indexPage();

createApp(App).mount('#vue-app')