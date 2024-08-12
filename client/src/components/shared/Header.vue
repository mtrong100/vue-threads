<script setup>
import Button from "primevue/button";
import { RouterLink } from "vue-router";

const NAV_LINKS = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Search",
    link: "/search",
  },
  {
    label: "Favorite",
    link: "/favorite",
  },
  {
    label: "Profile",
    link: "/profile",
  },
];
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="logo"><span style="color: #42b883">Vue</span>Threads</div>

      <nav>
        <RouterLink
          v-for="link in NAV_LINKS"
          :key="link.label"
          :to="link.link"
          >{{ link.label }}</RouterLink
        >
      </nav>

      <RouterLink to="/login">
        <Button label="Login" icon="pi pi-sign-in" />
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

nav a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
}

nav a:hover {
  color: #42b883;
}

header {
  height: 60px;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  padding: 0 20px;
  margin-left: auto;
  margin-right: auto;
}

.logo {
  font-size: 30px;
  font-weight: bold;
  color: #333;
}
</style>
