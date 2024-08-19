<script setup>
import { onMounted, ref, watch } from "vue";
import PostCard from "@/components/PostCard.vue";
import { useUserStore } from "@/store/userStore";
import Button from "primevue/button";
import Divider from "primevue/divider";
import { usePostStore } from "@/store/postStore";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const postStore = usePostStore();
const route = useRoute();
const userId = route.params.id;

onMounted(() => {
  postStore.fetchPosts({ userId, type: "user" });
  userStore.fetchUserDetails(userId);
});
</script>

<template>
  <div class="page-container">
    <section class="card-wrapper">
      <div class="facb">
        <div class="flexcol" style="gap: 5px">
          <h1 class="username">{{ userStore.userDetails?.username }}</h1>
          <p style="font-size: 14px">{{ userStore.userDetails?.email }}</p>
        </div>
        <img
          class="profile-pic"
          :src="userStore.userDetails?.profilePicture"
          :alt="userStore.userDetails?.username"
        />
      </div>

      <div class="bio">{{ userStore.userDetails?.bio || "Lorem ipsum" }}</div>

      <div class="follow-stats facenter">
        <span>{{ userStore.userDetails?.followersCount || 0 }} followers</span>
        <span>{{ userStore.userDetails?.followingCount || 0 }} following</span>
        <span>{{ userStore.userDetails?.postCount || 0 }} posts</span>
      </div>

      <Divider />

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
          :showPostAction="true"
          :type="'user'"
        />

        <Button
          label="Load more"
          icon="pi pi-spinner"
          severity="contrast"
          style="display: flex; margin: 0 auto"
          v-if="!postStore.loadingPosts && postStore.hasMorePosts"
          :disabled="!postStore.hasMorePosts || postStore.loadingPosts"
          :loading="postStore.loadingPosts"
          @click="
            postStore.fetchMorePosts({
              userId: userStore.currentUser?._id,
              type: 'user',
            })
          "
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.follow-stats {
  gap: 15px;
}

.bio,
.follow-stats {
  margin-top: 15px;
  font-size: 15px;
}
.username {
  font-size: 25px;
  font-weight: bold;
}
.profile-pic {
  border-radius: 100rem;
  width: 85px;
  height: 85px;
  object-fit: cover;
}
</style>
