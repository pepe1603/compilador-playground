<template>
  <div class="w-full h-96 rounded-lg overflow-hidden border-2 border-gray-700">
    <ClientOnly>
      <div ref="editorRef" class="w-full h-full" />
      <template #fallback>
        <div class="w-full h-full bg-gray-800 flex items-center justify-center">
          <span class="text-gray-400">Cargando editor...</span>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, shallowRef } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLElement | null>(null)
const editor = shallowRef<any>(null)

onMounted(async () => {
  if (import.meta.client && editorRef.value) {
    try {
      const monaco = await import('monaco-editor')
      
      self.MonacoEnvironment = {
        getWorker: function () {
          return new Worker(
            new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
            { type: 'module' }
          )
        }
      }

      editor.value = monaco.editor.create(editorRef.value, {
        value: props.modelValue || '',
        language: 'javascript',
        theme: 'vs-dark',
        minimap: { enabled: false },
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        roundedSelection: false,
        padding: { top: 10 },
        readOnly: false,
        domReadOnly: false
      })

      editor.value.onDidChangeModelContent(() => {
        if (editor.value) {
          const value = editor.value.getValue()
          emit('update:modelValue', value)
        }
      })

      editor.value.focus()
    } catch (e) {
      console.error('Error initializing Monaco:', e)
    }
  }
})

watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== undefined) {
    const currentValue = editor.value.getValue()
    if (currentValue !== newValue) {
      editor.value.setValue(newValue)
    }
  }
})
</script>
