<template>
  <TaskList
    :tasks="tasks"
    :highlighted-task-id="highlightedTaskId"
    @toggle="$emit('toggle', $event)"
    @delete="$emit('delete', $event)"
  />
</template>

<script setup lang="ts">
import TaskList from "../components/TaskList.vue";

defineProps<{
  tasks: any[];
  highlightedTaskId?: number | null;
}>();

defineEmits(["toggle", "delete"]);
</script>