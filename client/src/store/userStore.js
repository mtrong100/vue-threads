import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: JSON.parse(localStorage.getItem("VUE_THREADS_USER")) || null,
  }),
  actions: {
    saveCurrentUser(user) {
      this.currentUser = user;
      localStorage.setItem("VUE_THREADS_USER", JSON.stringify(user));
    },
    removeCurrentUser() {
      this.currentUser = null;
      localStorage.removeItem("VUE_THREADS_USER");
    },
  },
});
