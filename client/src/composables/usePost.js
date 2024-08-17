import {
  createPostApi,
  deletePostApi,
  getLikedPostsByUserApi,
  getPostDetailsApi,
  getPostsApi,
  toggleLikePostApi,
  updatePostApi,
} from "@/apis/postApi";
import { usePostStore } from "@/store/postStore";
import { POST_LIMIT } from "@/utils/constants";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";

export default function usePost() {
  const postStore = usePostStore();
  const toast = useToast();
  const posts = ref([]);
  const likedPosts = ref([]);
  const images = ref([]);
  const content = ref("");
  const hasMorePosts = ref(true);
  const totalPosts = ref(0);
  const postDetails = ref(null);
  const showUpdatePostDialog = ref(false);
  const isCreating = ref(false);
  const isDeleting = ref(false);
  const isUpdating = ref(false);
  const loadingPosts = ref(false);
  const loadingImages = ref(false);
  const loadingPostDetails = ref(false);
  const isLikingPost = ref(false);
  const loadingLikedPosts = ref(false);

  const fetchPosts = async (skip = 0) => {
    loadingPosts.value = true;

    try {
      const response = await getPostsApi({ limit: POST_LIMIT, skip });

      if (response) {
        posts.value = [...posts.value, ...response.results];
        totalPosts.value = response.totalPosts;
        hasMorePosts.value = response.hasMorePosts;
      }
    } catch (error) {
      console.log("Error getting posts:", error.message);
      toast.add({
        severity: "error",
        detail: error.message,
        life: 1500,
      });
    } finally {
      loadingPosts.value = false;
    }
  };

  const loadMorePosts = () => {
    const skip = posts.value.length;
    fetchPosts(skip);
  };

  const onUploadImages = async (event) => {
    const files = event.target.files;

    if (files.length > 4) {
      toast.add({
        severity: "error",
        detail: "You can only upload a maximum of 4 images.",
        life: 1500,
      });
      return;
    }

    loadingImages.value = true;

    try {
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
    } catch (error) {
      console.log("Error uploading images:", error.message);
      toast.add({
        severity: "error",
        detail: error.message,
        life: 1500,
      });
    } finally {
      loadingImages.value = false;
    }
  };

  const onDeleteImage = (index) => {
    images.value.splice(index, 1);
  };

  const onCreatePost = async () => {
    if (!content.value.trim() && images.value.length === 0) {
      toast.add({
        severity: "error",
        detail: "Content or at least one image is required.",
        life: 1500,
      });
      return;
    }

    isCreating.value = true;

    try {
      const body = {
        content: content.value,
        images: images.value,
      };

      console.log(body);

      const response = await createPostApi(body);

      if (response) {
        toast.add({
          severity: "success",
          detail: response.message,
          life: 3000,
        });

        posts.value.unshift(response.results);
      }
    } catch (error) {
      console.log("Error creating post:", error.message);
      toast.add({
        severity: "error",
        detail: error.message,
        life: 1500,
      });
    } finally {
      content.value = "";
      images.value = [];
      postStore.setVisible(false);
      isCreating.value = false;
    }
  };

  const onDeletePost = async (postId) => {
    if (!postId) return;

    isDeleting.value = true;

    try {
      const response = await deletePostApi(postId);

      if (response) {
        const index = posts.value.findIndex((post) => post._id === postId);

        if (index !== -1) {
          posts.value.splice(index, 1);
          toast.add({
            severity: "success",
            detail: response.message,
            life: 1500,
          });
        }
      }
    } catch (error) {
      console.log("Error deleting post:", error.message);
      toast.add({
        severity: "error",
        detail: error.message,
        life: 1500,
      });
    } finally {
      isDeleting.value = false;
      await fetchPosts();
    }
  };

  const onUpdatePost = async (postId) => {
    if (!postId) return;

    isUpdating.value = true;

    try {
      const body = {
        content: content.value,
        images: images.value,
      };

      const response = await updatePostApi(postId, body);

      if (response) {
        const index = posts.value.findIndex((post) => post._id === postId);
        if (index !== -1) {
          posts.value[index] = response.results;
          toast.add({
            severity: "success",
            detail: response.message,
            life: 1500,
          });
        }
      }
    } catch (error) {
      console.log("Error updating post:", error.message);
      toast.add({
        severity: "error",
        detail: error.message,
        life: 1500,
      });
    } finally {
      isUpdating.value = false;
      postStore.setVisible2(false);
    }
  };

  const fetchPostDetails = async (postId) => {
    if (!postId) return;

    loadingPostDetails.value = true;

    try {
      const response = await getPostDetailsApi(postId);

      if (response) {
        postDetails.value = response.results;
      }
    } catch (error) {
      console.log("Error fetching post details:", error.message);
      toast.add({
        severity: "error",
        detail: error.message,
        life: 1500,
      });
    } finally {
      loadingPostDetails.value = false;
    }
  };

  const onToggleLikePost = async (postId) => {
    if (!postId) return;
    isLikingPost.value = true;

    try {
      const response = await toggleLikePostApi(postId);

      if (response) {
        const index = posts.value.findIndex((post) => post._id === postId);

        if (index !== -1) {
          posts.value[index] = response.results;
        }
      }
    } catch (error) {
      console.log("Error toggling like post:", error.message);
      toast.add({
        severity: "error",
        detail: error.message,
        life: 1500,
      });
    } finally {
      isLikingPost.value = false;
    }
  };

  const fetchLikedPosts = async () => {
    loadingLikedPosts.value = true;

    try {
      const response = await getLikedPostsByUserApi();

      if (response) {
        likedPosts.value = response.results;
      }
    } catch (error) {
      console.log("Error fetching liked posts:", error.message);
      toast.add({
        severity: "error",
        detail: error.message,
        life: 1500,
      });
    } finally {
      loadingLikedPosts.value = false;
    }
  };

  const setContent = (newContent) => {
    content.value = newContent;
  };

  return {
    posts,
    loadingPosts,
    fetchPosts,
    totalPosts,
    loadMorePosts,
    hasMorePosts,
    onCreatePost,
    onDeleteImage,
    onUploadImages,
    onDeletePost,
    isDeleting,
    loadingImages,
    onUpdatePost,
    isUpdating,
    showUpdatePostDialog,
    fetchPostDetails,
    loadingPostDetails,
    onToggleLikePost,
    isLikingPost,
    fetchLikedPosts,
    loadingLikedPosts,
    likedPosts,
    isCreating,
    images,
    setContent,
    content,
  };
}
