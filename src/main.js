import Vue from "vue";
import VueGtag from "vue-gtag";
import App from "@/App";

Vue.config.productionTip = false;

Vue.use(VueGtag, {
  config: {
    id: process.env.VUE_APP_GA_UA
  }
});

new Vue({
  render: h => h(App)
}).$mount("#app");
