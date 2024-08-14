<script setup>
import PostCard from "@/components/PostCard.vue";
import { useUserStore } from "@/store/userStore";
import Divider from "primevue/divider";
import Avatar from "primevue/avatar";
import Button from "primevue/button";

const userStore = useUserStore();

console.log(userStore.currentUser);
</script>
<template>
  <div class="page-container">
    <section class="card-wrapper">
      <div class="facb">
        <div class="facenter" style="gap: 15px">
          <Avatar
            :image="userStore.currentUser?.profilePicture"
            size="large"
            shape="circle"
          />
          <span>Shared your thoughts...</span>
        </div>
        <Button label="Create post" raised size="small" />
      </div>
      <Divider />
      <div>
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
    </section>
  </div>
</template>

<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
