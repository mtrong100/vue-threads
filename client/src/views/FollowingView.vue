<script setup>
import PostCard from "@/components/PostCard.vue";
import { usePostStore } from "@/store/postStore";
import Button from "primevue/button";
import { onMounted } from "vue";

const postStore = usePostStore();

onMounted(() => {
  postStore.fetchPosts({ type: "following" });
});
</script>
<template>
  <div class="page-container">
    <section class="card-wrapper">
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
        :type="'following'"
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
    </section>
  </div>
</template>
