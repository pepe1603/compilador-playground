import { Token, TokenType, CompilerError } from './types';

export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private errors: CompilerError[] = [];

  // Palabras clave en español
  private keywords = new Set(['crear', 'imprimir', 'si', 'sino', 'repetir', 'verdadero', 'falso']);

  constructor(input: string) {
    this.input = input;
  }

  tokenize(): { tokens: Token[], errors: CompilerError[] } {
    const tokens: Token[] = [];

    while (this.position < this.input.length) {
      const char = this.input[this.position];

      // Saltar espacios
      if (/\s/.test(char)) {
        this.handleWhitespace();
        continue;
      }

      // Números
      if (/\d/.test(char)) {
        tokens.push(this.readNumber());
        continue;
      }

      // Strings
      if (char === '"') {
        tokens.push(this.readString());
        continue;
      }

      // Identificadores y keywords
      if (/[a-zA-Z_]/ .test(char)) {
        tokens.push(this.readIdentifier());
        continue;
      }

      // Operadores y puntuación
      if (this.isOperator(char)) {
        tokens.push(this.readOperator());
        continue;
      }

      // Si llegamos aquí, es un caracter no reconocido
      this.errors.push({
        line: this.line,
        column: this.column,
        message: `Caracter no reconocido: '${char}'`,
        type: 'lexical'
      });
      this.position++;
      this.column++;
    }

    // Agregar token EOF
    tokens.push({
      type: 'EOF',
      value: 'EOF',
      line: this.line,
      column: this.column
    });

    return { tokens, errors: this.errors };
  }

  private readNumber(): Token {
    const startColumn = this.column;
    let value = '';

    while (this.position < this.input.length && /[\d.]/.test(this.input[this.position])) {
      value += this.input[this.position];
      this.position++;
      this.column++;
    }

    return {
      type: 'NUMBER',
      value,
      line: this.line,
      column: startColumn
    };
  }

  private readString(): Token {
    const startColumn = this.column;
    let value = '"';
    this.position++;
    this.column++;

    while (this.position < this.input.length && this.input[this.position] !== '"') {
      value += this.input[this.position];
      this.position++;
      this.column++;
    }

    if (this.position < this.input.length) {
      value += '"';
      this.position++;
      this.column++;
    }

    return {
      type: 'STRING',
      value,
      line: this.line,
      column: startColumn
    };
  }

  private readIdentifier(): Token {
    const startColumn = this.column;
    let value = '';

    while (this.position < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.position])) {
      value += this.input[this.position];
      this.position++;
      this.column++;
    }

    const type = this.keywords.has(value) ? 'KEYWORD' : 'IDENTIFIER';

    return {
      type,
      value,
      line: this.line,
      column: startColumn
    };
  }

  private readOperator(): Token {
    const startColumn = this.column;
    let value = this.input[this.position];

    // Operadores de dos caracteres
    if (value === '=' && this.input[this.position + 1] === '=') {
      value = '==';
      this.position += 2;
      this.column += 2;
    } else if (value === '!' && this.input[this.position + 1] === '=') {
      value = '!=';
      this.position += 2;
      this.column += 2;
    } else {
      this.position++;
      this.column++;
    }

    return {
      type: 'OPERATOR',
      value,
      line: this.line,
      column: startColumn
    };
  }

  private handleWhitespace(): void {
    while (this.position < this.input.length && /\s/.test(this.input[this.position])) {
      if (this.input[this.position] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.position++;
    }
  }

  private isOperator(char: string): boolean {
    return ['=', '+', '-', '*', '/', '>', '<', '!', '(', ')', '{', '}', ';', ','].includes(char);
  }
}
