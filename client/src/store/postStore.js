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
import { POST_LIMIT } from "@/utils/constants";
import { defineStore } from "pinia";

export const usePostStore = defineStore("post", {
  state: () => ({
    posts: [],
    images: [],
    content: "",
    totalPosts: 0,
    postDetails: null,
    visible: false,
    visible2: false,
    loadingPosts: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    hasMorePosts: false,
    loadingPostsDetails: false,
    isLikingPost: false,
  }),
  actions: {
    setVisible(state) {
      this.visible = state;
    },
    setVisible2(state) {
      this.visible2 = state;
    },
    uploadImages(event, toast) {
      const files = event.target.files;

      if (files.length > 4) {
        toast.add({
          severity: "error",
          detail: "You can only upload a maximum of 4 images.",
          life: 1500,
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
    async fetchPosts({ skip = 0, isMergeState = false, userId, type } = {}) {
      this.loadingPosts = true;
      try {
        let response;

        if (type === "user") {
          response = await getPostsByUserApi(userId, {
            limit: POST_LIMIT,
            skip,
          });
        } else if (type === "liked") {
          response = await getLikedPostsByUserApi({
            limit: POST_LIMIT,
            skip,
          });
        } else {
          response = await getPostsApi({ limit: POST_LIMIT, skip });
        }

        if (response) {
          if (isMergeState) {
            this.posts = [...this.posts, ...response.results];
            this.totalPosts = response.totalPosts;
            this.hasMorePosts = response.hasMorePosts;
          } else {
            this.posts = response.results;
            this.totalPosts = response.totalPosts;
            this.hasMorePosts = response.hasMorePosts;
          }
        }
      } catch (error) {
        console.log("Error fetching posts:", error.message);
        this.posts = [];
      } finally {
        this.loadingPosts = false;
      }
    },
    async createPost(toast) {
      if (!this.content.trim() && this.images.length === 0) {
        toast.add({
          severity: "error",
          detail: "Content or at least one image is required.",
          life: 1500,
        });
        return;
      }

      this.isCreating = true;

      try {
        const body = {
          content: this.content,
          images: this.images,
        };

        const response = await createPostApi(body);

        if (response) {
          toast.add({
            severity: "success",
            detail: response.message,
            life: 1500,
          });
        }
      } catch (error) {
        console.log("Error creating post:", error.message);
        toast.add({
          severity: "error",
          detail: error.message,
          life: 1500,
        });
      } finally {
        this.content = "";
        this.images = [];
        this.isCreating = false;
        this.visible = false;
        this.fetchPosts();
      }
    },
    async updatePost({ postId, userId, toast, type }) {
      if (!postId) return;

      if (!this.content.trim() && this.images.length === 0) {
        toast.add({
          severity: "error",
          detail: "Content or at least one image is required.",
          life: 1500,
        });
        return;
      }

      this.isUpdating = true;

      try {
        const body = {
          content: this.content,
          images: this.images,
        };

        const response = await updatePostApi(postId, body);

        if (response) {
          toast.add({
            severity: "success",
            detail: response.message,
            life: 1500,
          });
        }
      } catch (error) {
        console.log("Error updating post:", error.message);
        toast.add({
          severity: "error",
          detail: error.message,
          life: 1500,
        });
      } finally {
        this.isUpdating = false;
        this.setVisible2(false);

        if (type === "user" && userId) {
          this.fetchPosts({ userId, type: "user" });
        } else if (type === "liked" && userId) {
          this.fetchPosts({ userId, type: "liked" });
        } else {
          this.fetchPosts();
        }
      }
    },
    async deletePost({ postId, userId, toast, type }) {
      this.isDeleting = true;

      try {
        const response = await deletePostApi(postId);

        if (response) {
          toast.add({
            severity: "success",
            detail: response.message,
            life: 1500,
          });
        }
      } catch (error) {
        console.log("Error deleting post:", error.message);
        toast.add({
          severity: "error",
          detail: error.message,
          life: 1500,
        });
      } finally {
        this.isDeleting = false;

        if (type === "user" && userId) {
          this.fetchPosts({ userId, type: "user" });
        } else if (type === "liked" && userId) {
          this.fetchPosts({ userId, type: "liked" });
        } else {
          this.fetchPosts();
        }
      }
    },
    fetchMorePosts({ userId, type }) {
      const skip = this.posts.length;

      if (type === "user" && userId) {
        this.fetchPosts({ userId, type: "user", skip, isMergeState: true });
      } else if (type === "liked" && userId) {
        this.fetchPosts({ userId, type: "liked", skip, isMergeState: true });
      } else {
        this.fetchPosts({ skip, isMergeState: true });
      }
    },
    async fetchPostDetails(postId) {
      if (!postId) return;

      this.loadingPostDetails = true;

      try {
        const response = await getPostDetailsApi(postId);
        if (response) {
          this.postDetails = response.results;
        }
      } catch (error) {
        console.log("Error getting post details:", error.message);
      } finally {
        this.loadingPostDetails = false;
      }
    },
    async toggleLikePost({ postId, userId, type, toast }) {
      if (!postId) return;

      this.isLikingPost = true;

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
        this.isLikingPost = false;

        if (type === "user" && userId) {
          this.fetchPosts({ userId, type: "user" });
        } else if (type === "liked" && userId) {
          this.fetchPosts({ userId, type: "liked" });
        } else {
          this.fetchPosts();
        }
      }
    },
  },
});
