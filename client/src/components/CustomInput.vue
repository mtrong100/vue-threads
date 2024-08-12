<script setup>
const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue", "blur"]);
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    @blur="$emit('blur')"
  />
</template>
