import Firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/analytics";

export default {
  install(Vue) {
    /**
     * Configure default firebase
     */
    const config = {
      apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
      authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
      projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VUE_APP_FIREBASE_APP_ID,
      measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
    };

    Firebase.initializeApp(config);

    if (process.env.NODE_ENV === "production") {
      Firebase.analytics();
    }

    // eslint-disable-next-line
    Vue.prototype.$auth = Firebase.auth;
    // eslint-disable-next-line
    Vue.prototype.$firestore = Firebase.firestore;
    // eslint-disable-next-line
    Vue.prototype.$functions = Firebase.functions;
  },
};
