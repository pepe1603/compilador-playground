import type { Token, TokenType, CompilerError } from './types';

export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private errors: CompilerError[] = [];

  private keywords = new Set([
    'crear', 'imprimir', 'si', 'sino', 'repetir', 
    'mientras', 'funcion', 'retornar', 'verdadero', 
    'falso', 'imprimirnl', 'y', 'o', 'no'
  ]);

  constructor(input: string) {
    this.input = input;
  }

  tokenize(): { tokens: Token[], errors: CompilerError[] } {
    const tokens: Token[] = [];

    while (this.position < this.input.length) {
      const char = this.charAt(this.position);

      if (char === '\n') {
        this.newLine();
        continue;
      }

      if (/\s/.test(char)) {
        this.column++;
        this.position++;
        continue;
      }

      if (char === '/' && this.peek(1) === '/') {
        tokens.push(this.readComment());
        continue;
      }

      if (/\d/.test(char)) {
        tokens.push(this.readNumber());
        continue;
      }

      if (char === '"' || char === "'") {
        tokens.push(this.readString(char));
        continue;
      }

      if (/[a-zA-Z_]/.test(char)) {
        tokens.push(this.readIdentifierOrKeyword());
        continue;
      }

      if (this.isOperatorStart(char)) {
        tokens.push(this.readOperator());
        continue;
      }

      if (this.isPunctuation(char)) {
        tokens.push(this.readPunctuation());
        continue;
      }

      this.errors.push({
        line: this.line,
        column: this.column,
        message: `Caracter no reconocido: '${char}'`,
        type: 'lexical'
      });
      this.position++;
      this.column++;
    }

    tokens.push({
      type: 'EOF',
      value: 'EOF',
      line: this.line,
      column: this.column
    });

    return { tokens, errors: this.errors };
  }

  private newLine(): void {
    this.line++;
    this.column = 1;
    this.position++;
  }

  private readComment(): Token {
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';

    this.position += 2;
    this.column += 2;

    while (this.position < this.input.length && this.input[this.position] !== '\n') {
      value += this.input[this.position];
      this.position++;
      this.column++;
    }

    return { type: 'COMMENT', value, line: startLine, column: startColumn };
  }

  private readNumber(): Token {
    const startColumn = this.column;
    let value = '';
    let hasDecimal = false;

    while (this.position < this.input.length) {
      const char = this.charAt(this.position);
      if (/\d/.test(char)) {
        value += char;
        this.position++;
        this.column++;
      } else if (char === '.' && !hasDecimal) {
        hasDecimal = true;
        value += char;
        this.position++;
        this.column++;
      } else {
        break;
      }
    }

    return { type: 'NUMBER', value, line: this.line, column: startColumn };
  }

  private readString(quote: string): Token {
    const startColumn = this.column;
    let value = quote;
    this.position++;
    this.column++;

    while (this.position < this.input.length && this.input[this.position] !== quote) {
      if (this.input[this.position] === '\n') {
        this.errors.push({
          line: this.line,
          column: this.column,
          message: 'String no cerrado',
          type: 'lexical'
        });
        break;
      }
      value += this.input[this.position];
      this.position++;
      this.column++;
    }

    if (this.position < this.input.length) {
      value += quote;
      this.position++;
      this.column++;
    }

    return { type: 'STRING', value, line: this.line, column: startColumn };
  }

  private readIdentifierOrKeyword(): Token {
    const startColumn = this.column;
    let value = '';

    while (this.position < this.input.length && /[a-zA-Z0-9_]/.test(this.charAt(this.position))) {
      value += this.charAt(this.position);
      this.position++;
      this.column++;
    }

    const type = this.keywords.has(value) ? 'KEYWORD' : 'IDENTIFIER';

    if (value === 'verdadero') {
      return { type: 'BOOLEAN', value: 'true', line: this.line, column: startColumn };
    }
    if (value === 'falso') {
      return { type: 'BOOLEAN', value: 'false', line: this.line, column: startColumn };
    }

    return { type, value, line: this.line, column: startColumn };
  }

  private readOperator(): Token {
    const startColumn = this.column;
    let value = this.charAt(this.position);

    const twoCharOps: Record<string, string> = {
      '==': '==', '!=': '!=', '&&': '&&', '||': '||',
      '<=': '<=', '>=': '>=', '+=': '+=', '-=': '-=',
      '*=': '*=', '/=': '/='
    };

    const twoChar = value + (this.input[this.position + 1] || '');
    if (twoCharOps[twoChar]) {
      value = twoChar;
      this.position += 2;
      this.column += 2;
    } else {
      this.position++;
      this.column++;
    }

    return { type: 'OPERATOR', value, line: this.line, column: startColumn };
  }

  private readPunctuation(): Token {
    const token: Token = {
      type: 'PUNCTUATION',
      value: this.charAt(this.position),
      line: this.line,
      column: this.column
    };
    this.position++;
    this.column++;
    return token;
  }

  private peek(offset: number): string {
    return this.input[this.position + offset] ?? '';
  }

  private charAt(pos: number): string {
    return this.input[pos] ?? '';
  }

  private isOperatorStart(char: string): boolean {
    return ['=', '+', '-', '*', '/', '>', '<', '!', '&', '|'].includes(char);
  }

  private isPunctuation(char: string): boolean {
    return ['(', ')', '{', '}', '[', ']', ';', ',', ':'].includes(char);
  }
}
