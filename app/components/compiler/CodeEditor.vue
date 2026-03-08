<template>
  <div class="w-full h-80 rounded-lg overflow-hidden border-2 border-gray-600 bg-gray-800">
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      class="w-full h-full bg-gray-800 text-green-400 p-4 font-mono text-sm resize-none outline-none"
      placeholder="// Escribe tu código aquí..."
      spellcheck="false"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
