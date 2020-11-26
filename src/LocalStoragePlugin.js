/* eslint-disable */

export default {
  install(Vue) {
    Vue.prototype.$clientDb = window.localStorage
  },
};
