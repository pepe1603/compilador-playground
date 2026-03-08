import type { 
  ASTNode, 
  Program, 
  VariableDeclaration, 
  FunctionDeclaration,
  IfStatement,
  WhileStatement,
  PrintStatement,
  ReturnStatement,
  ExpressionStatement,
  BlockStatement,
  BinaryExpression,
  UnaryExpression,
  Identifier,
  Literal
} from './types';

export class Interpreter {
  private globals: Map<string, any> = new Map();
  private locals: Map<string, any> = new Map();
  private functions: Map<string, { params: string[], body: ASTNode[] }> = new Map();
  private output: string[] = [];
  private scope: Map<string, any> = new Map();

  constructor() {
    this.globals = new Map();
    this.scope = this.globals;
  }

  execute(ast: Program): string[] {
    this.output = [];
    this.globals = new Map();
    this.functions = new Map();
    this.scope = this.globals;

    for (const node of ast.body) {
      this.executeNode(node);
    }

    return this.output;
  }

  private executeNode(node: ASTNode): any {
    switch (node.type) {
      case 'Program':
        return this.executeProgram(node as Program);
      case 'VariableDeclaration':
        return this.executeVariableDeclaration(node as VariableDeclaration);
      case 'FunctionDeclaration':
        return this.executeFunctionDeclaration(node as FunctionDeclaration);
      case 'IfStatement':
        return this.executeIfStatement(node as IfStatement);
      case 'WhileStatement':
        return this.executeWhileStatement(node as WhileStatement);
      case 'PrintStatement':
        return this.executePrintStatement(node as PrintStatement);
      case 'ReturnStatement':
        return this.executeReturnStatement(node as ReturnStatement);
      case 'ExpressionStatement':
        return this.executeExpressionStatement(node as ExpressionStatement);
      case 'BlockStatement':
        return this.executeBlockStatement(node as BlockStatement);
      default:
        return null;
    }
  }

  private executeProgram(node: Program): any {
    for (const stmt of node.body) {
      const result = this.executeNode(stmt);
      if (result === 'return') return result;
    }
    return null;
  }

  private executeVariableDeclaration(node: VariableDeclaration): any {
    const value = this.evaluateExpression(node.value);
    this.scope.set(node.name, value);
    return null;
  }

  private executeFunctionDeclaration(node: FunctionDeclaration): any {
    this.functions.set(node.name, {
      params: node.params,
      body: node.body
    });
    return null;
  }

  private executeIfStatement(node: IfStatement): any {
    const condition = this.evaluateExpression(node.condition);
    
    if (this.isTruthy(condition)) {
      for (const stmt of node.consequent) {
        const result = this.executeNode(stmt);
        if (result === 'return') return result;
      }
    } else if (node.alternate) {
      for (const stmt of node.alternate) {
        const result = this.executeNode(stmt);
        if (result === 'return') return result;
      }
    }
    return null;
  }

  private executeWhileStatement(node: WhileStatement): any {
    while (this.isTruthy(this.evaluateExpression(node.condition))) {
      for (const stmt of node.body) {
        const result = this.executeNode(stmt);
        if (result === 'return') return result;
      }
    }
    return null;
  }

  private executePrintStatement(node: PrintStatement): any {
    const value = this.evaluateExpression(node.argument);
    this.output.push(String(value));
    return null;
  }

  private executeReturnStatement(node: ReturnStatement): any {
    if (node.argument) {
      return this.evaluateExpression(node.argument);
    }
    return null;
  }

  private executeExpressionStatement(node: ExpressionStatement): any {
    return this.evaluateExpression(node.expression);
  }

  private executeBlockStatement(node: BlockStatement): any {
    const previousScope = this.scope;
    this.scope = new Map(this.scope);

    for (const stmt of node.body) {
      const result = this.executeNode(stmt);
      if (result === 'return') {
        this.scope = previousScope;
        return 'return';
      }
    }

    this.scope = previousScope;
    return null;
  }

  private evaluateExpression(expr: any): any {
    if (!expr) return null;

    switch (expr.type) {
      case 'Literal':
        return expr.value;

      case 'Identifier':
        if (this.scope.has(expr.name)) {
          return this.scope.get(expr.name);
        }
        return null;

      case 'BinaryExpression':
        return this.evaluateBinaryExpression(expr);

      case 'UnaryExpression':
        return this.evaluateUnaryExpression(expr);

      default:
        return null;
    }
  }

  private evaluateBinaryExpression(expr: BinaryExpression): any {
    const left = this.evaluateExpression(expr.left);
    const right = this.evaluateExpression(expr.right);

    switch (expr.operator) {
      case '+':
        if (typeof left === 'string' || typeof right === 'string') {
          return String(left) + String(right);
        }
        return Number(left) + Number(right);
      case '-':
        return Number(left) - Number(right);
      case '*':
        return Number(left) * Number(right);
      case '/':
        return Number(left) / Number(right);
      case '==':
        return left === right;
      case '!=':
        return left !== right;
      case '>':
        return Number(left) > Number(right);
      case '<':
        return Number(left) < Number(right);
      case '>=':
        return Number(left) >= Number(right);
      case '<=':
        return Number(left) <= Number(right);
      case '&&':
        return this.isTruthy(left) && this.isTruthy(right);
      case '||':
        return this.isTruthy(left) || this.isTruthy(right);
      default:
        return null;
    }
  }

  private evaluateUnaryExpression(expr: UnaryExpression): any {
    const argument = this.evaluateExpression(expr.argument);

    switch (expr.operator) {
      case '-':
        return -Number(argument);
      case '!':
        return !this.isTruthy(argument);
      default:
        return null;
    }
  }

  private isTruthy(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value !== '';
    return true;
  }
}
