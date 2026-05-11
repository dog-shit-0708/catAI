import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'

// GitHub Pages SPA 路由重定向处理
const redirect = sessionStorage.redirect;
delete sessionStorage.redirect;
if (redirect && redirect !== location.href) {
  history.replaceState(null, null, redirect);
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
