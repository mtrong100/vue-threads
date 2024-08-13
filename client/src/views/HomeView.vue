<script setup>
import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();

console.log(userStore.currentUser);
</script>
<template>
  <div class="page-container">
    <div>This is home page</div>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus voluptas
      explicabo, libero rerum, inventore praesentium magnam deserunt error
      aliquam unde tenetur officia tempore doloremque maxime facere perspiciatis
      consectetur minus voluptatem.
    </p>
  </div>
</template>

<style scoped></style>
