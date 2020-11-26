import Vue from "vue";
import { firestorePlugin } from "vuefire";
import App from "@/App.vue";
import router from "./router";
import FirebasePlugin from "./FirebasePlugin";
import ErrorPlugin from "./ErrorPlugin";
import LocalStoragePlugin from "./LocalStoragePlugin";

Vue.use(firestorePlugin);
Vue.use(FirebasePlugin);
Vue.use(ErrorPlugin);
Vue.use(LocalStoragePlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
