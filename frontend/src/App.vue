
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
              
              <TaskForm
                :loading="loading"
                 @submit="createTask"
              />
              
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card elevation="4" rounded="xl" class="pa-6">
              <v-card-title class="text-h5 font-weight-bold mb-4">
                Lista de tareas
              </v-card-title>

                <TaskList
                  :tasks="tasks"
                  @toggle="toggleTask"
                  @delete="deleteTask"
                />

            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import TaskList from "./components/TaskList.vue";
import TaskForm from "./components/TaskForm.vue";

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt?: string;
};

const tasks = ref<Task[]>([]);
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

const createTask = async (payload: {
  title: string;
  description: string | null;
}) => {
  try {
    loading.value = true;

    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("No se pudo crear la tarea");
    }

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