export type TokenType =
  | 'KEYWORD'       // crear, imprimir, si, sino, repetir, mientras, funcion, retornar
  | 'IDENTIFIER'    // nombre de variables
  | 'NUMBER'        // 123, 45.67
  | 'STRING'        // "hola mundo"
  | 'BOOLEAN'       // verdadero, falso
  | 'OPERATOR'      // =, +, -, *, /, >, <, ==, !=, &&, ||
  | 'PUNCTUATION'   // ( ) { } ; , 
  | 'COMMENT'       // // comentario
  | 'EOF';

export type LiteralValue = string | number | boolean | null;

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export type ASTNode =
  | Program
  | VariableDeclaration
  | FunctionDeclaration
  | IfStatement
  | WhileStatement
  | PrintStatement
  | ReturnStatement
  | ExpressionStatement
  | BlockStatement
  | BinaryExpression
  | UnaryExpression
  | Identifier
  | Literal;

export interface Program {
  type: 'Program';
  body: ASTNode[];
}

export interface VariableDeclaration {
  type: 'VariableDeclaration';
  name: string;
  value: Expression;
}

export interface FunctionDeclaration {
  type: 'FunctionDeclaration';
  name: string;
  params: string[];
  body: ASTNode[];
}

export interface IfStatement {
  type: 'IfStatement';
  condition: Expression;
  consequent: ASTNode[];
  alternate: ASTNode[] | null;
}

export interface WhileStatement {
  type: 'WhileStatement';
  condition: Expression;
  body: ASTNode[];
}

export interface PrintStatement {
  type: 'PrintStatement';
  argument: Expression;
  newline: boolean;
}

export interface ReturnStatement {
  type: 'ReturnStatement';
  argument: Expression | null;
}

export interface ExpressionStatement {
  type: 'ExpressionStatement';
  expression: Expression;
}

export interface BlockStatement {
  type: 'BlockStatement';
  body: ASTNode[];
}

export interface BinaryExpression {
  type: 'BinaryExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface UnaryExpression {
  type: 'UnaryExpression';
  operator: string;
  argument: Expression;
}

export interface Identifier {
  type: 'Identifier';
  name: string;
}

export interface Literal {
  type: 'Literal';
  value: LiteralValue;
}

export type Expression =
  | BinaryExpression
  | UnaryExpression
  | Identifier
  | Literal;

export interface CompilerError {
  line: number;
  column: number;
  message: string;
  type: 'lexical' | 'syntactic' | 'semantic';
}
