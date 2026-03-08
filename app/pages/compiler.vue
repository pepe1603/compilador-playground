<template>
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <UButton color="neutral" variant="ghost" @click="navigateTo('/')">
            <UIcon name="i-lucide-arrow-left" class="mr-2" />
            Volver
          </UButton>
          <div>
            <h1 class="text-3xl font-bold text-primary-400">Compilador Playground</h1>
            <p class="text-gray-400">Aprende cómo funciona un compilador</p>
          </div>
        </div>
        <UBadge color="success" variant="subtle">Compilador Completo</UBadge>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="space-y-4">
          <div class="bg-gray-800 rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-2">Código Fuente</h2>
            <CompilerCodeEditor v-model="code" />
          </div>
          
          <div class="flex gap-2 flex-wrap">
            <UButton color="primary" size="lg" @click="runCode" :loading="isRunning">
              <UIcon name="i-lucide-play" class="mr-2" />
              Run
            </UButton>
            <UButton color="neutral" variant="outline" @click="loadExample('hola')">
              Hola Mundo
            </UButton>
            <UButton color="neutral" variant="outline" @click="loadExample('variables')">
              Variables
            </UButton>
            <UButton color="neutral" variant="outline" @click="loadExample('condicional')">
              Condicional
            </UButton>
            <UButton color="neutral" variant="outline" @click="loadExample('bucle')">
              Bucle
            </UButton>
            <UButton color="neutral" variant="outline" @click="loadExample('completo')">
              Completo
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
              <UButton 
                :color="activeTab === 'ayuda' ? 'primary' : 'neutral'" 
                variant="soft"
                @click="activeTab = 'ayuda'"
              >
                <UIcon name="i-lucide-help-circle" class="mr-2" />
                Guía
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

            <div v-else-if="activeTab === 'ast'">
              <CompilerAstViewer :ast="ast" />
            </div>

            <div v-else>
              <CompilerHelpPanel @load="loadCode" />
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
const activeTab = ref<'errores' | 'ast' | 'ayuda'>('ayuda')

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

const examples: Record<string, string> = {
  hola: `// Hola Mundo
imprimir("Hola Mundo")`,
  
  variables: `// Variables y operaciones
crear a = 10
crear b = 5
crear suma = a + b
crear resta = a - b
crear producto = a * b
crear division = a / b

imprimir("Suma: " + suma)
imprimir("Resta: " + resta)
imprimir("Producto: " + producto)
imprimir("Division: " + division)`,
  
  condicional: `// Condicional
crear edad = 18

si (edad >= 18) {
  imprimir("Eres mayor de edad")
} sino {
  imprimir("Eres menor de edad")
}`,
  
  bucle: `// Bucle mientras
crear contador = 0
mientras (contador < 5) {
  imprimir("Contador: " + contador)
  crear contador = contador + 1
}`,
  
  completo: `// Programa completo
crear nombre = "Juan"
crear edad = 25

imprimir("Bienvenido " + nombre)
imprimir("Tu edad es: " + edad)

si (edad >= 18) {
  imprimir("Eres mayor de edad")
} sino {
  imprimir("Eres menor de edad")
}

crear contador = 0
mientras (contador < 3) {
  imprimir("Iteracion: " + contador)
  crear contador = contador + 1
}

imprimir("Fin del programa")`
}

const loadExample = (type: string) => {
  code.value = examples[type] || ''
  activeTab.value = 'errores'
  nextTick(() => {
    setTimeout(() => runCode(), 100)
  })
}

const loadCode = (newCode: string) => {
  code.value = newCode
  activeTab.value = 'errores'
  nextTick(() => {
    setTimeout(() => runCode(), 100)
  })
}
</script>
