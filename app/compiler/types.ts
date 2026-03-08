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

export interface BaseNode {
  line?: number;
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

export interface Program extends BaseNode {
  type: 'Program';
  body: ASTNode[];
}

export interface VariableDeclaration extends BaseNode {
  type: 'VariableDeclaration';
  name: string;
  value: Expression;
}

export interface FunctionDeclaration extends BaseNode {
  type: 'FunctionDeclaration';
  name: string;
  params: string[];
  body: ASTNode[];
}

export interface IfStatement extends BaseNode {
  type: 'IfStatement';
  condition: Expression;
  consequent: ASTNode[];
  alternate: ASTNode[] | null;
}

export interface WhileStatement extends BaseNode {
  type: 'WhileStatement';
  condition: Expression;
  body: ASTNode[];
}

export interface PrintStatement extends BaseNode {
  type: 'PrintStatement';
  argument: Expression;
  newline: boolean;
}

export interface ReturnStatement extends BaseNode {
  type: 'ReturnStatement';
  argument: Expression | null;
}

export interface ExpressionStatement extends BaseNode {
  type: 'ExpressionStatement';
  expression: Expression;
}

export interface BlockStatement extends BaseNode {
  type: 'BlockStatement';
  body: ASTNode[];
}

export interface BinaryExpression extends BaseNode {
  type: 'BinaryExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface UnaryExpression extends BaseNode {
  type: 'UnaryExpression';
  operator: string;
  argument: Expression;
}

export interface Identifier extends BaseNode {
  type: 'Identifier';
  name: string;
}

export interface Literal extends BaseNode {
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
