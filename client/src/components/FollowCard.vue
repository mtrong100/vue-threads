<script setup>
import Divider from "primevue/divider";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { useUserStore } from "@/store/userStore";
import { RouterLink } from "vue-router";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const userStore = useUserStore();
</script>

<template>
  <div class="facb">
    <div style="display: flex; align-items: start; gap: 10px">
      <RouterLink :to="`/profile/${user?._id}`">
        <Avatar size="large" :image="user?.profilePicture" shape="circle" />
      </RouterLink>
      <div class="flexcol" style="gap: 5px">
        <RouterLink :to="`/profile/${user?._id}`" class="username">{{
          user?.username
        }}</RouterLink>
        <span style="font-size: 14px"
          >{{ user?.followersCount || 0 }} followers</span
        >
      </div>
    </div>

    <Button
      v-if="user.followers.includes(userStore.currentUser?._id)"
      label="Following"
      outlined
      @click="userStore.toggleFollowUser(user?._id)"
    />
    <Button
      v-else
      label="Follow"
      @click="userStore.toggleFollowUser(user?._id)"
    />
  </div>
  <Divider />
</template>

<style scoped>
.username {
  font-weight: bold;
  color: #333;
  text-decoration: none;
}
.username:hover {
  color: #42b883;
}
</style>
