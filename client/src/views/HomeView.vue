<script setup>
import PostCard from "@/components/PostCard.vue";
import { useUserStore } from "@/store/userStore";
import Divider from "primevue/divider";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { ref } from "vue";
import Textarea from "primevue/textarea";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import ImageGallery from "../components/ImageGallery.vue";
import { createPostApi } from "@/apis/postApi";

const visible = ref(false);
const userStore = useUserStore();
const toast = useToast();
const content = ref("");
const images = ref([]);
const loading = ref(false);

const onUploadImages = async (event) => {
  const files = event.target.files;

  if (files.length > 4) {
    console.error("You can only upload a maximum of 4 images.");
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "You can only upload a maximum of 4 images.",
      life: 3000,
    });
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        images.value.push(reader.result);
      };
    }
  }
};

const onDeleteImage = (index) => {
  images.value.splice(index, 1);
};

const onCreatePost = async () => {
  loading.value = true;

  if (!content.value.trim()) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Content is required",
      life: 3000,
    });
    return;
  }

  try {
    const body = {
      content: content.value,
      images: images.value,
    };

    const response = await createPostApi(body);

    if (response) {
      toast.add({
        severity: "success",
        summary: "Post created",
        detail: response.message,
        life: 3000,
      });

      content.value = "";
      images.value = [];
    }
  } catch (error) {
    console.log("Error creating post:", error.message);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 3000,
    });
  } finally {
    loading.value = false;
    visible.value = false;
  }
};
</script>
<template>
  <div class="page-container">
    <section class="card-wrapper">
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
          size="small"
          @click="visible = true"
        />
      </div>
      <Divider />
      <div>
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
    </section>

    <Toast />

    <Dialog
      v-model:visible="visible"
      modal
      header="Create new post"
      :style="{ width: '40rem' }"
    >
      <form @submit.prevent="onCreatePost">
        <div class="dialog-body">
          <Textarea
            autoResize
            rows="3"
            placeholder="What's on your mind?"
            v-model="content"
            style="width: 100%; border: none"
          />

          <div v-if="images.length > 0">
            <ImageGallery :images="images" @delete-image="onDeleteImage" />
          </div>

          <div v-else class="box-images">
            <div class="image-upload-container">
              <input
                type="file"
                multiple
                accept="image/*"
                @change="onUploadImages"
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
            @click="visible = false"
          />
          <Button type="submit" label="Create post" :loading="loading" />
        </div>
      </form>
    </Dialog>
  </div>
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
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
