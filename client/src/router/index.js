import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import SearchView from "@/views/SearchView.vue";
import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "@/views/RegisterView.vue";
import ProfileVue from "@/views/ProfileVue.vue";
import MainLayout from "@/components/layouts/MainLayout.vue";
import AuthenLayout from "@/components/layouts/AuthenLayout.vue";
import { useUserStore } from "@/store/userStore";
import FollowingView from "@/views/FollowingView.vue";
import NotificationView from "@/views/NotificationView.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", component: HomeView },
      { path: "profile", component: ProfileVue },
      { path: "search", component: SearchView },
      { path: "notification", component: NotificationView },
      { path: "following", component: FollowingView },
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

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  const allowedPaths = ["/login", "/register", "/", "/search"];

  const publicPages = allowedPaths;
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !userStore.currentUser) {
    return next("/login");
  }

  next();
});

export default router;
