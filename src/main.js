import Vue from "vue";
import { firestorePlugin } from "vuefire";
import App from "@/App.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import router from "./router";
import FirebasePlugin from "./FirebasePlugin";
import ErrorPlugin from "./ErrorPlugin";

Vue.use(firestorePlugin);
Vue.use(FirebasePlugin);
Vue.use(ErrorPlugin);

Vue.component("loading-spinner", LoadingSpinner);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
