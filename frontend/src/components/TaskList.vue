<template>
  <div v-if="tasks.length === 0" class="text-medium-emphasis">
    No hay tareas todavía.
  </div>

  <v-list v-else class="pa-0">
    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      :highlighted="task.id === highlightedTaskId"
      @toggle="$emit('toggle', $event)"
      @delete="$emit('delete', $event)"
    />
  </v-list>
</template>

<script setup lang="ts">
import TaskItem from "./TaskItem.vue";

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt?: string;
};

defineProps<{
  tasks: Task[];
  highlightedTaskId?: number | null;
}>();

defineEmits<{
  (e: "toggle", id: number): void;
  (e: "delete", id: number): void;
}>();
</script>