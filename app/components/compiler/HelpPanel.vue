<template>
  <div class="space-y-6">
    <div class="bg-gray-900 rounded-lg p-6">
      <h2 class="text-2xl font-bold text-primary-400 mb-4">📖 Guía de Uso</h2>

      <div class="space-y-4 text-gray-300">
        <div>
          <h3 class="text-lg font-semibold text-white mb-2">¿Cómo usar el compilador?</h3>
          <ol class="list-decimal list-inside space-y-1 ml-2">
            <li>Escribe tu código en el editor de texto</li>
            <li>Haz clic en <span class="text-primary-400 font-bold">Run</span> para ejecutar</li>
            <li>Verifica los errores en la pestaña <span class="text-red-400">Errores</span></li>
            <li>Observa el resultado en <span class="text-green-400">Output</span></li>
          </ol>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-white mb-2">Comandos disponibles</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <code class="bg-gray-800 px-2 py-1 rounded text-green-400 block">crear x = valor</code>
            <span class="text-gray-400">- Declarar variable</span>
            <code class="bg-gray-800 px-2 py-1 rounded text-green-400 block">imprimir("texto")</code>
            <span class="text-gray-400">- Mostrar texto</span>
            <code class="bg-gray-800 px-2 py-1 rounded text-green-400 block">si (cond) { } sino { }</code>
            <span class="text-gray-400">- Condicional</span>
            <code class="bg-gray-800 px-2 py-1 rounded text-green-400 block">mientras (cond) { }</code>
            <span class="text-gray-400">- Bucle</span>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-white mb-2">Operadores</h3>
          <div class="flex flex-wrap gap-2 mt-2">
            <code class="bg-gray-800 px-2 py-1 rounded">+ - * /</code>
            <span class="text-gray-400">Aritméticos</span>
            <code class="bg-gray-800 px-2 py-1 rounded">== !=</code>
            <span class="text-gray-400">Comparación</span>
            <code class="bg-gray-800 px-2 py-1 rounded">> < >= <=</code>
            <span class="text-gray-400">Relacionales</span>
            <code class="bg-gray-800 px-2 py-1 rounded">y o no</code>
            <span class="text-gray-400">Lógicos</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gray-900 rounded-lg p-6">
      <h2 class="text-2xl font-bold text-primary-400 mb-4">💡 Ejemplos</h2>

      <div class="space-y-3">
        <div v-for="(example, index) in examples" :key="index" class="border border-gray-700 rounded-lg overflow-hidden">
          <button
            @click="example.open = !example.open"
            class="w-full px-4 py-3 bg-gray-800 flex items-center justify-between hover:bg-gray-700 transition-colors"
          >
            <span class="font-semibold text-white">{{ example.label }}</span>
            <UIcon :name="example.open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
          </button>
          <div v-if="example.open" class="p-4 bg-gray-950">
            <pre class="text-green-400 text-sm whitespace-pre-wrap mb-3">{{ example.code }}</pre>
            <UButton color="primary" size="sm" @click="$emit('load', example.code)">
              <UIcon name="i-lucide-play" class="mr-2" />
              Cargar ejemplo
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'load', code: string): void
}>()

const examples = ref([
  {
    label: 'Ejemplo 1: Hola Mundo',
    code: `// Hola Mundo básico
imprimir("Hola Mundo");`,
    open: true
  },
  {
    label: 'Ejemplo 2: Variables y Operaciones',
    code: `// Variables y operaciones
crear a = 10;
crear b = 5;
crear suma = a + b;
crear resta = a - b;
crear producto = a * b;
crear division = a / b;

imprimir("Suma: " + suma);
imprimir("Resta: " + resta);
imprimir("Producto: " + producto);
imprimir("Division: " + division);
`,
    open: false
  },
  {
    label: 'Ejemplo 3: Condicionales',
    code: `// Condicionales si/sino
crear edad = 18;

si (edad >= 18) {
  imprimir("Eres mayor de edad");
} sino {
  imprimir("Eres menor de edad");
}`,
    open: false
  },
  {
    label: 'Ejemplo 4: Bucles',
    code: `// Bucle mientras
crear contador = 0;
mientras (contador < 5) {
  imprimir("Contador: " + contador);
  contador = contador + 1;
}`,
    open: false
  },
  {
    label: 'Ejemplo 5: Programa Completo',
    code: `// Programa completo
crear nombre = "Juan";
crear edad = 25;

imprimir("Bienvenido " + nombre);
imprimir("Tu edad es: " + edad);

si (edad >= 18) {
  imprimir("Eres mayor de edad");
} sino {
  imprimir("Eres menor de edad");
}

crear i = 0;
mientras (i < 3) {
  imprimir("Iteracion: " + i);
  i = i + 1;
}

imprimir("Fin del programa");`,
    open: false
  }
])
</script>
