<script setup>
import Button from "primevue/button";
import Divider from "primevue/divider";
import { useRouter } from "vue-router";
import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import StepPanels from "primevue/steppanels";
import Step from "primevue/step";
import StepPanel from "primevue/steppanel";
import InputText from "primevue/inputtext";
import { ref } from "vue";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import { useToast } from "primevue/usetoast";
import { useForm } from "vee-validate";
import { resetPasswordApi, sendOtpCodeApi } from "@/apis/userApi";
import { schema } from "@/yup-schemas/ResetPasswordSchema";
import Message from "primevue/message";
import Toast from "primevue/toast";

const toast = useToast();
const router = useRouter();
const email = ref("");
const loading = ref(false);
const sending = ref(false);

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
});

const [newPassword, newPasswordAttrs] = defineField("newPassword");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");
const [otpCode, otpCodeAttrs] = defineField("otpCode");
const [emailUser, emailUserAttrs] = defineField("email");

const onSendOtpCode = async () => {
  if (!email.value.trim()) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Email is required",
      life: 1500,
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Please enter a valid email address",
      life: 1500,
    });
    return;
  }

  sending.value = true;

  try {
    const response = await sendOtpCodeApi({ email: email.value });
    if (response) {
      toast.add({
        severity: "success",
        summary: "OTP sent to your email",
        detail: response.message,
        life: 1500,
      });
    }
  } catch (error) {
    console.log("Error sending otp:", error.message);

    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 1500,
    });
  } finally {
    sending.value = false;
  }
};

const onResetPassword = handleSubmit(async (values) => {
  loading.value = true;

  const body = { ...values };

  try {
    const response = await resetPasswordApi(body);

    if (response) {
      toast.add({
        severity: "success",
        summary: "Password reset successful",
        detail: response.message,
        life: 1500,
      });

      router.push({ path: "/login" });
    }
  } catch (error) {
    console.log("Error reset possword:", error.message);

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
    <h1 class="title">Reset your password</h1>
    <Toast />
    <Divider />

    <Stepper value="1" linear class="basis-[50rem]">
      <StepList>
        <Step value="1">Get OTP</Step>
        <Step value="2">Reset password</Step>
      </StepList>
      <StepPanels>
        <StepPanel
          v-slot="{ activateCallback }"
          value="1"
          style="background-color: transparent"
        >
          <div>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-envelope"></i>
              </InputGroupAddon>
              <InputText
                placeholder="Enter your email"
                size="large"
                v-model="email"
              />
            </InputGroup>

            <Button
              label="Get OTP code"
              type="button"
              style="margin-top: 8px; width: 100%"
              size="large"
              icon="pi pi-envelope"
              :loading="sending"
              :disabled="sending"
              @click="onSendOtpCode"
            />
          </div>
          <div style="margin-top: 15px; display: flex; justify-content: end">
            <Button
              icon="pi pi-arrow-right"
              rounded
              raised
              size="large"
              severity="contrast"
              @click="activateCallback('2')"
            />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="2">
          <div>
            <form @submit="onResetPassword" class="form">
              <!-- Email Field -->
              <div class="form-group">
                <InputGroup>
                  <InputGroupAddon>
                    <i class="pi pi-envelope"></i>
                  </InputGroupAddon>
                  <InputText
                    size="large"
                    placeholder="Enter your email again"
                    v-model="emailUser"
                    v-bind="emailUserAttrs"
                  />
                </InputGroup>
                <Message
                  icon="pi pi-times-circle"
                  v-if="errors.email"
                  severity="error"
                  >{{ errors.email }}</Message
                >
              </div>

              <!-- OTP Code Field -->
              <div class="form-group">
                <InputGroup>
                  <InputGroupAddon>
                    <i class="pi pi-code"></i>
                  </InputGroupAddon>
                  <InputText
                    size="large"
                    placeholder="Enter your OTP code"
                    v-model="otpCode"
                    v-bind="otpCodeAttrs"
                  />
                </InputGroup>
                <Message
                  icon="pi pi-times-circle"
                  v-if="errors.otpCode"
                  severity="error"
                  >{{ errors.otpCode }}</Message
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
                    placeholder="Enter your new password"
                    v-model="newPassword"
                    v-bind="newPasswordAttrs"
                  />
                </InputGroup>
                <Message
                  icon="pi pi-times-circle"
                  v-if="errors.newPassword"
                  severity="error"
                  >{{ errors.newPassword }}</Message
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
                    placeholder="Confirm your new password"
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
                label="Reset password"
                size="large"
                :loading="loading"
                :disabled="loading"
              />
            </form>
          </div>
          <div style="margin-top: 15px; display: flex; justify-content: end">
            <Button
              icon="pi pi-arrow-left"
              rounded
              raised
              size="large"
              severity="contrast"
              @click="activateCallback('1')"
            />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
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
