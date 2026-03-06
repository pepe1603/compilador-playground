import type { Token, ASTNode, Program, Expression, CompilerError } from './types';

export class Parser {
  private tokens: Token[];
  private position: number = 0;
  private errors: CompilerError[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): { ast: Program | null; errors: CompilerError[] } {
    const body: ASTNode[] = [];

    while (!this.isAtEnd()) {
      try {
        const stmt = this.parseStatement();
        if (stmt) body.push(stmt);
      } catch (e) {
        if (e instanceof Error && e.message === 'Parse error') {
          this.synchronize();
        }
      }
    }

    return {
      ast: { type: 'Program', body },
      errors: this.errors
    };
  }

  private current(): Token {
    return this.tokens[this.position] ?? { type: 'EOF', value: '', line: 0, column: 0 };
  }

  private peek(offset: number = 1): Token {
    return this.tokens[this.position + offset] ?? { type: 'EOF', value: '', line: 0, column: 0 };
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.position++;
    return this.tokens[this.position - 1] ?? this.current();
  }

  private isAtEnd(): boolean {
    return this.current().type === 'EOF';
  }

  private check(type: string): boolean {
    return this.current().type === type;
  }

  private match(...types: string[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private expect(type: string, message: string): Token {
    if (this.check(type)) return this.advance();
    this.errors.push({
      line: this.current().line,
      column: this.current().column,
      message,
      type: 'syntactic'
    });
    throw new Error('Parse error');
  }

  private parseStatement(): ASTNode {
    if (this.match('KEYWORD')) {
      const prev = this.tokens[this.position - 1] ?? { value: '' };
      
      if (prev.value === 'crear') {
        return this.parseVariableDeclaration();
      }
      if (prev.value === 'imprimir' || prev.value === 'imprimirnl') {
        return this.parsePrintStatement(prev.value === 'imprimirnl');
      }
      if (prev.value === 'si') {
        return this.parseIfStatement();
      }
      if (prev.value === 'mientras') {
        return this.parseWhileStatement();
      }
      if (prev.value === 'funcion') {
        return this.parseFunctionDeclaration();
      }
      if (prev.value === 'retornar') {
        return this.parseReturnStatement();
      }
    }

    if (this.check('PUNCTUATION') && this.current().value === '{') {
      const block = this.parseBlock();
      return { type: 'BlockStatement', body: block };
    }

    const expr = this.parseExpression();
    this.expect('PUNCTUATION', `Expected ';' after expression`);
    return { type: 'ExpressionStatement', expression: expr };
  }

  private parseVariableDeclaration(): ASTNode {
    const nameToken = this.expect('IDENTIFIER', 'Expected variable name');
    this.expect('OPERATOR', "Expected '=' after variable name");
    const value = this.parseExpression();
    this.expect('PUNCTUATION', "Expected ';' after variable declaration");
    
    return {
      type: 'VariableDeclaration',
      name: nameToken.value,
      value
    };
  }

  private parsePrintStatement(newline: boolean): ASTNode {
    const argument = this.parseExpression();
    this.expect('PUNCTUATION', "Expected ';' after print statement");
    return {
      type: 'PrintStatement',
      argument,
      newline
    };
  }

  private parseIfStatement(): ASTNode {
    this.expect('PUNCTUATION', "Expected '(' after 'si'");
    const condition = this.parseExpression();
    this.expect('PUNCTUATION', "Expected ')' after condition");
    
    const consequent = this.parseBlock();
    let alternate: ASTNode[] | null = null;

    if (this.match('KEYWORD') && (this.tokens[this.position - 1] ?? { value: '' }).value === 'sino') {
      alternate = this.parseBlock();
    }

    return {
      type: 'IfStatement',
      condition,
      consequent,
      alternate
    };
  }

  private parseWhileStatement(): ASTNode {
    this.expect('PUNCTUATION', "Expected '(' after 'mientras'");
    const condition = this.parseExpression();
    this.expect('PUNCTUATION', "Expected ')' after condition");
    const body = this.parseBlock();

    return {
      type: 'WhileStatement',
      condition,
      body
    };
  }

  private parseFunctionDeclaration(): ASTNode {
    const nameToken = this.expect('IDENTIFIER', 'Expected function name');
    this.expect('PUNCTUATION', "Expected '(' after function name");
    
    const params: string[] = [];
    while (!this.check('PUNCTUATION') || this.current().value !== ')') {
      if (params.length > 0) {
        this.expect('PUNCTUATION', 'Expected , between parameters');
      }
      const param = this.expect('IDENTIFIER', 'Expected parameter name');
      params.push(param.value);
    }
    this.expect('PUNCTUATION', "Expected ')' after parameters");

    const body = this.parseBlock();

    return {
      type: 'FunctionDeclaration',
      name: nameToken.value,
      params,
      body
    };
  }

  private parseReturnStatement(): ASTNode {
    let argument: Expression | null = null;
    if (!this.check('PUNCTUATION') || this.current().value !== ';') {
      argument = this.parseExpression();
    }
    this.expect('PUNCTUATION', "Expected ';' after return statement");
    return { type: 'ReturnStatement', argument };
  }

  private parseBlock(): ASTNode[] {
    this.expect('PUNCTUATION', "Expected '{'");
    const body: ASTNode[] = [];

    while (!this.check('PUNCTUATION') || this.current().value !== '}') {
      if (this.isAtEnd()) {
        this.errors.push({
          line: this.current().line,
          column: this.current().column,
          message: "Expected '}'",
          type: 'syntactic'
        });
        break;
      }
      try {
        const stmt = this.parseStatement();
        if (stmt) body.push(stmt);
      } catch (e) {
        this.synchronize();
      }
    }

    this.expect('PUNCTUATION', "Expected '}'");
    return body;
  }

  private parseExpression(): Expression {
    return this.parseAssignment();
  }

  private parseAssignment(): Expression {
    const left = this.parseOr();
    
    if (this.match('OPERATOR') && (this.tokens[this.position - 1] ?? { value: '' }).value === '=') {
      const right = this.parseAssignment();
      return {
        type: 'BinaryExpression',
        operator: '=',
        left,
        right
      };
    }

    return left;
  }

  private parseOr(): Expression {
    let left = this.parseAnd();

    while (this.match('KEYWORD') && (this.tokens[this.position - 1] ?? { value: '' }).value === 'o') {
      const right = this.parseAnd();
      left = { type: 'BinaryExpression', operator: '||', left, right };
    }

    return left;
  }

  private parseAnd(): Expression {
    let left = this.parseEquality();

    while (this.match('KEYWORD') && (this.tokens[this.position - 1] ?? { value: '' }).value === 'y') {
      const right = this.parseEquality();
      left = { type: 'BinaryExpression', operator: '&&', left, right };
    }

    return left;
  }

  private parseEquality(): Expression {
    let left = this.parseComparison();

    while (this.match('OPERATOR') && ['==', '!='].includes((this.tokens[this.position - 1] ?? { value: '' }).value)) {
      const operator = (this.tokens[this.position - 1] ?? { value: '' }).value;
      const right = this.parseComparison();
      left = { type: 'BinaryExpression', operator, left, right };
    }

    return left;
  }

  private parseComparison(): Expression {
    let left = this.parseAdditive();

    while (this.match('OPERATOR') && ['>', '<', '>=', '<='].includes((this.tokens[this.position - 1] ?? { value: '' }).value)) {
      const operator = (this.tokens[this.position - 1] ?? { value: '' }).value;
      const right = this.parseAdditive();
      left = { type: 'BinaryExpression', operator, left, right };
    }

    return left;
  }

  private parseAdditive(): Expression {
    let left = this.parseMultiplicative();

    while (this.match('OPERATOR') && ['+', '-'].includes((this.tokens[this.position - 1] ?? { value: '' }).value)) {
      const operator = (this.tokens[this.position - 1] ?? { value: '' }).value;
      const right = this.parseMultiplicative();
      left = { type: 'BinaryExpression', operator, left, right };
    }

    return left;
  }

  private parseMultiplicative(): Expression {
    let left = this.parseUnary();

    while (this.match('OPERATOR') && ['*', '/'].includes((this.tokens[this.position - 1] ?? { value: '' }).value)) {
      const operator = (this.tokens[this.position - 1] ?? { value: '' }).value;
      const right = this.parseUnary();
      left = { type: 'BinaryExpression', operator, left, right };
    }

    return left;
  }

  private parseUnary(): Expression {
    if (this.match('OPERATOR') && ['-', '!'].includes((this.tokens[this.position - 1] ?? { value: '' }).value)) {
      const operator = (this.tokens[this.position - 1] ?? { value: '' }).value;
      const argument = this.parseUnary();
      return { type: 'UnaryExpression', operator, argument };
    }

    if (this.match('KEYWORD') && (this.tokens[this.position - 1] ?? { value: '' }).value === 'no') {
      const argument = this.parseUnary();
      return { type: 'UnaryExpression', operator: '!', argument };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): Expression {
    const token = this.current();

    if (this.match('NUMBER')) {
      return { type: 'Literal', value: parseFloat(token.value) };
    }

    if (this.match('STRING')) {
      return { type: 'Literal', value: token.value.slice(1, -1) };
    }

    if (this.match('BOOLEAN')) {
      return { type: 'Literal', value: token.value === 'true' };
    }

    if (this.match('IDENTIFIER')) {
      return { type: 'Identifier', name: token.value };
    }

    if (this.match('PUNCTUATION') && token.value === '(') {
      const expr = this.parseExpression();
      this.expect('PUNCTUATION', "Expected ')' after expression");
      return expr;
    }

    this.errors.push({
      line: token.line,
      column: token.column,
      message: `Unexpected token: ${token.value}`,
      type: 'syntactic'
    });

    return { type: 'Literal', value: null };
  }

  private synchronize(): void {
    while (!this.isAtEnd()) {
      if (this.check('PUNCTUATION') && this.current().value === ';') {
        this.advance();
        return;
      }
      if (this.check('KEYWORD')) {
        const keywords = ['crear', 'si', 'mientras', 'funcion', 'retornar', 'imprimir'];
        if (keywords.includes(this.current().value)) {
          return;
        }
      }
      this.advance();
    }
  }
}
