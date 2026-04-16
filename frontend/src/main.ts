import { createApp } from 'vue'
import App from './App.vue'
import { vuetify } from './plugins/vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import router from "./router";

createApp(App)
  .use(router)
  .mount("#app");

const app = createApp(App)

app.use(vuetify)

app.mount('#app')