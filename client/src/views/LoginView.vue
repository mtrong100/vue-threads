<script setup>
import { RouterLink } from "vue-router";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Button from "primevue/button";
import Divider from "primevue/divider";
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

    <div class="form">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-envelope"></i>
        </InputGroupAddon>
        <InputText placeholder="Email" size="large" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-key"></i>
        </InputGroupAddon>
        <InputText placeholder="Password" size="large" />
      </InputGroup>

      <Button label="Login" size="large" icon="pi pi-sign-in" />
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
