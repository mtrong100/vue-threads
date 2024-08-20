<script setup>
import Button from "primevue/button";
import Divider from "primevue/divider";
import PostImageLayout from "./PostImageLayout.vue";
import { formatDate } from "@/utils/helper";
import { useUserStore } from "@/store/userStore";
import { useConfirm } from "primevue/useconfirm";
import { usePostStore } from "@/store/postStore";
import { useToast } from "primevue/usetoast";
import { RouterLink } from "vue-router";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  post: {
    type: Object,
    required: true,
  },
  showPostAction: {
    type: Boolean,
    default: true,
  },
});

const confirm = useConfirm();
const toast = useToast();
const userStore = useUserStore();
const postStore = usePostStore();

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
      postStore.deletePost({
        postId,
        userId: userStore.currentUser?._id,
        type: props.type,
        toast,
      });
    },
    reject: () => {},
  });
};

const onClickUpdateBtn = (postId) => {
  postStore.setVisible2(true);
  postStore.fetchPostDetails(postId);
};

const onToggleLikePost = (postId) => {
  postStore.toggleLikePost({
    postId,
    userId: userStore.currentUser?._id,
    type: props.type,
    toast,
  });
};

const onCopyLink = (postId) => {
  postStore.copyPostLink(postId, toast);
};
</script>

<template>
  <article>
    <RouterLink :to="`/profile/${post?.userId}`">
      <img
        class="profile-pic"
        :src="post?.profilePicture"
        :alt="post?.username"
      />
    </RouterLink>

    <div style="flex: 1">
      <div class="facenter" style="gap: 10px">
        <RouterLink :to="`/profile/${post?.userId}`" class="username">{{
          post?.username
        }}</RouterLink>
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
          <Button
            icon="pi pi-heart-fill"
            severity="danger"
            raised
            rounded
            v-if="post?.likes?.includes(userStore.currentUser?._id)"
            @click="onToggleLikePost(post?._id)"
          />
          <Button
            icon="pi pi-heart"
            severity="danger"
            text
            raised
            rounded
            v-else
            @click="onToggleLikePost(post?._id)"
          />

          <RouterLink :to="`/post/${post?._id}`">
            <Button icon="pi pi-comment" severity="info" text raised rounded />
          </RouterLink>

          <Button
            @click="onCopyLink(post?._id)"
            icon="pi pi-share-alt"
            text
            raised
            rounded
          />
        </div>

        <section v-if="showPostAction">
          <div
            v-if="userStore.currentUser?._id === post?.userId"
            class="facenter"
            style="gap: 8px"
          >
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              raised
              severity="info"
              @click="onClickUpdateBtn(post?._id)"
            />
            <Button
              icon="pi pi-trash"
              rounded
              severity="danger"
              raised
              outlined
              @click="confirmDeleteBox(post?._id)"
            />
          </div>
        </section>
      </div>
    </div>
  </article>
  <Divider />
</template>

<style scoped>
.username {
  font-weight: bold;
  color: #333;
  text-decoration: none;
}
.username:hover {
  color: #42b883;
}

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
