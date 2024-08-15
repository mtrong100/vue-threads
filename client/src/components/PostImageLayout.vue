<script setup>
import Image from "primevue/image";
import { computed } from "vue";

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
});

const gridClass = computed(() => {
  const length = props.images.length;
  if (length === 1) return "grid-cols-1";
  if (length === 3) return "grid-cols-3";
  if (length === 2 || length === 4) return "grid-cols-2";
  return "";
});
</script>

<template>
  <div :class="`image-box ${gridClass}`">
    <Image
      v-for="image in images"
      :src="image"
      alt="Image"
      preview
      imageStyle="width: 100%; height: 100%; border-radius: 8px; object-fit: contain"
    />
  </div>
</template>

<style scoped>
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
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>
