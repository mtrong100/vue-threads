<script setup>
import Dialog from "primevue/dialog";
import ImageGallery from "./ImageGallery.vue";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import Textarea from "primevue/textarea";
import { watch } from "vue";
import { useUserStore } from "@/store/userStore";
import { usePostStore } from "@/store/postStore";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
});

const toast = useToast();
const postStore = usePostStore();
const userStore = useUserStore();

const onUpdatePost = () => {
  postStore.updatePost({
    postId: postStore.postDetails?._id,
    userId: userStore.currentUser?._id,
    type: props.type,
    toast,
  });
};

watch(
  () => postStore.postDetails,
  (newDetails) => {
    if (newDetails) {
      postStore.content = newDetails.content || "";
      postStore.images = newDetails.images || [];
    }
  },
  { immediate: true }
);
</script>

<template>
  <Dialog
    v-model:visible="postStore.visible2"
    modal
    header="Update your post"
    :style="{ width: '40rem' }"
  >
    <form @submit.prevent="onUpdatePost">
      <div class="dialog-body">
        <Textarea
          autoResize
          rows="3"
          placeholder="What's on your mind?"
          v-model="postStore.content"
          style="width: 100%; border: none"
        />

        <div v-if="postStore.images.length > 0">
          <ImageGallery
            :images="postStore.images"
            @delete-image="postStore.deleteImage(index)"
          />
        </div>

        <div v-else class="box-images">
          <div class="image-upload-container">
            <input
              type="file"
              multiple
              accept="image/*"
              @change="postStore.uploadImages(event, toast)"
              class="image-input"
            />
            <label for="file-input" class="file-label">
              <span class="file-icon">📁</span>
              <span class="file-text">Choose Images</span>
            </label>
          </div>
        </div>
      </div>

      <div class="bottom-dialog">
        <Button
          label="Close"
          outlined
          severity="danger"
          @click="postStore.setVisible2(false)"
        />
        <Button
          type="submit"
          label="Update post"
          :disabled="postStore.isUpdating"
          :loading="postStore.isUpdating"
        />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
.image-upload-container {
  position: relative;
  display: inline-block;
}
.image-upload-container:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}

.image-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-label {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.file-icon {
  margin-right: 8px;
}

.file-text {
  display: inline-block;
}

.box-images {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 100%;
  border-radius: 12px;
  border: 1px dashed #ccc;
}
.dialog-body {
  margin-bottom: 20px;
}
.bottom-dialog {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
