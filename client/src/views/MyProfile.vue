<script setup>
import PostCard from "@/components/PostCard.vue";
import { useUserStore } from "@/store/userStore";
import Button from "primevue/button";
import Divider from "primevue/divider";
import Dialog from "primevue/dialog";
import { onMounted, ref, watch } from "vue";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import { useToast } from "primevue/usetoast";
import { useForm } from "vee-validate";
import Message from "primevue/message";
import { updateUserProfileApi } from "@/apis/userApi";
import { updateProfileFormSchema } from "@/validations/userValidateSchemas";
import CreatePostDialog from "@/components/CreatePostDialog.vue";
import UpdatePostDialog from "@/components/UpdatePostDialog.vue";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import { usePostStore } from "@/store/postStore";
import ConfirmDialog from "primevue/confirmdialog";

const toast = useToast();
const userStore = useUserStore();
const postStore = usePostStore();
const visible = ref(false);
const loading = ref(false);
const value = ref("0");

const { handleSubmit, errors, defineField, setValues } = useForm({
  validationSchema: updateProfileFormSchema,
});

const [username, usernameAttrs] = defineField("username");
const [email, emailAttrs] = defineField("email");
const [bio, bioAttrs] = defineField("bio");
const [profilePicture, profilePictureAttrs] = defineField("profilePicture");

onMounted(() => {
  setValues({
    username: userStore.currentUser?.username,
    email: userStore.currentUser?.email,
    bio: userStore.currentUser?.bio,
    profilePicture: userStore.currentUser?.profilePicture,
  });
});

onMounted(() => {
  postStore.fetchPosts({ userId: userStore.currentUser?._id, type: "user" });
  userStore.fetchUserCurrentUser(userStore.currentUser?._id);
});

watch(
  () => value.value,
  (newVal) => {
    if (newVal === "1") {
      postStore.fetchPosts({
        userId: userStore.currentUser?._id,
        type: "liked",
      });
    } else {
      postStore.fetchPosts({
        userId: userStore.currentUser?._id,
        type: "user",
      });
    }
  }
);

const onUpdateUserProfile = handleSubmit(async (values) => {
  loading.value = true;

  const body = { ...values };

  try {
    const response = await updateUserProfileApi(body);

    if (response) {
      userStore.saveCurrentUser(response.results);

      toast.add({
        severity: "success",
        summary: "Profile updated",
        detail: response.message,
        life: 1500,
      });
    }
  } catch (error) {
    console.log("Error updating user profile:", error.message);

    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 1500,
    });
  } finally {
    loading.value = false;
    visible.value = false;
  }
});
</script>

