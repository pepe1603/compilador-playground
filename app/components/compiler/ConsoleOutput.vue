<template>
  <div class="bg-black rounded-lg p-4 font-mono text-sm overflow-auto max-h-64 min-h-32">
    <div v-if="!output || output.length === 0" class="text-gray-500">
      // La salida del programa aparecerá aquí...
    </div>
    <div v-else class="space-y-1">
      <div v-for="(line, i) in output" :key="i" class="text-green-400">
        <span class="text-gray-500 mr-2">></span>{{ line }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  output: string[]
}>()
</script>
