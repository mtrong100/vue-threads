<script setup>
import { logoutUserApi } from "@/apis/userApi";
import { useUserStore } from "@/store/userStore";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { RouterLink } from "vue-router";

const userStore = useUserStore();
const toast = useToast();
const loading = ref(false);

const onLogoutUser = async () => {
  loading.value = true;

  try {
    const response = await logoutUserApi();

    if (response) {
      userStore.removeCurrentUser();
      toast.add({
        severity: "success",
        summary: "Logout successful",
        detail: response.message,
        life: 1500,
      });

      router.push({ path: "/login" });
    }
  } catch (error) {
    console.log("Error logout user:", error.message);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 1500,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <header>
    <div class="page-layout">
      <div class="wrapper">
        <div class="logo"><span style="color: #42b883">Vue</span>Threads</div>

        <nav
          :style="{
            justifyContent: userStore.currentUser ? 'flex-start' : 'center',
          }"
        >
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/search">Search</RouterLink>
          <RouterLink v-if="userStore.currentUser" to="/following"
            >Following</RouterLink
          >
          <RouterLink v-if="userStore.currentUser" to="/notification"
            >Notification</RouterLink
          >
          <RouterLink v-if="userStore.currentUser" to="/profile"
            >Profile</RouterLink
          >
        </nav>

        <div style="display: flex; margin-left: auto">
          <RouterLink to="/login">
            <Button
              label="Login"
              icon="pi pi-sign-in"
              v-if="!userStore.currentUser"
            />
          </RouterLink>

          <Button
            severity="danger"
            outlined
            label="Logout"
            icon="pi pi-sign-out"
            @click="onLogoutUser"
            :loading="loading"
            v-if="userStore.currentUser"
          />
        </div>
      </div>
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
  height: 65px;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.logo {
  font-size: 30px;
  font-weight: bold;
  color: #333;
}
</style>
