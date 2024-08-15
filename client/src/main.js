import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(ToastService);
app.use(ConfirmationService);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "light",
      cssLayer: false,
      ripple: true,
    },
  },
});
app.mount("#app");
