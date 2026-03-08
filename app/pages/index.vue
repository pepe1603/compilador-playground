<template>
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-primary-400">Compilador Playground</h1>
          <p class="text-gray-400">Aprende cómo funciona un compilador</p>
        </div>
        <div class="flex gap-2">
          <UBadge color="info" variant="subtle">Fase 3: Analizador Semántico</UBadge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="space-y-4">
          <div class="bg-gray-800 rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-2">Código Fuente</h2>
            <CompilerCodeEditor v-model="code" class="h-96" />
          </div>
          
          <div class="flex gap-2 flex-wrap">
            <UButton color="primary" size="lg" @click="run" :loading="isAnalyzing">
              <UIcon name="i-lucide-play" class="mr-2" />
              Run
            </UButton>
            <UButton color="neutral" variant="outline" @click="loadExample">
              Ejemplo Válido
            </UButton>
            <UButton color="error" variant="outline" @click="loadErrorExample">
              Ejemplo con Error
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
                <UBadge :color="getErrorColor(error.type)" variant="subtle" class="mr-2">
                  {{ error.type }}
                </UBadge>
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

const getErrorColor = (type: string): 'error' | 'warning' | 'info' => {
  if (type === 'lexical') return 'error'
  if (type === 'syntactic') return 'warning'
  return 'error'
}

const run = async () => {
  if (!code.value.trim()) {
    alert('Por favor ingresa código antes de ejecutar')
    return
  }
  isAnalyzing.value = true
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 50))
  runAnalyze(code.value)
  isAnalyzing.value = false
}

const loadExample = () => {
  code.value = `// Ejemplo completo del lenguaje
// ======================================

// Saludo básico
imprimir("Hola Mundo")

// Solicitar nombre y saludar
crear nombre = "Usuario"
crear mensaje = "Bienvenido, " + nombre + "!"
imprimir(mensaje)

// Condicionales
crear edad = 18
si (edad >= 18) {
  imprimir("Eres mayor de edad")
} sino {
  imprimir("Eres menor de edad")
}

// Bucles
cre0
mientrasar contador =  (contador < 3) {
  imprimir("Contador: " + contador)
  crear contador = contador + 1
}
`
  setTimeout(() => run(), 200)
}

const loadErrorExample = () => {
  code.value = `// Ejemplo de errores semánticos
// ======================================

// Error: Variable no declarada
imprimir(variableNoDeclarada)

// Error: Usar string en condición
crear nombre = "Juan"
si (nombre) {
  imprimir("Esto causará error de tipo")
}
`
  setTimeout(() => run(), 200)
}
</script>
