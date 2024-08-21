<script setup>
import { formatDate } from "@/utils/helper";
import Button from "primevue/button";

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["delete-comment"]);
</script>

<template>
  <div class="comment-box">
    <div class="comment-header">
      <img :src="comment?.profilePicture" alt="User Avatar" class="avatar" />
      <div class="user-info">
        <h4 class="username">{{ comment?.username }}</h4>
        <span class="timestamp">{{ formatDate(comment?.createdAt) }}</span>
      </div>
    </div>
    <div class="comment-content">
      <p>{{ comment?.text }}</p>
      <Button
        @click="emit('delete-comment', comment?._id)"
        label="Delete"
        severity="danger"
        outlined
        size="small"
      />
    </div>
  </div>
</template>

<style scoped>
.comment-box {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.timestamp {
  font-size: 12px;
  color: #888;
}

.comment-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}
</style>
