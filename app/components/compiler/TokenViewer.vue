<template>
  <div class="overflow-auto max-h-96">
    <table class="w-full text-sm">
      <thead class="bg-gray-700 sticky top-0">
        <tr>
          <th class="px-3 py-2 text-left">Línea</th>
          <th class="px-3 py-2 text-left">Tipo</th>
          <th class="px-3 py-2 text-left">Valor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(token, i) in filteredTokens" :key="i" class="border-t border-gray-700 hover:bg-gray-800">
          <td class="px-3 py-1 text-gray-400">{{ token.line }}</td>
          <td class="px-3 py-1">
            <UBadge :color="getTokenColor(token.type)" variant="soft">
              {{ token.type }}
            </UBadge>
          </td>
          <td class="px-3 py-1 font-mono">{{ token.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Token } from '~/compiler/types'

const props = defineProps<{
  tokens: Token[]
}>()

const filteredTokens = computed(() => 
  props.tokens.filter(t => t.type !== 'EOF')
)

const getTokenColor = (type: string): 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral' => {
  const colors: Record<string, 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'> = {
    KEYWORD: 'primary',
    IDENTIFIER: 'info',
    NUMBER: 'success',
    STRING: 'warning',
    OPERATOR: 'secondary',
    PUNCTUATION: 'neutral',
    BOOLEAN: 'success',
    COMMENT: 'neutral'
  }
  return colors[type] || 'neutral'
}
</script>
