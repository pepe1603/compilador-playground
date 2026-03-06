export type TokenType =
  | 'KEYWORD'      // crear, imprimir, si, repetir
  | 'IDENTIFIER'    // nombre variables
  | 'NUMBER'       // 123, 45.67
  | 'STRING'       // "hola mundo"
  | 'BOOLEAN'      // verdadero, falso
  | 'OPERATOR'     // =, +, -, *, /, >, <
  | 'PUNCTUATION'  // ( ) { } ; ,
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface ASTNode {
  type: string;
  [key: string]: any;
}

export interface Program extends ASTNode {
  type: 'Program';
  body: ASTNode[];
}

export interface VariableDeclaration extends ASTNode {
  type: 'VariableDeclaration';
  name: string;
  value: Expression;
}

export interface Expression extends ASTNode {
  type: 'Expression';
  // ... más tipos
}

export interface CompilerError {
  line: number;
  column: number;
  message: string;
  type: 'lexical' | 'syntactic' | 'semantic';
}
