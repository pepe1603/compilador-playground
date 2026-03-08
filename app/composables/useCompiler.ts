import { Lexer } from '~/compiler/lexer'
import { Parser } from '~/compiler/parser'
import { SemanticAnalyzer } from '~/compiler/analyzer'
import type { Token, CompilerError, Program } from '~/compiler/types'

export const useCompiler = () => {
  const tokens = ref<Token[]>([])
  const errors = ref<CompilerError[]>([])
  const ast = ref<Program | null>(null)
  const generatedCode = ref<string>('')

  const analyze = (code: string) => {
    errors.value = []
    
    const lexer = new Lexer(code)
    const lexerResult = lexer.tokenize()
    tokens.value = lexerResult.tokens
    errors.value = [...errors.value, ...lexerResult.errors]

    if (errors.value.length === 0) {
      const parser = new Parser(tokens.value)
      const parseResult = parser.parse()
      ast.value = parseResult.ast
      errors.value = [...errors.value, ...parseResult.errors]
    }

    if (errors.value.length === 0 && ast.value) {
      const analyzer = new SemanticAnalyzer()
      const semanticErrors = analyzer.analyze(ast.value)
      errors.value = [...errors.value, ...semanticErrors]
    } else {
      ast.value = null
    }
  }

  const generate = (code: string) => {
    if (ast.value) {
      generatedCode.value = JSON.stringify(ast.value, null, 2)
    }
  }

  const run = (code: string) => {
    try {
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