<template>
  <div class="page-container">
    <section class="card-wrapper">
      <div class="facb">
        <div class="flexcol" style="gap: 5px">
          <h1 class="username">{{ userStore.currentUser?.username }}</h1>
          <p style="font-size: 14px">{{ userStore.currentUser?.email }}</p>
        </div>
        <img
          class="profile-pic"
          :src="userStore.currentUser?.profilePicture"
          :alt="userStore.currentUser?.username"
        />
      </div>

      <div class="bio">{{ userStore.currentUser?.bio || "Lorem ipsum" }}</div>

      <div class="follow-stats facenter">
        <span>{{ userStore.currentUser?.followersCount || 0 }} followers</span>
        <span>{{ userStore.currentUser?.followingCount || 0 }} following</span>
        <span>{{ userStore.currentUser?.postCount || 0 }} posts</span>
      </div>

      <div class="grid-cols-2" style="margin-top: 20px; gap: 5px">
        <Button
          label="View stats"
          outlined
          severity="help"
          icon="pi pi-chart-bar"
        />
        <Button
          label="Update profile"
          outlined
          @click="visible = true"
          icon="pi pi-pencil"
        />
      </div>

      <Divider />

      <Tabs value="0">
        <TabList>
          <Tab @click="value = '0'" style="flex: 1" value="0">My Posts</Tab>
          <Tab @click="value = '1'" style="flex: 1" value="1">Liked Posts</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <Button
              type="button"
              text
              :loading="postStore.loadingPosts"
              disabled
              label="Loading posts..."
              severity="secondary"
              class="load-more-button"
              v-if="postStore.loadingPosts && !postStore.posts.length"
            />

            <PostCard
              v-for="post in postStore.posts"
              :key="post?._id"
              :post="post"
              :showPostAction="true"
              :type="'user'"
            />

            <Button
              label="Load more"
              icon="pi pi-spinner"
              severity="contrast"
              style="display: flex; margin: 0 auto"
              v-if="!postStore.loadingPosts && postStore.hasMorePosts"
              :disabled="!postStore.hasMorePosts || postStore.loadingPosts"
              :loading="postStore.loadingPosts"
              @click="
                postStore.fetchMorePosts({
                  userId: userStore.currentUser?._id,
                  type: 'user',
                })
              "
            />
          </TabPanel>
          <TabPanel value="1">
            <Button
              type="button"
              text
              disabled
              label="Loading posts..."
              severity="secondary"
              class="load-more-button"
              :loading="postStore.loadingPosts"
              v-if="postStore.loadingPosts && !postStore.posts.length"
            />

            <PostCard
              v-for="post in postStore.posts"
              :key="post?._id"
              :post="post"
              :showPostAction="true"
              :type="'liked'"
            />

            <Button
              label="Load more"
              icon="pi pi-spinner"
              severity="contrast"
              style="display: flex; margin: 0 auto"
              v-if="!postStore.loadingPosts && postStore.hasMorePosts"
              :disabled="!postStore.hasMorePosts || postStore.loadingPosts"
              :loading="postStore.loadingPosts"
              @click="
                postStore.fetchMorePosts({
                  userId: userStore.currentUser?._id,
                  type: 'liked',
                })
              "
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </section>

    <ConfirmDialog></ConfirmDialog>
    <CreatePostDialog />
    <UpdatePostDialog />

    <!-- Update profile dialog -->
    <Dialog
      v-model:visible="visible"
      modal
      header="Update your profile"
      :style="{ width: '35rem' }"
    >
      <form @submit="onUpdateUserProfile">
        <div class="dialog-body">
          <!-- profilePicture Field -->
          <div class="form-group">
            <label for="profilePicture">Image URL</label>
            <InputText
              size="large"
              placeholder="Enter your URL"
              v-model="profilePicture"
              v-bind="profilePictureAttrs"
            />
            <Message
              icon="pi pi-times-circle"
              v-if="errors.profilePicture"
              severity="error"
              >{{ errors.profilePicture }}</Message
            >
          </div>

          <!-- Username Field -->
          <div class="form-group">
            <label for="username">Username</label>
            <InputText
              size="large"
              placeholder="Enter your username"
              v-model="username"
              v-bind="usernameAttrs"
            />
            <Message
              icon="pi pi-times-circle"
              v-if="errors.username"
              severity="error"
              >{{ errors.username }}</Message
            >
          </div>

          <!-- Email Field -->
          <div class="form-group">
            <label for="email">Email</label>
            <InputText
              size="large"
              placeholder="Enter your email"
              v-model="email"
              v-bind="emailAttrs"
            />
            <Message
              icon="pi pi-times-circle"
              v-if="errors.email"
              severity="error"
              >{{ errors.email }}</Message
            >
          </div>

          <!-- Bio Field -->
          <div class="form-group">
            <label for="bio">Bio</label>
            <Textarea
              v-model="bio"
              v-bind="bioAttrs"
              size="large"
              placeholder="Enter your bio"
              rows="5"
              cols="30"
            />
            <Message
              icon="pi pi-times-circle"
              v-if="errors.bio"
              severity="error"
              >{{ errors.bio }}</Message
            >
          </div>
        </div>

        <div class="bottom-dialog">
          <Button
            label="Cancel"
            outlined
            severity="danger"
            @click="visible = false"
            icon="pi pi-times"
          />
          <Button
            type="submit"
            label="Save"
            :loading="loading"
            icon="pi pi-save"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bottom-dialog {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.form-group label {
  font-weight: 600;
}
.form-group {
  margin-bottom: 15px;
  gap: 8px;
}
.follow-stats {
  gap: 15px;
}

.bio,
.follow-stats {
  margin-top: 15px;
  font-size: 15px;
}
.username {
  font-size: 25px;
  font-weight: bold;
}
.profile-pic {
  border-radius: 100rem;
  width: 85px;
  height: 85px;
  object-fit: cover;
}
</style>
