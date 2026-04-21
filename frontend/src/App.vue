
--comentario de prueba -- 

<template>
  <v-app>
    <v-main>
      <Header
        v-model="searchTerm"
        v-model:search-mode="searchMode"
        :suggestions="searchSuggestions"
        @select-suggestion="handleSuggestionSelect"
      />

        <v-container class="py-8" max-width="800">
          <router-view
            :tasks="filteredTasks"
            :loading="loading"
            :highlighted-task-id="highlightedTaskId"
            @submit="createTask"
            @toggle="toggleTask"
            @delete="deleteTask"
          />
        </v-container>

      <Footer />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import Header from "./components/Header.vue";
import Footer from './components/Footer.vue'

type SearchMode = "name" | "date";

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt?: string;
};

type SearchSuggestion = {
  id: number;
  title: string;
  queryValue: string;
  meta?: string;
};

const tasks = ref<Task[]>([]);
const loading = ref(false);
const searchTerm = ref("");
const searchMode = ref<SearchMode>("name");
const highlightedTaskId = ref<number | null>(null);
let clearHighlightTimeout: ReturnType<typeof setTimeout> | null = null;

const toISODate = (value?: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

const formatDate = (value?: string) => {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return date.toLocaleDateString("es-CL");
};

const searchSuggestions = computed(() => {
  const query = searchTerm.value.trim();

  if (!query) {
    return [];
  }

  if (searchMode.value === "date") {
    return tasks.value
      .filter((task) => toISODate(task.createdAt) === query)
      .slice(0, 6)
      .map((task) => ({
        id: task.id,
        title: task.title,
        queryValue: toISODate(task.createdAt),
        meta: formatDate(task.createdAt),
      }));
  }

  const loweredQuery = query.toLowerCase();

  return tasks.value
    .filter((task) => task.title.toLowerCase().includes(loweredQuery))
    .slice(0, 6)
    .map((task) => ({
      id: task.id,
      title: task.title,
      queryValue: task.title,
      meta: formatDate(task.createdAt),
    }));
});

const filteredTasks = computed(() => {
  const query = searchTerm.value.trim();

  if (!query) {
    return tasks.value;
  }

  if (searchMode.value === "date") {
    return tasks.value.filter((task) => toISODate(task.createdAt) === query);
  }

  const loweredQuery = query.toLowerCase();

  return tasks.value.filter((task) =>
    task.title.toLowerCase().includes(loweredQuery),
  );
});

const handleSuggestionSelect = async (suggestion: SearchSuggestion) => {
  searchTerm.value = suggestion.queryValue;
  highlightedTaskId.value = suggestion.id;

  if (clearHighlightTimeout) {
    clearTimeout(clearHighlightTimeout);
  }

  await nextTick();

  const taskElement = document.getElementById(`task-${suggestion.id}`);
  taskElement?.scrollIntoView({ behavior: "smooth", block: "center" });

  clearHighlightTimeout = setTimeout(() => {
    highlightedTaskId.value = null;
  }, 2200);
};

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