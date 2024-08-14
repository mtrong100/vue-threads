<script setup>
import Divider from "primevue/divider";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();
</script>

<template>
  <div class="facb">
    <div style="display: flex; align-items: start; gap: 10px">
      <Avatar
        size="large"
        :image="userStore.currentUser?.profilePicture"
        shape="circle"
      />
      <div class="flexcol" style="gap: 5px">
        <h5>{{ userStore.currentUser?.username }}</h5>
        <span style="font-size: 14px"
          >{{ userStore.currentUser?.followers || 0 }} followers</span
        >
      </div>
    </div>

    <Button label="Follow" outlined />
  </div>
  <Divider />
</template>

<style scoped></style>
