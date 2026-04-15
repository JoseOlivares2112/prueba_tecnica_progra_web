<template>
  <v-list-item class="mb-3 border rounded-lg">
    <template #prepend>
      <v-checkbox-btn
        :model-value="task.completed"
        @click="$emit('toggle', task.id)"
      />
    </template>

    <v-list-item-title
      :class="
        task.completed
          ? 'text-decoration-line-through text-medium-emphasis'
          : 'font-weight-medium'
      "
    >
      {{ task.title }}
    </v-list-item-title>

    <v-list-item-subtitle v-if="task.description">
      {{ task.description }}
    </v-list-item-subtitle>

    <template #append>
      <v-chip
        class="mr-3"
        :color="task.completed ? 'success' : 'warning'"
        size="small"
        variant="tonal"
      >
        {{ task.completed ? "Completada" : "Pendiente" }}
      </v-chip>

      <v-btn
        icon="mdi-delete"
        color="error"
        variant="text"
        @click="$emit('delete', task.id)"
      />
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt?: string;
};

defineProps<{
  task: Task;
}>();

defineEmits<{
  (e: "toggle", id: number): void;
  (e: "delete", id: number): void;
}>();
</script>