<script setup>
import PostCard from "@/components/PostCard.vue";
import { useUserStore } from "@/store/userStore";
import Button from "primevue/button";
import Divider from "primevue/divider";

const userStore = useUserStore();

const {
  username,
  profilePicture,
  email,
  followersCount,
  followingCount,
  postCount,
  bio,
} = userStore.currentUser;
</script>

<template>
  <div class="page-container">
    <section class="card-wrapper">
      <div class="facb">
        <div class="flexcol" style="gap: 5px">
          <h1 class="username">{{ username }}</h1>
          <p style="font-size: 13px">{{ email }}</p>
        </div>
        <img class="profile-pic" :src="profilePicture" :alt="username" />
      </div>

      <div class="bio">{{ bio || "Lorem ipsum" }}</div>

      <div class="follow-stats facenter">
        <span>{{ followersCount || 0 }} followers</span>
        <span>{{ followingCount || 0 }} following</span>
      </div>

      <Button
        label="Update profile"
        severity="secondary"
        outlined
        style="width: 100%; margin-top: 20px"
      />

      <Divider />

      <div class="my-posts">
        <PostCard />
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
