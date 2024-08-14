<script setup>
import { useUserStore } from "@/store/userStore";
import Button from "primevue/button";
import Image from "primevue/image";
import Divider from "primevue/divider";

const userStore = useUserStore();

const images = [
  "https://images.unsplash.com/photo-1723221788171-751662d867bf?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1723457135240-883758b1bc72?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1723489337930-8bdd92bba034?q=80&w=1924&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1723242017539-39cd15eb75fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];
</script>

<template>
  <article>
    <img
      class="profile-pic"
      :src="userStore.currentUser?.profilePicture"
      :alt="userStore.currentUser?.username"
    />

    <div class="facb" style="align-items: start">
      <div>
        <div class="facenter" style="gap: 10px">
          <p style="font-weight: 600">{{ userStore.currentUser?.username }}</p>
          <p class="date">3 hours ago</p>
        </div>

        <p class="paragraph" style="margin-top: 5px">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima sunt
          sint, doloremque necessitatibus voluptatibus blanditiis rerum placeat
        </p>

        <div class="image-box">
          <Image
            v-for="image in images"
            :src="image"
            alt="Image"
            preview
            imageStyle="width: 100%; height: 280px; border-radius: 8px; object-fit: cover"
          />
        </div>

        <div class="post-action">
          <div class="facenter" style="gap: 8px">
            <Button icon="pi pi-heart" severity="danger" text raised rounded />
            <Button icon="pi pi-comment" severity="info" text raised rounded />
            <Button icon="pi pi-share-alt" text raised rounded />
          </div>
          <Button
            icon="pi pi-trash"
            rounded
            severity="danger"
            raised
            outlined
          />
        </div>
      </div>

      <Button
        icon="pi pi-pencil"
        outlined
        rounded
        raised
        severity="info"
        style="flex-shrink: 0"
      />
    </div>
  </article>
  <Divider />
</template>

<style scoped>
article {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 15px;
}

.post-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.image-box {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px;
  margin-top: 15px;
}

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
