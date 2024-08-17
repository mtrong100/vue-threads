<script setup>
import PostCard from "@/components/PostCard.vue";
import { useUserStore } from "@/store/userStore";
import Divider from "primevue/divider";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { onMounted } from "vue";
import CreatePostDialog from "@/components/CreatePostDialog.vue";
import UpdatePostDialog from "@/components/UpdatePostDialog.vue";
import { usePostStore } from "@/store/postStore";
import ConfirmDialog from "primevue/confirmdialog";

const userStore = useUserStore();
const postStore = usePostStore();

onMounted(() => {
  postStore.fetchPosts();
});
</script>
<template>
  <div class="page-container">
    <section class="card-wrapper">
      <!-- Create post UI -->
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

      <!-- Display posts UI -->
      <div>
        <Button
          type="button"
          text
          :loading="postStore.loadingPosts"
          disabled
          label="Loading posts..."
          severity="secondary"
          class="load-more-button"
          v-if="postStore.loadingPosts && !postStore.posts.length"
        />

        <PostCard
          v-for="post in postStore.posts"
          :key="post?._id"
          :post="post"
        />

        <Button
          label="Load more"
          icon="pi pi-spinner"
          severity="contrast"
          style="display: flex; margin: 0 auto"
          v-if="!postStore.loadingPosts && postStore.hasMorePosts"
          :disabled="!postStore.hasMorePosts || postStore.loadingPosts"
          :loading="postStore.loadingPosts"
          @click="postStore.fetchMorePosts"
        />
      </div>
    </section>

    <ConfirmDialog></ConfirmDialog>
    <CreatePostDialog />
    <UpdatePostDialog />
  </div>
</template>
