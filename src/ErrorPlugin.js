/* eslint-disable */

export default {
  install(Vue) {
    Vue.prototype.$error = message => {
      alert("There was an error: " + message);
      return false;
    };
  },
};
