import Vue from "vue";
import VueGtag from "vue-gtag";
import { EventBus } from "./event-bus";
import App from "@/App";

Vue.config.productionTip = false;

Vue.use(VueGtag, {
  config: {
    id: process.env.VUE_APP_GA_UA
  }
});

Vue.mixin({
  methods: {
    nerdStat(stat) {
      EventBus.$emit("nerd-stat", stat);
    }
  }
});

new Vue({
  render: h => h(App)
}).$mount("#app");
