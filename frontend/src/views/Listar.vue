<template>
  <TaskList
    :tasks="tasks"
    :highlightedTaskId="highlightedTaskId"
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