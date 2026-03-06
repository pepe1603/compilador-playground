<template>
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-primary-400">Compilador Playground</h1>
          <p class="text-gray-400">Aprende cómo funciona un compilador</p>
        </div>
        <div class="flex gap-2">
          <UBadge color="info" variant="subtle">Fase 2: Parser</UBadge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="space-y-4">
          <div class="bg-gray-800 rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-2">Código Fuente</h2>
            <CompilerCodeEditor v-model="code" class="h-96" />
          </div>
          
          <div class="flex gap-2">
            <UButton color="primary" @click="analyze" :loading="isAnalyzing">
              Analizar
            </UButton>
            <UButton color="neutral" variant="outline" @click="loadExample">
              Cargar Ejemplo
            </UButton>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-gray-800 rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-2">Tokens</h2>
            <CompilerTokenViewer :tokens="tokens" />
          </div>

          <div v-if="errors.length > 0" class="bg-red-900/30 border border-red-500 rounded-lg p-4">
            <h3 class="text-red-400 font-semibold mb-2">Errores</h3>
            <ul class="space-y-1">
              <li v-for="(error, i) in errors" :key="i" class="text-red-300 text-sm">
                Línea {{ error.line }}:{{ error.column }} - {{ error.message }}
              </li>
            </ul>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-gray-800 rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-2">AST (Abstract Syntax Tree)</h2>
            <CompilerAstViewer :ast="ast" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const code = ref('')

const { tokens, errors, ast, analyze: runAnalyze } = useCompiler()
const isAnalyzing = ref(false)

const analyze = async () => {
  isAnalyzing.value = true
  await nextTick()
  runAnalyze(code.value)
  isAnalyzing.value = false
}

const loadExample = () => {
  code.value = `// Ejemplo: Calculadora simple
crear a = 10
crear b = 5
crear suma = a + b
crear producto = a * b

imprimir("Suma: " + suma)
imprimir("Producto: " + producto)

si (suma > producto) {
  imprimir("La suma es mayor")
} sino {
  imprimir("El producto es mayor")
}

// Comentario de una línea
crear esMayor = verdadero

// Ejemplo de mientras
crear contador = 0
mientras (contador < 3) {
  imprimir("Contador: " + contador)
  crear contador = contador + 1
}
`
  nextTick(() => analyze())
}
</script>
