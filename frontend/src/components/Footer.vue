<template>
	<footer class="service-footer">
		<p class="footer-copy">
			&copy; {{ currentYear }} Registro de tareas. Todos los derechos reservados.
		</p>
		<p class="footer-tech">
			Desarrollado con
			<a
				href="https://vuejs.org"
				target="_blank"
				rel="noopener noreferrer"
				class="footer-link"
			>Vue 3</a>
			&amp;
			<a
				href="https://www.typescriptlang.org"
				target="_blank"
				rel="noopener noreferrer"
				class="footer-link"
			>TypeScript</a>
		</p>
	</footer>
</template>

<script setup lang="ts">
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.service-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.85rem 2rem;
	border-radius: 0;
	border: none;
	border-top: 1px solid #e2e8f0;
	background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
	flex-wrap: wrap;
}

.footer-copy,
.footer-tech {
	margin: 0;
	font-size: 0.82rem;
	color: #64748b;
}

.footer-link {
	color: #3b82f6;
	text-decoration: none;
	font-weight: 500;
	transition: color 0.2s ease;
}

.footer-link:hover {
	color: #1d4ed8;
	text-decoration: underline;
}
</style>
