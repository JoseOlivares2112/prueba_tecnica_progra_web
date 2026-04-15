<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field
      v-model="localTitle"
      label="Título de la tarea"
      variant="outlined"
      prepend-inner-icon="mdi-format-title"
      class="mb-3"
      :disabled="loading"
    />

    <v-textarea
      v-model="localDescription"
      label="Descripción"
      variant="outlined"
      prepend-inner-icon="mdi-text"
      rows="3"
      auto-grow
      class="mb-3"
      :disabled="loading"
    />

    <v-btn
      color="primary"
      type="submit"
      :loading="loading"
      :disabled="loading || !localTitle.trim()"
      prepend-icon="mdi-plus"
    >
      Crear tarea
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  loading: boolean;
}>();

const emit = defineEmits<{
  (
    e: "submit",
    payload: { title: string; description: string | null }
  ): void;
}>();

const localTitle = ref("");
const localDescription = ref("");

const handleSubmit = () => {
  const trimmedTitle = localTitle.value.trim();
  const trimmedDescription = localDescription.value.trim();

  if (!trimmedTitle) return;

  emit("submit", {
    title: trimmedTitle,
    description: trimmedDescription || null,
  });

  localTitle.value = "";
  localDescription.value = "";
};
</script>