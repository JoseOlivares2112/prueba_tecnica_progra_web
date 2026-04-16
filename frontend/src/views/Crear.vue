<template>
  <TaskForm @submit="emitSubmit" :loading="loading" />
</template>

<script setup lang="ts">
import TaskForm from "../components/TaskForm.vue";

defineProps<{ loading: boolean }>();

const emit = defineEmits<{
  (e: "submit", payload: { title: string; description: string | null }): void;
}>();

const emitSubmit = (payload: any) => {
  emit("submit", payload);
};
</script>