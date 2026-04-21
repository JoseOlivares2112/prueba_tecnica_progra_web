import { createRouter, createWebHistory } from "vue-router";

import Crear from "../views/Crear.vue";
import Listar from "../views/Listar.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  { path: "/", component: Dashboard },
  { path: "/crear", component: Crear },
  { path: "/listar", component: Listar },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;