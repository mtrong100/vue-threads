<script setup>
import Button from "primevue/button";
import Divider from "primevue/divider";
import PostImageLayout from "./PostImageLayout.vue";
import { formatDate } from "@/utils/helper";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["delete-post"]);
</script>

<template>
  <article>
    <img
      class="profile-pic"
      :src="post?.author?.profilePicture"
      :alt="post?.author?.username"
    />

    <div style="flex: 1">
      <div class="facenter" style="gap: 10px">
        <p style="font-weight: 600">{{ post?.author?.username }}</p>
        <p class="date">{{ formatDate(post?.createdAt) }}</p>
      </div>

      <p v-if="post?.content" class="paragraph" style="margin-top: 5px">
        {{ post?.content }}
      </p>

      <div v-if="post?.images" style="margin-top: 10px">
        <PostImageLayout :images="post?.images" />
      </div>

      <div class="post-action">
        <div class="facenter" style="gap: 8px">
          <Button icon="pi pi-heart" severity="danger" text raised rounded />
          <Button icon="pi pi-comment" severity="info" text raised rounded />
          <Button icon="pi pi-share-alt" text raised rounded />
        </div>
        <div class="facenter" style="gap: 8px">
          <Button icon="pi pi-pencil" outlined rounded raised severity="info" />
          <Button
            icon="pi pi-trash"
            rounded
            severity="danger"
            raised
            outlined
            @click="emit('delete-post', post?._id)"
          />
        </div>
      </div>
    </div>
  </article>
  <Divider />
</template>

<style scoped>
article {
  display: flex;
  align-items: start;
  gap: 15px;
}

.post-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
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
