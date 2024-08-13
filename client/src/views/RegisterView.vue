<script setup>
import { RouterLink, useRouter } from "vue-router";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Button from "primevue/button";
import Divider from "primevue/divider";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useForm } from "vee-validate";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import { schema } from "@/yup-schemas/RegisterFormSchema";
import { registerUserApi } from "@/apis/userApi";
import { ref } from "vue";

const toast = useToast();
const router = useRouter();
const loading = ref(false);

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
});

const [username, usernameAttrs] = defineField("username");
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");

const onRegisterUser = handleSubmit(async (values) => {
  loading.value = true;

  const body = { ...values };

  try {
    const response = await registerUserApi(body);

    if (response) {
      toast.add({
        severity: "success",
        summary: "Account created",
        detail: response.message,
        life: 1500,
      });

      setTimeout(() => {
        router.push({ path: "/login" });
      }, 1000);
    }
  } catch (error) {
    console.log("Error registering user:", error.message);

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
    <h1 class="title">Register your new account</h1>
    <Divider />
    <Toast />

    <Button
      label="Login with Google"
      raised
      size="large"
      severity="secondary"
      icon="pi pi-google"
      style="width: 100%"
    />

    <Divider />

    <form @submit="onRegisterUser" class="form">
      <!-- Username Field -->
      <div class="form-group">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user"></i>
          </InputGroupAddon>
          <InputText
            size="large"
            placeholder="Username"
            v-model="username"
            v-bind="usernameAttrs"
          />
        </InputGroup>
        <Message
          icon="pi pi-times-circle"
          v-if="errors.username"
          severity="error"
          >{{ errors.username }}</Message
        >
      </div>

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

      <!-- Confirm Password Field -->
      <div class="form-group">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-key"></i>
          </InputGroupAddon>
          <InputText
            type="password"
            size="large"
            placeholder="Confirm Password"
            v-model="confirmPassword"
            v-bind="confirmPasswordAttrs"
          />
        </InputGroup>
        <Message
          icon="pi pi-times-circle"
          v-if="errors.confirmPassword"
          severity="error"
          >{{ errors.confirmPassword }}</Message
        >
      </div>

      <Button
        type="submit"
        label="Register an account"
        size="large"
        :loading="loading"
      />
    </form>
  </div>

  <div class="right-bg">
    <div class="content">
      <h1 class="heading">Already have an account?</h1>
      <p class="paragraph">Login and discover a lot more!</p>
      <RouterLink to="/login">
        <Button
          label="Login now"
          icon="pi pi-sign-in"
          size="large"
          severity="secondary"
        />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

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
