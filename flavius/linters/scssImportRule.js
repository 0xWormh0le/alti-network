'use strict'
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b
          }) ||
        function (d, b) {
          for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]
        }
      return extendStatics(d, b)
    }
    return function (d, b) {
      if (typeof b !== 'function' && b !== null)
        throw new TypeError('Class extends value ' + String(b) + ' is not a constructor or null')
      extendStatics(d, b)
      function __() {
        this.constructor = d
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __())
    }
  })()
exports.__esModule = true
exports.Rule = void 0
var Lint = require('tslint')
var tsutils = require('tsutils')
var Rule = /** @class */ (function (_super) {
  __extends(Rule, _super)
  function Rule() {
    return (_super !== null && _super.apply(this, arguments)) || this
  }
  Rule.prototype.apply = function (sourceFile) {
    return this.applyWithFunction(sourceFile, walk)
  }
  Rule.FAILURE_STRING = 'scss import must be at the end'
  return Rule
})(Lint.Rules.AbstractRule)
exports.Rule = Rule
function walk(ctx) {
  var scssRegex = new RegExp('.scss')
  var imports = ctx.sourceFile.statements.filter(function (statement) {
    return tsutils.isImportDeclaration(statement)
  })
  var hasScssImport = imports.some(function (importNode) {
    return scssRegex.test(importNode.getText())
  })
  if (hasScssImport) {
    var endImport = imports[imports.length - 1]
    if (!scssRegex.test(endImport.getText())) {
      ctx.addFailure(endImport.getStart(), endImport.getEnd(), Rule.FAILURE_STRING)
    }
  }
}
