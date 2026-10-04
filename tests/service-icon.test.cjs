const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const { renderToStaticMarkup } = require('react-dom/server')
test('server-rendered icons preserve CMS names, sizing and unknown-name fallback', () => {
  const exports = {}
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('components/service-icon.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText, { exports, require })
  const render = name => renderToStaticMarkup(exports.default({ name }))
  assert.match(render('Code2'), /<svg/)
  assert.match(render('Code2'), /lg:w-8 lg:h-8/)
  assert.notEqual(render('Globe'), render('Code2'))
  assert.equal(render('unknown-icon-name'), render('Sparkles'))
})
