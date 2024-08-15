import { createPostApi, deletePostApi, getPostsApi } from "@/apis/postApi";
import { defineStore } from "pinia";

const POST_LIMIT = 5;

export const usePostStore = defineStore("post", {
  state: () => ({
    posts: [],
    images: [],
    content: "",
    loading: false,
    visible: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    toast: null,
    limit: POST_LIMIT,
    totalPosts: 0,
  }),
  actions: {
    setVisible(state) {
      this.visible = state;
    },
    setContent(value) {
      this.content = value;
    },
    async uploadImages(event, toast) {
      const files = event.target.files;

      if (files.length > 4) {
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
            this.images.push(reader.result);
          };
        }
      }
    },
    deleteImage(index) {
      this.images.splice(index, 1);
    },
    async fetchPosts() {
      this.loading = true;
      try {
        const response = await getPostsApi({ limit: this.limit });
        if (response) {
          this.posts = response.results;
          this.totalPosts = response.totalPosts;
        }
      } catch (error) {
        console.log("Error getting posts:", error.message);
      } finally {
        this.loading = false;
      }
    },
    async createPost(toast) {
      this.isCreating = true;

      if (!this.content.trim() && this.images.length === 0) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Content or at least one image is required.",
          life: 3000,
        });

        this.isCreating = false;

        return;
      }

      try {
        const body = {
          content: this.content,
          images: this.images,
        };

        const response = await createPostApi(body);

        if (response) {
          this.posts.unshift(response.results);

          toast.add({
            severity: "success",
            summary: "Post created",
            detail: response.message,
            life: 3000,
          });
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
        this.content = "";
        this.images = [];
        this.isCreating = false;
        this.visible = false;
      }
    },
    async deletePost(postId, toast) {
      this.isDeleting = true;

      try {
        const response = await deletePostApi(postId);

        if (response) {
          const index = this.posts.findIndex((post) => post._id === postId);

          if (index !== -1) {
            this.posts.splice(index, 1);
            toast.add({
              severity: "success",
              summary: "Post deleted",
              detail: response.message,
              life: 3000,
            });
          }
        }
      } catch (error) {
        console.log("Error deleting post:", error.message);
        toast.add({
          severity: "error",
          summary: "Error",
          detail: error.message,
          life: 1500,
        });
      } finally {
        this.isDeleting = false;
      }
    },
    loadMorePosts() {
      this.limit += POST_LIMIT;
      this.fetchPosts();
    },
  },
});
