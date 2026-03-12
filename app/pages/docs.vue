<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div class="max-w-4xl mx-auto p-8">
      <div class="mb-8 flex items-center gap-4">
        <UButton color="neutral" variant="ghost" @click="navigateTo('/')">
          <UIcon name="i-lucide-arrow-left" class="mr-2" />
          Volver
        </UButton>
      </div>

      <h1 class="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
        PlayLang
      </h1>
      <p class="text-xl text-gray-400 mb-8">
        El lenguaje de programación personalizado de Compilador Playground
      </p>

      <div class="space-y-8">
        <section class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-2xl font-bold mb-4 text-purple-400">¿Qué es PlayLang?</h2>
          <p class="text-gray-300">
            PlayLang es un lenguaje de programación educativo diseñado en español para facilitar 
            el aprendizaje de conceptos fundamentales de programación y compiladores. 
            Su sintaxis simple y legible lo hace ideal para principiantes.
          </p>
        </section>

        <section class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-2xl font-bold mb-4 text-pink-400">Variables</h2>
          <p class="text-gray-300 mb-4">
            Declara variables usando la palabra clave <code class="bg-gray-700 px-2 py-1 rounded">crear</code>:
          </p>
          <pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code class="text-green-400">crear nombre = "Juan"
crear edad = 25
crear altura = 1.75
crear activo = verdadero</code></pre>
        </section>

        <section class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-2xl font-bold mb-4 text-cyan-400">Operadores</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="op in operators" :key="op.symbol" class="bg-gray-700 p-3 rounded-lg">
              <code class="text-yellow-400 font-bold">{{ op.symbol }}</code>
              <p class="text-gray-400 text-sm">{{ op.desc }}</p>
            </div>
          </div>
        </section>

        <section class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-2xl font-bold mb-4 text-green-400">Estructuras de Control</h2>
          
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-2">Condicional (si/sino)</h3>
            <pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code class="text-green-400">crear edad = 18

si (edad >= 18) {
  imprimir("Eres mayor de edad")
} sino {
  imprimir("Eres menor de edad")
}</code></pre>
          </div>

          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-2">Bucle (mientras)</h3>
            <pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code class="text-green-400">crear contador = 0
mientras (contador < 5) {
  imprimir("Contador: " + contador)
  crear contador = contador + 1
}</code></pre>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-2">Funciones</h3>
            <pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code class="text-green-400">funcion saludar(nombre) {
  retornar "Hola " + nombre
}

crear mensaje = saludar("Mundo")
imprimir(mensaje)</code></pre>
          </div>
        </section>

        <section class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-2xl font-bold mb-4 text-blue-400">Cómo Funciona el Compilador</h2>
          
          <div class="space-y-6">
            <div class="flex gap-4">
              <div class="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">1</div>
              <div>
                <h3 class="text-xl font-semibold text-purple-400">Lexer (Análisis Léxico)</h3>
                <p class="text-gray-300">
                  El lexer lee el código fuente carácter por carácter y lo convierte en tokens. 
                  Identifica palabras clave, operadores, números, cadenas y símbolos.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="bg-pink-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">2</div>
              <div>
                <h3 class="text-xl font-semibold text-pink-400">Parser (Análisis Sintáctico)</h3>
                <p class="text-gray-300">
                  El parser toma los tokens y construye el AST (Abstract Syntax Tree), 
                  una representación jerárquica de la estructura del programa.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="bg-cyan-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">3</div>
              <div>
                <h3 class="text-xl font-semibold text-cyan-400">Analyzer (Análisis Semántico)</h3>
                <p class="text-gray-300">
                  El analyzer verifica que las operaciones tengan sentido, como verificar 
                  tipos de datos y作用域 (scope) de variables.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">4</div>
              <div>
                <h3 class="text-xl font-semibold text-green-400">Interpreter (Ejecución)</h3>
                <p class="text-gray-300">
                  El intérprete recorre el AST y ejecuta cada nodo, produciendo 
                  la salida del programa.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div class="flex gap-4 justify-center">
          <UButton size="lg" color="primary" to="/compiler">
            <UIcon name="i-lucide-code" class="mr-2" />
            Ir al Compilador
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const operators = [
  { symbol: '+', desc: 'Suma' },
  { symbol: '-', desc: 'Resta' },
  { symbol: '*', desc: 'Multiplicación' },
  { symbol: '/', desc: 'División' },
  { symbol: '==', desc: 'Igual a' },
  { symbol: '!=', desc: 'Diferente de' },
  { symbol: '>', desc: 'Mayor que' },
  { symbol: '<', desc: 'Menor que' },
  { symbol: '>=', desc: 'Mayor o igual' },
  { symbol: '<=', desc: 'Menor o igual' },
  { symbol: 'y', desc: 'AND lógico' },
  { symbol: 'o', desc: 'OR lógico' },
  { symbol: 'no', desc: 'NOT lógico' },
]
</script>
