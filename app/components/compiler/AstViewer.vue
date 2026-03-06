<template>
  <div class="overflow-auto max-h-96">
    <pre class="text-xs p-2 bg-gray-900 rounded">{{ formattedAst }}</pre>
  </div>
</template>

<script setup lang="ts">
import type { Program } from '~/compiler/types'

const props = defineProps<{
  ast: Program | null
}>()

const formattedAst = computed(() => {
  if (!props.ast) return '// No AST generated'
  return JSON.stringify(props.ast, null, 2)
})
</script>
