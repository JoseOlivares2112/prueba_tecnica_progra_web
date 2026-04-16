<template>
	<header class="service-header">
		<div class="brand">
			<div class="logo" aria-hidden="true">
				{{ logoText }}
			</div>

			<div class="brand-copy">
				<p class="eyebrow">Servicio</p>
				<h1 class="title">{{ title }}</h1>
			</div>
		</div>

		<div class="search-container">
			<select
				class="search-mode"
				:value="searchMode"
				@change="onModeChange"
			>
				<option value="name">Buscar por nombre</option>
				<option value="date">Buscar por fecha</option>
			</select>

			<input
				id="task-search"
				:type="searchInputType"
				class="search-input"
				:placeholder="searchPlaceholder"
				:value="modelValue"
				@input="onSearchInput"
				@keydown.enter.prevent="onEnterSearch"
			/>

			<ul v-if="showSuggestions" class="suggestions-list">
				<li v-for="suggestion in suggestions" :key="suggestion.id">
					<button
						type="button"
						class="suggestion-item"
						@click="emit('select-suggestion', suggestion)"
					>
						<span>{{ suggestion.title }}</span>
						<small v-if="suggestion.meta" class="suggestion-meta">
							{{ suggestion.meta }}
						</small>
					</button>
				</li>
			</ul>

			<div
				v-else-if="modelValue.trim().length > 0"
				class="suggestions-empty"
			>
				No se encontraron tareas
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { computed } from "vue";

type SearchSuggestion = {
	id: number;
	title: string;
	queryValue: string;
	meta?: string;
};

type SearchMode = "name" | "date";

const props = withDefaults(
	defineProps<{
		title?: string;
		logoText?: string;
		modelValue?: string;
		suggestions?: SearchSuggestion[];
		searchMode?: SearchMode;
	}>(),
	{
		title: "Registro de tareas",
		logoText: "RT",
		modelValue: "",
		suggestions: () => [],
		searchMode: "name",
	},
);

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
	(e: "update:searchMode", mode: SearchMode): void;
	(e: "select-suggestion", suggestion: SearchSuggestion): void;
}>();

const searchPlaceholder = computed(() =>
	props.searchMode === "date"
		? "Selecciona fecha de creación"
		: "Buscar tarea por nombre",
);

const searchInputType = computed(() =>
	props.searchMode === "date" ? "date" : "search",
);

const showSuggestions = computed(
	() => props.modelValue.trim().length > 0 && props.suggestions.length > 0,
);

const onSearchInput = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit("update:modelValue", target.value);
};

const onModeChange = (event: Event) => {
	const target = event.target as HTMLSelectElement;
	emit("update:searchMode", target.value as SearchMode);
};

const onEnterSearch = () => {
	if (!showSuggestions.value) {
		return;
	}

	emit("select-suggestion", props.suggestions[0]);
};
</script>

<style scoped>
.service-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 1rem 1.25rem;
	border-radius: 0.9rem;
	border: 1px solid #e2e8f0;
	background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
}

.brand {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	min-width: 0;
}

.logo {
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 0.75rem;
	background: #0f172a;
	color: #ffffff;
	display: grid;
	place-items: center;
	font-weight: 700;
	font-size: 0.9rem;
	flex-shrink: 0;
}

.brand-copy {
	min-width: 0;
}

.eyebrow {
	margin: 0;
	font-size: 0.72rem;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: #64748b;
}

.title {
	margin: 0.15rem 0 0;
	font-size: 1.2rem;
	line-height: 1.2;
	color: #0f172a;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.search-container {
	position: relative;
	width: min(100%, 22rem);
}

.search-mode {
	width: 100%;
	height: 2.2rem;
	margin-bottom: 0.45rem;
	padding: 0 0.7rem;
	border-radius: 0.65rem;
	border: 1px solid #cbd5e1;
	background: #ffffff;
	color: #0f172a;
	font-size: 0.9rem;
	outline: none;
}

.search-mode:focus {
	border-color: #3b82f6;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
}

.search-input {
	width: 100%;
	height: 2.6rem;
	padding: 0 0.85rem;
	border-radius: 0.75rem;
	border: 1px solid #cbd5e1;
	background: #ffffff;
	color: #0f172a;
	font-size: 0.95rem;
	outline: none;
	transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
	border-color: #3b82f6;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
}

.suggestions-list {
	position: absolute;
	top: calc(100% + 0.4rem);
	left: 0;
	right: 0;
	margin: 0;
	padding: 0.35rem;
	list-style: none;
	background: #ffffff;
	border: 1px solid #cbd5e1;
	border-radius: 0.75rem;
	box-shadow: 0 14px 34px rgba(15, 23, 42, 0.14);
	z-index: 20;
	max-height: 14rem;
	overflow-y: auto;
}

.suggestion-item {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.6rem;
	text-align: left;
	border: none;
	background: transparent;
	padding: 0.58rem 0.62rem;
	border-radius: 0.5rem;
	font-size: 0.92rem;
	color: #1e293b;
	cursor: pointer;
}

.suggestion-item:hover {
	background: #eff6ff;
}

.suggestion-meta {
	color: #64748b;
	font-size: 0.78rem;
	white-space: nowrap;
}

.suggestions-empty {
	position: absolute;
	top: calc(100% + 0.4rem);
	left: 0;
	right: 0;
	padding: 0.62rem 0.75rem;
	font-size: 0.9rem;
	color: #64748b;
	background: #ffffff;
	border: 1px solid #cbd5e1;
	border-radius: 0.75rem;
	box-shadow: 0 14px 34px rgba(15, 23, 42, 0.14);
	z-index: 20;
}

@media (max-width: 720px) {
	.service-header {
		flex-direction: column;
		align-items: flex-start;
	}

	.search-container {
		width: 100%;
	}
}
</style>
