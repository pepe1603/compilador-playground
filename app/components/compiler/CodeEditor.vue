<template>
  <div class="w-full h-80 rounded-lg overflow-hidden border-2 border-gray-600">
    <ClientOnly>
      <vue-monaco-editor
        v-model:value="code"
        theme="vs-dark"
        :language="language"
        :options="editorOptions"
        @mount="handleMount"
      />
      <template #fallback>
        <div class="w-full h-80 bg-gray-800 flex items-center justify-center text-gray-400">
          Cargando editor...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const code = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const language = ref('javascript')

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Consolas, monospace',
  lineNumbers: 'on',
  roundedSelection: true,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
  padding: { top: 16 }
}

const handleMount = (editor: unknown) => {
  console.log('Monaco Editor mounted successfully')
}
</script>
