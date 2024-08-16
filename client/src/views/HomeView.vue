<script setup>
import PostCard from "@/components/PostCard.vue";
import { useUserStore } from "@/store/userStore";
import Divider from "primevue/divider";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { usePostStore } from "@/store/postStore";
import { onMounted } from "vue";
import CreatePostDialog from "@/components/CreatePostDialog.vue";
import UpdatePostDialog from "@/components/UpdatePostDialog.vue";

const userStore = useUserStore();
const postStore = usePostStore();

onMounted(() => {
  postStore.fetchPosts();
});
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
        <Button
          label="Create post"
          raised
          @click="postStore.setVisible(true)"
        />
      </div>

      <Divider />

      <PostCard v-for="post in postStore.posts" :key="post?._id" :post="post" />

      <Button
        label="Load more"
        icon="pi pi-spinner"
        severity="contrast"
        style="display: flex; margin: 0 auto"
        @click="postStore.loadMorePosts"
        v-if="postStore.totalPosts > postStore.posts.length"
      />
    </section>

    <CreatePostDialog />
    <UpdatePostDialog />
  </div>
</template>

<style scoped></style>
