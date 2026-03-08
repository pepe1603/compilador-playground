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
  Literal,
  CompilerError
} from './types';

interface SymbolTableEntry {
  name: string;
  type: string;
  line: number;
}

export class SemanticAnalyzer {
  private errors: CompilerError[] = [];
  private symbolTable: Map<string, SymbolTableEntry> = new Map();
  private functionTable: Map<string, { params: string[], line: number }> = new Map();
  private currentFunction: string | null = null;

  analyze(ast: Program): CompilerError[] {
    this.errors = [];
    this.symbolTable.clear();
    this.functionTable.clear();

    for (const node of ast.body) {
      this.analyzeNode(node);
    }

    return this.errors;
  }

  private analyzeNode(node: ASTNode): void {
    switch (node.type) {
      case 'Program':
        this.analyzeProgram(node);
        break;
      case 'VariableDeclaration':
        this.analyzeVariableDeclaration(node);
        break;
      case 'FunctionDeclaration':
        this.analyzeFunctionDeclaration(node);
        break;
      case 'IfStatement':
        this.analyzeIfStatement(node);
        break;
      case 'WhileStatement':
        this.analyzeWhileStatement(node);
        break;
      case 'PrintStatement':
        this.analyzePrintStatement(node);
        break;
      case 'ReturnStatement':
        this.analyzeReturnStatement(node);
        break;
      case 'ExpressionStatement':
        this.analyzeExpressionStatement(node);
        break;
      case 'BlockStatement':
        this.analyzeBlockStatement(node);
        break;
    }
  }

  private analyzeProgram(node: Program): void {
    for (const stmt of node.body) {
      this.analyzeNode(stmt);
    }
  }

  private analyzeVariableDeclaration(node: VariableDeclaration): void {
    const valueType = this.getExpressionType(node.value);
    
    if (this.symbolTable.has(node.name)) {
      this.errors.push({
        line: node.value?.line ?? 1,
        column: 1,
        message: `Variable '${node.name}' ya fue declarada`,
        type: 'semantic'
      });
    } else {
      this.symbolTable.set(node.name, {
        name: node.name,
        type: valueType,
        line: node.value?.line ?? 1
      });
    }

    this.analyzeNode(node.value);
  }

  private analyzeFunctionDeclaration(node: FunctionDeclaration): void {
    if (this.functionTable.has(node.name)) {
      this.errors.push({
        line: node.body?.[0]?.line ?? 1,
        column: 1,
        message: `Función '${node.name}' ya fue declarada`,
        type: 'semantic'
      });
    } else {
      this.functionTable.set(node.name, {
        params: node.params,
        line: node.body?.[0]?.line ?? 1
      });
    }

    const previousSymbolTable = new Map(this.symbolTable);
    this.symbolTable.clear();
    this.currentFunction = node.name;

    for (const param of node.params) {
      this.symbolTable.set(param, {
        name: param,
        type: 'unknown',
        line: node.body?.[0]?.line ?? 1
      });
    }

    for (const stmt of node.body) {
      this.analyzeNode(stmt);
    }

    this.symbolTable = previousSymbolTable;
    this.currentFunction = null;
  }

  private analyzeIfStatement(node: IfStatement): void {
    this.checkConditionType(node.condition);
    
    for (const stmt of node.consequent) {
      this.analyzeNode(stmt);
    }

    if (node.alternate) {
      for (const stmt of node.alternate) {
        this.analyzeNode(stmt);
      }
    }
  }

  private analyzeWhileStatement(node: WhileStatement): void {
    this.checkConditionType(node.condition);
    
    for (const stmt of node.body) {
      this.analyzeNode(stmt);
    }
  }

  private analyzePrintStatement(node: PrintStatement): void {
    this.analyzeNode(node.argument);
  }

  private analyzeReturnStatement(node: ReturnStatement): void {
    if (node.argument) {
      this.analyzeNode(node.argument);
    }
  }

  private analyzeExpressionStatement(node: ExpressionStatement): void {
    this.analyzeNode(node.expression);
  }

  private analyzeBlockStatement(node: BlockStatement): void {
    for (const stmt of node.body) {
      this.analyzeNode(stmt);
    }
  }

  private checkConditionType(expr: any): void {
    const type = this.getExpressionType(expr);
    if (type !== 'boolean' && type !== 'unknown') {
      this.errors.push({
        line: expr?.line ?? 1,
        column: 1,
        message: `La condición debe ser de tipo boolean, encontrado: ${type}`,
        type: 'semantic'
      });
    }
  }

  private getExpressionType(expr: any): string {
    if (!expr) return 'unknown';

    switch (expr.type) {
      case 'Literal':
        if (typeof expr.value === 'number') return 'number';
        if (typeof expr.value === 'string') return 'string';
        if (typeof expr.value === 'boolean') return 'boolean';
        return 'unknown';

      case 'Identifier':
        const symbol = this.symbolTable.get(expr.name);
        if (symbol) return symbol.type;
        this.errors.push({
          line: expr.line ?? 1,
          column: 1,
          message: `Variable '${expr.name}' no ha sido declarada`,
          type: 'semantic'
        });
        return 'unknown';

      case 'BinaryExpression':
        const leftType = this.getExpressionType(expr.left);
        const rightType = this.getExpressionType(expr.right);

        if (['+', '-', '*', '/'].includes(expr.operator)) {
          if (leftType === 'string' || rightType === 'string') return 'string';
          return 'number';
        }
        
        if (['==', '!=', '>', '<', '>=', '<='].includes(expr.operator)) {
          return 'boolean';
        }
        
        if (['&&', '||'].includes(expr.operator)) {
          return 'boolean';
        }

        return 'unknown';

      case 'UnaryExpression':
        if (expr.operator === '!') return 'boolean';
        return this.getExpressionType(expr.argument);

      default:
        return 'unknown';
    }
  }
}
