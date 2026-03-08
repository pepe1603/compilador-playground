import { Lexer } from '~/compiler/lexer'
import { Parser } from '~/compiler/parser'
import { SemanticAnalyzer } from '~/compiler/analyzer'
import { Interpreter } from '~/compiler/interpreter'
import type { Token, CompilerError, Program } from '~/compiler/types'

export const useCompiler = () => {
  const tokens = ref<Token[]>([])
  const errors = ref<CompilerError[]>([])
  const ast = ref<Program | null>(null)
  const output = ref<string[]>([])

  const run = (code: string) => {
    errors.value = []
    output.value = []
    
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
    }

    if (errors.value.length === 0 && ast.value) {
      const interpreter = new Interpreter()
      output.value = interpreter.execute(ast.value)
    } else {
      ast.value = null
    }
  }

  return {
    tokens,
    errors,
    ast,
    output,
    run
  }
}
