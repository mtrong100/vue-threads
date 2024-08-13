<script setup>
import { RouterLink, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Button from "primevue/button";
import Divider from "primevue/divider";
import { ref } from "vue";
import { useForm } from "vee-validate";
import { loginUserApi } from "@/apis/userApi";
import { schema } from "@/yup-schemas/LoginFormSchema";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "@/store/userStore";
import Message from "primevue/message";

const toast = useToast();
const router = useRouter();
const loading = ref(false);
const userStore = useUserStore();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

const onLoginUser = handleSubmit(async (values) => {
  loading.value = true;

  const body = { ...values };

  try {
    const response = await loginUserApi(body);

    if (response) {
      userStore.saveCurrentUser(response.results);

      toast.add({
        severity: "success",
        summary: "Login successful",
        detail: response.message,
        life: 1500,
      });

      router.push({ path: "/" });
    }
  } catch (error) {
    console.log("Error login user:", error.message);

    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 1500,
    });
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="form-container">
    <h1 class="title">Login to your account</h1>

    <Divider />

    <Button
      label="Login with Google"
      raised
      size="large"
      severity="secondary"
      icon="pi pi-google"
      style="width: 100%"
    />

    <Divider />

    <form @submit="onLoginUser" class="form">
      <!-- Email Field -->
      <div class="form-group">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-envelope"></i>
          </InputGroupAddon>
          <InputText
            size="large"
            placeholder="Email"
            v-model="email"
            v-bind="emailAttrs"
          />
        </InputGroup>
        <Message
          icon="pi pi-times-circle"
          v-if="errors.email"
          severity="error"
          >{{ errors.email }}</Message
        >
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-key"></i>
          </InputGroupAddon>
          <InputText
            type="password"
            size="large"
            placeholder="Password"
            v-model="password"
            v-bind="passwordAttrs"
          />
        </InputGroup>
        <Message
          icon="pi pi-times-circle"
          v-if="errors.password"
          severity="error"
          >{{ errors.password }}</Message
        >
      </div>

      <Button type="submit" label="Login" size="large" :loading="loading" />
    </form>

    <div class="facb" style="margin-top: 15px">
      <p>Forgot your password?</p>

      <RouterLink style="color: #14b8a6" to="/reset-password"
        >Forgot password</RouterLink
      >
    </div>
  </div>

  <div class="right-bg">
    <div class="content">
      <h1 class="heading">Not have an account?</h1>
      <p class="paragraph">Register and discover a lot more!</p>
      <RouterLink to="/register">
        <Button
          label="Register now"
          icon="pi pi-sign-in"
          size="large"
          severity="secondary"
        />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title {
  text-align: center;
  font-size: 40px;
  font-weight: bold;
}

.right-bg {
  background: linear-gradient(to right, #14b8a6, #10b981);
  width: 100%;
  color: white;
  display: grid;
  place-items: center;
  height: 100vh;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.heading {
  font-size: 3rem;
  font-weight: bold;
}

.paragraph {
  font-weight: 500;
  font-size: 1.25rem;
  margin: 2rem 0;
}
</style>
