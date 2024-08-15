<script setup>
import { computed } from "vue";
import Button from "primevue/button";

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["delete-image"]);

const gridClass = computed(() => {
  const length = props.images.length;
  if (length === 1 || length === 3) return "grid-cols-1";
  if (length === 2 || length === 4) return "grid-cols-2";
  return "";
});
</script>

<template>
  <div :class="`image-box ${gridClass}`">
    <div
      v-for="(image, index) in props.images"
      :key="index"
      class="image-container"
    >
      <img :src="image" alt="Image" preview />
      <div class="delete-button">
        <Button
          icon="pi pi-trash"
          severity="danger"
          rounded
          @click="emit('delete-image', index)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
}
.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
}
img {
  width: 100%;
  height: 250px;
  border-radius: 8px;
  object-fit: cover;
}
.image-box {
  display: grid;
  gap: 5px;
}
.grid-cols-1 {
  grid-template-columns: 1fr;
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>
