import * as Lint from 'tslint'
import * as ts from 'typescript'
import * as tsutils from 'tsutils'

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'scss import must be at the end'

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk)
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  const scssRegex = new RegExp('.scss')

  const imports = ctx.sourceFile.statements.filter((statement) => tsutils.isImportDeclaration(statement))

  const hasScssImport = imports.some((importNode) => scssRegex.test(importNode.getText()))

  if (hasScssImport) {
    const endImport = imports[imports.length - 1]
    if (!scssRegex.test(endImport.getText())) {
      ctx.addFailure(endImport.getStart(), endImport.getEnd(), Rule.FAILURE_STRING)
    }
  }
}
