<script setup>
import { useUserStore } from "@/store/userStore";
import Button from "primevue/button";

const userStore = useUserStore();
</script>

<template>
  <div>
    <div class="facenter" style="gap: 15px; align-items: start">
      <img
        class="profile-pic"
        :src="userStore.currentUser?.profilePicture"
        :alt="userStore.currentUser?.username"
      />

      <div>
        <div class="facenter" style="gap: 10px">
          <p style="font-weight: 600">{{ userStore.currentUser?.username }}</p>
          <p class="date">3 hours ago</p>
        </div>

        <p class="paragraph" style="margin-top: 5px">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima sunt
          sint, doloremque necessitatibus voluptatibus blanditiis rerum placeat
        </p>
      </div>

      <Button
        icon="pi pi-pencil"
        size="small"
        outlined
        rounded
        style="flex-shrink: 0"
      />
    </div>
  </div>
</template>

<style scoped>
.profile-pic {
  border-radius: 100rem;
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.date {
  color: gray;
  font-size: 13px;
}
.praragraph {
  font-size: 14px;
  line-height: 1.5;
  font-weight: 300;
  color: #333;
}
</style>
