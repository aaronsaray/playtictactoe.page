import Vue from "vue";
import VueRouter from "vue-router";
import GameView from "@/views/GameView.vue";
import AboutView from "@/views/AboutView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "GameView",
    component: GameView,
  },
  {
    path: "/about",
    name: "AboutView",
    component: AboutView,
  },
  {
    path: "/:series_id",
    name: "GameViewWithSeriesId",
    component: GameView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
