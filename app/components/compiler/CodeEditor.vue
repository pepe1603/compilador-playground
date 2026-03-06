<template>
  <div ref="editorRef" class="w-full h-full border rounded-lg" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor

onMounted(() => {
  if (editorRef.value) {
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
