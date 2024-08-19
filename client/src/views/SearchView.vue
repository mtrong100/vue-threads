<script setup>
import InputGroup from "primevue/inputgroup";
import Divider from "primevue/divider";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FollowCard from "@/components/FollowCard.vue";
import { useUserStore } from "@/store/userStore";
import { onMounted, watch } from "vue";

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchUsers();
});

watch(
  () => userStore.search,
  () => {
    userStore.fetchUsers({ query: userStore.search });
  }
);
</script>

<template>
  <div class="page-container">
    <section class="card-wrapper">
      <InputGroup>
        <InputText placeholder="Search..." v-model="userStore.search" />
        <Button icon="pi pi-search" />
      </InputGroup>
      <Divider />
      <div>
        <FollowCard
          v-for="user in userStore.users"
          :key="user.id"
          :user="user"
        />
      </div>
    </section>
  </div>
</template>

<style scoped></style>
