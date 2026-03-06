<template>
  <ClientOnly>
    <div ref="editorRef" class="w-full h-full border rounded-lg" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLElement>()
let editor: any = null

onMounted(async () => {
  if (import.meta.client && editorRef.value) {
    const monaco = await import('monaco-editor')
    
    self.MonacoEnvironment = {
      getWorker: function () {
        return new Worker(
          new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
          { type: 'module' }
        )
      }
    }

    editor = monaco.editor.create(editorRef.value, {
      value: props.modelValue,
      language: 'javascript',
      theme: 'vs-dark',
      minimap: { enabled: false },
      automaticLayout: true,
      fontSize: 14,
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      roundedSelection: false,
      padding: { top: 10 }
    })

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue()
      emit('update:modelValue', value)
    })
  }
})

watch(() => props.modelValue, (newValue) => {
  if (editor && newValue !== editor.getValue()) {
    editor.setValue(newValue)
  }
})
</script>
