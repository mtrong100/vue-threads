<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="layout">
    <RouterView />
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 650px;
  height: 100vh;
  width: 100%;
  place-items: center;
}
</style>
