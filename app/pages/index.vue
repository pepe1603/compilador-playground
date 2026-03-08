<template>
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-primary-400">Compilador Playground</h1>
          <p class="text-gray-400">Aprende cómo funciona un compilador</p>
        </div>
        <div class="flex gap-2">
          <UBadge color="success" variant="subtle">Fase 4: Intérprete</UBadge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="space-y-4">
          <div class="bg-gray-800 rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-2">Código Fuente</h2>
            <ClientOnly>
              <CompilerCodeEditor v-model="code" />
              <template #fallback>
                <div class="w-full h-80 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span class="text-gray-400">Cargando editor...</span>
                </div>
              </template>
            </ClientOnly>
          </div>
          
          <div class="flex gap-2 flex-wrap">
            <UButton color="primary" size="lg" @click="runCode" :loading="isRunning">
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

          <div class="bg-gray-800 rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-2">
              <UIcon name="i-lucide-terminal" class="mr-2" />
              Output
            </h2>
            <CompilerConsoleOutput :output="output" />
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-gray-800 rounded-lg p-4">
            <div class="flex gap-2 mb-4">
              <UButton 
                :color="activeTab === 'errores' ? 'primary' : 'neutral'" 
                variant="soft"
                @click="activeTab = 'errores'"
              >
                <UIcon name="i-lucide-alert-triangle" class="mr-2" />
                Errores
                <UBadge v-if="errors.length > 0" color="error" variant="solid" class="ml-2">
                  {{ errors.length }}
                </UBadge>
              </UButton>
              <UButton 
                :color="activeTab === 'ast' ? 'primary' : 'neutral'" 
                variant="soft"
                @click="activeTab = 'ast'"
              >
                <UIcon name="i-lucide-file-code" class="mr-2" />
                AST
              </UButton>
            </div>

            <div v-if="activeTab === 'errores'">
              <div v-if="errors.length > 0" class="space-y-2">
                <div v-for="(error, i) in errors" :key="i" class="bg-red-900/30 border border-red-500 rounded p-3 text-red-300">
                  <UBadge :color="getErrorColor(error.type)" variant="solid" class="mr-2 mb-1">
                    {{ error.type }}
                  </UBadge>
                  <br>
                  <span class="text-sm">Línea {{ error.line }}:{{ error.column }}</span>
                  <br>
                  <span class="font-semibold">{{ error.message }}</span>
                </div>
              </div>
              <div v-else class="text-green-400 text-center py-8">
                <UIcon name="i-lucide-check-circle" class="text-4xl mb-2" />
                <p>No hay errores - Código válido</p>
              </div>
            </div>

            <div v-else>
              <CompilerAstViewer :ast="ast" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const code = ref('')

const { errors, ast, output, run: runCompiler } = useCompiler()
const isRunning = ref(false)
const activeTab = ref<'errores' | 'ast'>('errores')

const getErrorColor = (type: string): 'error' | 'warning' | 'info' => {
  if (type === 'lexical') return 'error'
  if (type === 'syntactic') return 'warning'
  return 'error'
}

const runCode = async () => {
  if (!code.value.trim()) {
    alert('Por favor ingresa código antes de ejecutar')
    return
  }
  isRunning.value = true
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 100))
  runCompiler(code.value)
  isRunning.value = false
}

const loadExample = () => {
  code.value = `// Ejemplo: Hola Mundo
imprimir("Hola Mundo")

// Variables y operaciones
crear nombre = "Juan"
crear edad = 25

// Operaciones aritméticas
crear a = 10
crear b = 5
crear suma = a + b
crear resta = a - b
crear producto = a * b
crear division = a / b

// Mostrar resultados
imprimir("Nombre: " + nombre)
imprimir("Edad: " + edad)
imprimir("Suma: " + suma)
imprimir("Resta: " + resta)
imprimir("Producto: " + producto)
imprimir("Division: " + division)

// Condicional
si (edad >= 18) {
  imprimir("Eres mayor de edad")
} sino {
  imprimir("Eres menor de edad")
}

// Bucle
crear contador = 0
mientras (contador < 3) {
  imprimir("Contador: " + contador)
  crear contador = contador + 1
}
`
  nextTick(() => {
    setTimeout(() => runCode(), 300)
  })
}

const loadErrorExample = () => {
  code.value = `// Ejemplo de errores
// =====================

// Error: Variable no declarada
imprimir(variableNoDeclarada)
`
  nextTick(() => {
    setTimeout(() => runCode(), 300)
  })
}
</script>
