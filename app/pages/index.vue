<template>
  <div class="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>

    <div class="text-center z-10 p-8">
      <h1 class="text-4xl md:text-8xl font-bold mb-4">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-pulse">
          COMPILADOR
        </span>
      </h1>
      <h2 class="text-xl md:text-6xl font-bold mb-8">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500">
          PLAYGROUND
        </span>
      </h2>

      <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
        Aprende cómo funciona un compilador desde cero
      </p>

      <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
        <UButton size="xl" color="primary" variant="solid" @click="$emit('start')" to="/compiler">
          <UIcon name="i-lucide-code" class="mr-2" />
          Comenzar
        </UButton>
        <UButton size="xl" color="secondary" variant="outline" to="/docs">
          <UIcon name="i-lucide-book-open" class="mr-2" />
          Docs
        </UButton>
        <UButton size="xl" color="neutral" variant="outline" to="https://github.com/pepe1603/compilador-playground" target="_blank">
          <UIcon name="i-simple-icons-github" class="mr-2" />
          GitHub
        </UButton>
      </div>

      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        <div class="text-center">
          <div class="text-3xl mb-2">🔤</div>
          <div class="text-purple-400 font-bold">Lexer</div>
          <div class="text-gray-500 text-sm">Análisis Léxico</div>
        </div>
        <div class="text-center">
          <div class="text-3xl mb-2">📝</div>
          <div class="text-pink-400 font-bold">Parser</div>
          <div class="text-gray-500 text-sm">Análisis Sintáctico</div>
        </div>
        <div class="text-center">
          <div class="text-3xl mb-2">🔍</div>
          <div class="text-cyan-400 font-bold">Semantic</div>
          <div class="text-gray-500 text-sm">Análisis Semántico</div>
        </div>
        <div class="text-center">
          <div class="text-3xl mb-2">⚡</div>
          <div class="text-green-400 font-bold">Runtime</div>
          <div class="text-gray-500 text-sm">Ejecución</div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-4 text-gray-600 text-sm">
      Presiona <kbd class="bg-gray-800 px-2 py-1 rounded">Enter</kbd> para comenzar
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'start'): void
}>()

onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigateTo('/compiler')
    }
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>

<style scoped>
@keyframes glow {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.5)); }
  50% { filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.8)); }
}

.animate-pulse {
  animation: glow 2s ease-in-out infinite;
}
</style>
