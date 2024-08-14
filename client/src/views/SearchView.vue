<script setup>
import InputGroup from "primevue/inputgroup";
import Divider from "primevue/divider";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FollowCard from "@/components/FollowCard.vue";
</script>

<template>
  <div class="page-container">
    <section class="card-wrapper">
      <InputGroup>
        <InputText placeholder="Search..." />
        <Button icon="pi pi-search" />
      </InputGroup>
      <Divider />
      <div>
        <FollowCard />
        <FollowCard />
        <FollowCard />
        <FollowCard />
        <FollowCard />
        <FollowCard />
        <FollowCard />
        <FollowCard />
        <FollowCard />
        <FollowCard />
        <FollowCard />
      </div>
    </section>
  </div>
</template>

<style scoped></style>
