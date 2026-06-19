import { createRouter, createWebHistory } from "vue-router";
import HomeView               from "../views/HomeView.vue";
import MenuView               from "../views/MenuView.vue";
import ConfiguracaoPedidoView from "../views/ConfiguracaoPedidoView.vue";
import PedidoView             from "../views/PedidoView.vue";

const routes = [
  { path: "/",        name: "home",    component: HomeView },
  { path: "/menu",    name: "menu",    component: MenuView },
  { path: "/config",  name: "config",  component: ConfiguracaoPedidoView },
  { path: "/pedidos", name: "pedidos", component: PedidoView },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;