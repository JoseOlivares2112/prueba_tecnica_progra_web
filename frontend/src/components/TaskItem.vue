<template>
  <v-list-item
    :id="`task-${task.id}`"
    class="mb-3 border rounded-lg"
    :class="{ 'task-highlight': highlighted }"
  >
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

    <v-list-item-subtitle class="created-at">
      Creada: {{ formatCreatedAt(task.createdAt) }}
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
  highlighted?: boolean;
}>();

defineEmits<{
  (e: "toggle", id: number): void;
  (e: "delete", id: number): void;
}>();

const formatCreatedAt = (value?: string) => {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return date.toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.created-at {
  margin-top: 0.2rem;
}

.task-highlight {
  border-color: #3b82f6 !important;
  background: #eff6ff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
  transition: background 0.25s ease, box-shadow 0.25s ease;
}
</style>