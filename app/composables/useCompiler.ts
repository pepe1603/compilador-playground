import { Lexer } from '~/compiler/lexer'
import type { Token, CompilerError } from '~/compiler/types'

export const useCompiler = () => {
  const tokens = ref<Token[]>([])
  const errors = ref<CompilerError[]>([])
  const ast = ref<any>(null)
  const generatedCode = ref<string>('')

  const analyze = (code: string) => {
    // Análisis Léxico
    const lexer = new Lexer(code)
    const result = lexer.tokenize()
    tokens.value = result.tokens
    errors.value = result.errors

    // Aquí irá el parser
    // if (errors.value.length === 0) {
    //   const parser = new Parser(tokens.value)
    //   ast.value = parser.parse()
    // }
  }

  const generate = (code: string) => {
    // Aquí irá el generador de código
    // if (ast.value) {
    //   const generator = new Generator()
    //   generatedCode.value = generator.generate(ast.value)
    // }
  }

  const run = (code: string) => {
    // Ejecutar el código generado
    try {
      // Por ahora solo eval
      const result = eval(code)
      return { success: true, output: result }
    } catch (error) {
      return { success: false, output: String(error) }
    }
  }

  return {
    tokens,
    errors,
    ast,
    generatedCode,
    analyze,
    generate,
    run
  }
}
