
--comentario de prueba -- 

<template>
  <v-app>
    <v-main>
      <v-container class="py-8" max-width="800">
        <v-row justify="center">
          <v-col cols="12">
            <v-card elevation="6" rounded="xl" class="pa-6 mb-6">
              <v-card-title class="text-h4 font-weight-bold">
                Registro de tareas
              </v-card-title>

              <v-form @submit.prevent="createTask">
                <v-text-field
                  v-model="title"
                  label="Título de la tarea"
                  variant="outlined"
                  prepend-inner-icon="mdi-format-title"
                  class="mb-3"
                  :disabled="loading"
                />

                <v-textarea
                  v-model="description"
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
                  :disabled="loading || !title.trim()"
                  prepend-icon="mdi-plus"
                >
                  Crear tarea
                </v-btn>
              </v-form>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card elevation="4" rounded="xl" class="pa-6">
              <v-card-title class="text-h5 font-weight-bold mb-4">
                Lista de tareas
              </v-card-title>

              <div v-if="tasks.length === 0" class="text-medium-emphasis">
                No hay tareas todavía.
              </div>

              <v-list v-else class="pa-0">
                <v-list-item
                  v-for="task in tasks"
                  :key="task.id"
                  class="mb-3 border rounded-lg"
                >
                  <template #prepend>
                    <v-checkbox-btn
                      :model-value="task.completed"
                      @click="toggleTask(task.id)"
                    />
                  </template>

                  <v-list-item-title
                    :class="task.completed ? 'text-decoration-line-through text-medium-emphasis' : 'font-weight-medium'"
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
                      {{ task.completed ? 'Completada' : 'Pendiente' }}
                    </v-chip>

                    <v-btn
                      icon="mdi-delete"
                      color="error"
                      variant="text"
                      @click="deleteTask(task.id)"
                    />
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt?: string;
};

const tasks = ref<Task[]>([]);
const title = ref("");
const description = ref("");
const loading = ref(false);

const loadTasks = async () => {
  try {
    const response = await fetch("http://localhost:3000/tasks");
    const data = await response.json();
    tasks.value = data;
  } catch (error) {
    console.error("Error al obtener tareas:", error);
  }
};

const createTask = async () => {
  if (!title.value.trim()) return;

  try {
    loading.value = true;

    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.value.trim(),
        description: description.value.trim() || null,
      }),
    });

    if (!response.ok) {
      throw new Error("No se pudo crear la tarea");
    }

    title.value = "";
    description.value = "";

    await loadTasks();
  } catch (error) {
    console.error("Error al crear tarea:", error);
  } finally {
    loading.value = false;
  }
};

const toggleTask = async (id: number) => {
  try {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PATCH",
    });

    await loadTasks();
  } catch (error) {
    console.error("Error al cambiar estado:", error);
  }
};

const deleteTask = async (id: number) => {
  try {
    const confirmDelete = confirm("¿Seguro que quieres eliminar esta tarea?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
    });

    await loadTasks();
  } catch (error) {
    console.error("Error al eliminar:", error);
  }
};

onMounted(async () => {
  await loadTasks();
});
</script>