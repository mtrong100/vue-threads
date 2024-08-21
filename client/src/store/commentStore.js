import {
  createCommentApi,
  deleteCommentApi,
  getCommentsApi,
} from "@/apis/commentApi";
import { COMMENT_LIMIT } from "@/utils/constants";
import { defineStore } from "pinia";

export const useCommentStore = defineStore("comment", {
  state: () => ({
    comments: [],
    loading: false,
    totalComments: 0,
    hasMoreComments: false,
    text: "",
    isCreating: false,
    isDeleting: false,
  }),
  actions: {
    async fetchComments({ skip = 0, isMergeState = false, postId } = {}) {
      if (!postId) return;

      this.loading = true;

      try {
        const response = await getCommentsApi(postId, {
          limit: COMMENT_LIMIT,
          skip,
        });

        if (response) {
          if (isMergeState) {
            this.comments = [...this.comments, ...response.results];
            this.totalComments = response.totalComments;
            this.hasMoreComments = response.hasMoreComments;
          } else {
            this.comments = response.results;
            this.totalComments = response.totalComments;
            this.hasMoreComments = response.hasMoreComments;
          }
        }
      } catch (error) {
        console.log("Error fetching comments:", error.message);
        this.comments = [];
      } finally {
        this.loading = false;
      }
    },
    fetchMoreComments({ postId }) {
      const skip = this.comments.length;
      this.fetchComments({ postId, skip, isMergeState: true });
    },
    async createComment({ postId, toast }) {
      if (!this.text.trim()) return;

      this.isCreating = true;

      try {
        const body = { text: this.text };

        const response = await createCommentApi(postId, body);

        if (response) {
          toast.add({
            severity: "success",
            detail: response.message,
            life: 1500,
          });
        }
      } catch (error) {
        console.log("Error creating comment:", error.message);
        toast.add({
          severity: "error",
          detail: error.message,
          life: 1500,
        });
      } finally {
        this.isCreating = false;
        this.text = "";
        this.fetchComments({ postId });
      }
    },
    async deleteComment({ commentId, postId, toast }) {
      this.isDeleting = true;
      try {
        const response = await deleteCommentApi(commentId);

        if (response) {
          toast.add({
            severity: "success",
            detail: response.message,
            life: 1500,
          });
        }
      } catch (error) {
        console.log("Error deleting comment:", error.message);
        toast.add({
          severity: "error",
          detail: error.message,
          life: 1500,
        });
      } finally {
        this.isDeleting = false;
        this.fetchComments({ postId });
      }
    },
  },
});
