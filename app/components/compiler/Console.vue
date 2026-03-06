<template>
  <div class="bg-black text-green-400 font-mono p-4 rounded-lg h-48 overflow-auto">
    <pre>{{ output }}</pre>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  output: string
}>()
</script>
