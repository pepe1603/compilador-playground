<template>
  <div class="overflow-auto max-h-96">
    <UTable :rows="formattedTokens" :columns="columns">
      <template #type-data="{ row }">
        <UBadge :color="getTokenColor(row.type)" variant="soft">
          {{ row.type }}
        </UBadge>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import type { Token } from '~/compiler/types'

const props = defineProps<{
  tokens: Token[]
}>()

const columns = [
  { key: 'line', label: 'Línea' },
  { key: 'type', label: 'Tipo' },
  { key: 'value', label: 'Valor' }
]

const formattedTokens = computed(() =>
  props.tokens.filter(t => t.type !== 'EOF')
)

const getTokenColor = (type: string): string => {
  const colors: Record<string, string> = {
    KEYWORD: 'primary',
    IDENTIFIER: 'info',
    NUMBER: 'success',
    STRING: 'warning',
    OPERATOR: 'secondary',
    PUNCTUATION: 'gray'
  }
  return colors[type] || 'gray'
}
</script>
