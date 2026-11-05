import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(new URL('../node_modules/', import.meta.url))

let definition = null
globalThis.window = {
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  __ModuleLoader__: { load(value) { definition = value } }
}
globalThis.document = { createElement: () => ({ setAttribute() {}, style: {}, remove() {} }), head: { appendChild() {} } }

await import(new URL('../lib/client.js', import.meta.url))

assert.ok(definition, '客户端必须通过 window.__ModuleLoader__.load 注册')
assert.equal(definition.id, 'dsh-workbench-nihaixia')

const React = require('react')
const ReactDOMServer = require('react-dom/server')

let registered = null
const ctx = {
  effect(fn) { const off = fn(); return () => { if (typeof off === 'function') off() } },
  get() { return undefined },
  desktopWorkbenches: {
    register(descriptor, Component) {
      registered = { descriptor, Component }
      return () => {}
    }
  }
}

const api = definition.factory((name) => require(name))
assert.equal(typeof api.apply, 'function')
assert.deepEqual(api.inject, ['desktopWorkbenches'])
api.apply(ctx)

assert.ok(registered, '必须调用 desktopWorkbenches.register')
assert.equal(registered.descriptor.title, '倪海厦自学中医工作台')
assert.equal(registered.descriptor.customFrame, true)
assert.equal(registered.descriptor.headerLayout, 'compact')
assert.equal(registered.descriptor.repository, 'https://github.com/DavidLiu12-code/nihaixia-dsh-desktop', '注册身份必须与仓库一致')

const element = React.createElement(registered.Component, {
  service: { ctx, currentSession: () => undefined, isActive: () => true, ensureSession: async () => 'session' },
  entry: registered.descriptor,
  active: true,
  conversation: null
})
const markup = ReactDOMServer.renderToStaticMarkup(element)
assert.match(markup, /data-dsh-workbench-toolbar=""/, '紧凑布局必须在同一文档标记唯一工具栏')
assert.match(markup, /倪海厦自学中医工作台/)
assert.match(markup, /搜方剂/, '工具栏应包含检索入口')
assert.match(markup, /正在读取资料/, '首次渲染应给出加载态而不是报错')
assert.equal((markup.match(/data-dsh-workbench-toolbar/g) ?? []).length, 1, '工具栏标记必须唯一')

console.log('client render ok:', markup.length, 'chars')
