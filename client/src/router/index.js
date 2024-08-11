import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "@/views/RegisterView.vue";
import ProfileVue from "@/views/ProfileVue.vue";
import MainLayout from "@/components/layouts/MainLayout.vue";
import AuthenLayout from "@/components/layouts/AuthenLayout.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", component: HomeView },
      { path: "profile", component: ProfileVue },
    ],
  },
  {
    path: "/",
    component: AuthenLayout,
    children: [
      { path: "login", component: LoginView },
      { path: "register", component: RegisterView },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
