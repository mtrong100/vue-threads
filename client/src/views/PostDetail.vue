<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/store/userStore";
import Button from "primevue/button";
import Divider from "primevue/divider";
import { usePostStore } from "@/store/postStore";
import { useRoute, RouterLink } from "vue-router";
import { useToast } from "primevue/usetoast";
import { formatDate } from "@/utils/helper";
import PostImageLayout from "@/components/PostImageLayout.vue";
import Textarea from "primevue/textarea";
import { useCommentStore } from "@/store/commentStore";
import Comment from "@/components/Comment.vue";

const userStore = useUserStore();
const postStore = usePostStore();
const commentStore = useCommentStore();

const route = useRoute();
const postId = route.params.id;
const toast = useToast();

const onToggleLikePost = () => {
  postStore.toggleLikePost({
    postId,
    type: "details",
    toast,
  });
};

const onCopyLink = (postId) => {
  postStore.copyPostLink(postId, toast);
};

const onPostComment = () => {
  commentStore.createComment({
    postId,
    toast,
  });
};

const onLoadMoreComments = () => {
  commentStore.fetchMoreComments({ postId });
};

onMounted(() => {
  postStore.fetchPostDetails(postId);
  commentStore.fetchComments({ postId });
});
</script>

<template>
  <div class="page-container">
    <section class="card-wrapper">
      <article>
        <RouterLink :to="`/profile/${postStore.postDetails?.userId}`">
          <img
            class="profile-pic"
            :src="postStore.postDetails?.profilePicture"
            :alt="postStore.postDetails?.username"
          />
        </RouterLink>

        <div style="flex: 1">
          <div class="facenter" style="gap: 10px">
            <RouterLink
              :to="`/profile/${postStore.postDetails?.userId}`"
              class="username"
              >{{ postStore.postDetails?.username }}</RouterLink
            >
            <p class="date">
              {{ formatDate(postStore.postDetails?.createdAt) }}
            </p>
          </div>

          <p
            v-if="postStore.postDetails?.content"
            class="paragraph"
            style="margin-top: 5px"
          >
            {{ postStore.postDetails?.content }}
          </p>

          <div v-if="postStore.postDetails?.images" style="margin-top: 10px">
            <PostImageLayout :images="postStore.postDetails?.images" />
          </div>

          <div class="post-action">
            <div class="facenter" style="gap: 8px">
              <Button
                icon="pi pi-heart-fill"
                severity="danger"
                raised
                rounded
                v-if="
                  postStore.postDetails?.likes?.includes(
                    userStore.currentUser?._id
                  )
                "
                @click="onToggleLikePost"
              />
              <Button
                icon="pi pi-heart"
                severity="danger"
                text
                raised
                rounded
                v-else
                @click="onToggleLikePost"
              />

              <RouterLink :to="`/post/${postStore.postDetails?._id}`">
                <Button
                  icon="pi pi-comment"
                  severity="info"
                  text
                  raised
                  rounded
                />
              </RouterLink>

              <Button
                @click="onCopyLink(postStore.postDetails?._id)"
                icon="pi pi-share-alt"
                text
                raised
                rounded
              />
            </div>
          </div>
        </div>
      </article>

      <Divider />

      <!-- Comment section -->
      <div style="margin-top: 10px">
        <div>
          <Textarea
            v-model="commentStore.text"
            autoResize
            rows="5"
            cols="30"
            placeholder="Write a comment..."
            style="width: 100%"
          />
          <Button
            label="Post comment"
            style="display: flex; margin-left: auto; margin-top: 10px"
            :disabled="commentStore.isCreating"
            :loading="commentStore.isCreating"
            @click="onPostComment"
          />
        </div>

        <div style="margin-top: 10px">
          <h3>Comments ({{ commentStore?.totalComments || 0 }})</h3>
          <div style="margin-top: 8px">
            <Button
              type="button"
              text
              disabled
              label="No comments"
              severity="secondary"
              class="load-more-button"
              v-if="!commentStore.loading && commentStore.comments.length === 0"
            />

            <Button
              type="button"
              text
              :loading="commentStore.loading"
              disabled
              label="Loading comments..."
              severity="secondary"
              class="load-more-button"
              v-if="commentStore.loading && !commentStore.comments.length"
            />

            <Comment
              v-for="comment in commentStore.comments"
              :key="comment?._id"
              :comment="comment"
            />

            <Button
              label="Load more"
              icon="pi pi-spinner"
              severity="contrast"
              style="display: flex; margin: 0 auto"
              v-if="!commentStore.loading && commentStore.hasMoreComments"
              :disabled="!commentStore.hasMoreComments || commentStore.loading"
              :loading="commentStore.loading"
              @click="onLoadMoreComments"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
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
