import {
  createPostApi,
  deletePostApi,
  getLikedPostsByUserApi,
  getPostDetailsApi,
  getPostsApi,
  getPostsByUserApi,
  toggleLikePostApi,
  updatePostApi,
} from "@/apis/postApi";
import { defineStore } from "pinia";

const POST_LIMIT = 5;

export const usePostStore = defineStore("post", {
  state: () => ({
    posts: [],
    userPosts: [],
    images: [],
    likedPosts: [],
    content: "",
    loading: false,
    visible: false,
    visible2: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    toast: null,
    limit: POST_LIMIT,
    userPostLimit: POST_LIMIT,
    totalPosts: 0,
    totalUserPosts: 0,
    postDetails: null,
    loadingUserPosts: false,
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
          const index = this.userPosts.findIndex((post) => post._id === postId);

          if (index !== -1) {
            this.userPosts.splice(index, 1);
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
    setVisible2(state) {
      this.visible2 = state;
    },
    async updatePost(postId, toast) {
      this.isUpdating = true;

      try {
        const body = {
          content: this.content,
          images: this.images,
        };

        const response = await updatePostApi(postId, body);

        if (response) {
          const index = this.userPosts.findIndex((post) => post._id === postId);
          if (index !== -1) {
            this.userPosts[index] = response.results;
            toast.add({
              severity: "success",
              summary: "Post updated",
              detail: response.message,
              life: 1500,
            });
          }
        }
      } catch (error) {
        console.log("Error updating post:", error.message);
        toast.add({
          severity: "error",
          summary: "Error",
          detail: error.message,
          life: 1500,
        });
      } finally {
        this.isUpdating = false;
        this.updatePostData = null;
        this.setVisible2(false);
      }
    },
    async fetchPostDetails(postId) {
      try {
        const response = await getPostDetailsApi(postId);
        if (response) {
          this.postDetails = response.results;
        }
      } catch (error) {
        console.log("Error getting post details:", error.message);
      }
    },
    async fetchPostsByUser(userId) {
      this.loadingUserPosts = true;
      try {
        const response = await getPostsByUserApi(userId, {
          limit: this.userPostLimit,
        });
        if (response) {
          this.userPosts = response.results;
          this.totalUserPosts = response.totalUserPosts;
        }
      } catch (error) {
        console.log("Error getting posts by user:", error.message);
      } finally {
        this.loadingUserPosts = false;
      }
    },
    loadMoreUserPosts(userId) {
      this.userPostLimit += POST_LIMIT;
      this.fetchPostsByUser(userId);
    },
    async toggleLikePost(postId, toast) {
      try {
        const response = await toggleLikePostApi(postId);
        if (response) {
          toast.add({
            severity: "success",
            detail: response.message,
            life: 1500,
          });
        }
      } catch (error) {
        console.log("Error toggling like post:", error.message);
        toast.add({
          severity: "error",
          detail: error.message,
          life: 1500,
        });
      } finally {
        this.fetchPosts();
      }
    },
    async fetchLikedPosts() {
      try {
        const response = await getLikedPostsByUserApi();
        if (response) {
          this.likedPosts = response.results;
        }
      } catch (error) {
        console.log("Error getting liked posts:", error.message);
      }
    },
  },
});
