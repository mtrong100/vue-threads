<script setup>
import PostCard from "@/components/PostCard.vue";
import { useUserStore } from "@/store/userStore";
import Divider from "primevue/divider";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import { useToast } from "primevue/usetoast";
import ImageGallery from "../components/ImageGallery.vue";
import { usePostStore } from "@/store/postStore";
import { onMounted } from "vue";
import ProgressSpinner from "primevue/progressspinner";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";

const toast = useToast();
const confirm = useConfirm();
const userStore = useUserStore();
const postStore = usePostStore();

const onUploadImages = async (event) => {
  await postStore.uploadImages(event, toast);
};

const onDeleteImage = (index) => {
  postStore.deleteImage(index);
};

const onCreatePost = async () => {
  await postStore.createPost(toast);
};

const confirmDeleteBox = (postId) => {
  confirm.require({
    message: "Do you want to delete this post?",
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      postStore.deletePost(postId, toast);
    },
    reject: () => {},
  });
};

onMounted(() => {
  postStore.fetchPosts();
});
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
          @click="postStore.setVisible(true)"
        />
      </div>
      <Divider />

      <div v-if="postStore.loading" class="facenter">
        <ProgressSpinner />
      </div>

      <PostCard
        v-for="post in postStore.posts"
        :key="post?._id"
        :post="post"
        @delete-post="confirmDeleteBox"
      />

      <Button
        label="Load more"
        icon="pi pi-spinner"
        severity="contrast"
        style="display: flex; margin: 0 auto"
        @click="postStore.loadMorePosts"
        v-if="postStore.totalPosts > postStore.posts.length"
      />
    </section>

    <ConfirmDialog></ConfirmDialog>

    <Dialog
      v-model:visible="postStore.visible"
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
            v-model="postStore.content"
            style="width: 100%; border: none"
          />

          <div v-if="postStore.images.length > 0">
            <ImageGallery
              :images="postStore.images"
              @delete-image="onDeleteImage"
            />
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
            @click="postStore.setVisible(false)"
          />
          <Button
            type="submit"
            label="Create post"
            :loading="postStore.isCreating"
          />
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
