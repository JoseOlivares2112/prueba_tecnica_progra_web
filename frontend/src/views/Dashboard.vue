<template>
  <TaskForm @submit="emitSubmit" :loading="loading" />

  <TaskList
    :tasks="tasks"
    :highlightedTaskId="highlightedTaskId"
    @toggle="$emit('toggle', $event)"
    @delete="$emit('delete', $event)"
  />
</template>

<script setup lang="ts">
import TaskForm from "../components/TaskForm.vue";
import TaskList from "../components/TaskList.vue";

defineProps<{
  tasks: any[];
  loading: boolean;
  highlightedTaskId?: number | null;
}>();

const emit = defineEmits(["submit", "toggle", "delete"]);

const emitSubmit = (payload: any) => {
  emit("submit", payload);
};
</script>