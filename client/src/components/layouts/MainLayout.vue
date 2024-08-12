<script setup>
import { RouterView } from "vue-router";
import Header from "../shared/Header.vue";
</script>

<template>
  <Header />
  <div class="layout">
    <RouterView />
  </div>
</template>

<style scoped>
.layout {
  width: 100%;
  max-width: 1000px;
  padding: 0 20px;
  margin-left: auto;
  margin-right: auto;
}
</style>
