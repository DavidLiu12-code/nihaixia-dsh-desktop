import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))

assert.equal(manifest.type, 'module', 'package.json 需要 "type": "module"')
assert.match(manifest.version, /^\d+\.\d+\.\d+$/, 'version 必须是完整 SemVer')
assert.equal(manifest.dsh?.bundle?.patch, './cordis.patch.yml')
assert.equal(manifest.dsh?.client?.platform, 'web')
assert.ok(manifest.dsh?.client?.inject?.includes('dsh-desktop-workbenches'), 'dsh.client.inject 必须包含 dsh-desktop-workbenches')
assert.equal(manifest.exports?.['.'], './dsh/index.js')
assert.equal(manifest.exports?.['./client'], './lib/client.js')
for (const file of manifest.files ?? []) {
  assert.ok(!file.startsWith('!'), 'files 不允许排除项')
}

const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8')
assert.match(patch, /name:\s*dsh-workbench-nihaixia/, 'cordis.patch.yml 的 name 必须是包名')
assert.match(patch, /dshHomePath\('nihaixia-workbench'\)/, '数据目录必须走 dshHomePath')

const client = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
assert.match(client, /window\.__ModuleLoader__\.load\(\{/, '客户端必须是 __ModuleLoader__ 单文件模块')
assert.match(client, /id: 'dsh-workbench-nihaixia'/, '客户端 id 必须与包名一致')
assert.match(client, /customFrame: true/, '本工作台使用整页业务布局')
assert.match(client, /headerLayout: 'compact'/, '整页布局需要紧凑顶栏')
assert.match(client, /'data-dsh-workbench-toolbar': ''/, '紧凑顶栏必须标记唯一工具栏')
assert.match(client, /repository: 'https:\/\/github\.com\/DavidLiu12-code\/nihaixia-dsh-desktop'/, '注册身份必须与 package.json 的仓库一致')
assert.match(manifest.repository?.url ?? '', /github\.com\/DavidLiu12-code\/nihaixia-dsh-desktop/, 'package.json 必须声明真实仓库')

const dataRoot = await mkdtemp(join(tmpdir(), 'nh-workbench-'))
const routes = new Map()
const ctx = {
  effect(fn) { const off = fn(); return () => { if (typeof off === 'function') off() } },
  reflect: { provide() {} },
  logger: { warn() {} },
  connection: {
    fetch: {
      register(route) { routes.set(route.path, route) }
    }
  }
}

const server = await import(new URL('../dsh/index.js', import.meta.url))
assert.equal(typeof server.apply, 'function', '服务端必须导出 apply')
assert.ok(server.Config, '服务端必须导出 Schemastery Config')
server.apply(ctx, server.Config({ root: dataRoot }))

const call = async (path, init) => {
  const name = path.split('?')[0]
  const route = [...routes.entries()].find(([key]) => key.endsWith(`/${name}`))?.[1]
  assert.ok(route, `缺少接口 /${name}`)
  const request = new Request(`http://local/api/dsh-workbench-nihaixia/${path}`, init)
  const response = await route.fetch(request)
  return { status: response.status, body: await response.json() }
}

const post = (path, body) => call(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })

let library = await call('library')
assert.equal(library.status, 200)
assert.deepEqual(library.body.sources, [])

const missing = await post('source', { path: 'Z:\\不存在\\资料' })
assert.equal(missing.status, 400, '不存在的资料文件夹必须被拒绝')

const materials = process.argv[2]
if (materials) {
  const added = await post('source', { path: materials })
  assert.equal(added.status, 200, added.body?.error)
  library = added
  const modules = library.body.groups.flatMap((group) => group.modules)
  assert.ok(modules.length > 0, '资料文件夹应至少解析出 1 份资料')
  const first = modules[0]
  assert.ok(first.chapters.length > 0, '模块必须解析出章节')

  const chapter = await call(`chapter?module=${encodeURIComponent(first.id)}&index=0`)
  assert.equal(chapter.status, 200)
  assert.ok(chapter.body.html.length > 0, '章节正文不能为空')
  assert.ok(chapter.body.total >= 1)

  const unknown = await call('chapter?module=nope&index=0')
  assert.equal(unknown.status, 404)

  const search = await call(`search?q=${encodeURIComponent('桂枝')}`)
  assert.equal(search.status, 200)
  assert.ok(search.body.results.length > 0, '检索“桂枝”应命中资料')

  const note = await post('note', { key: chapter.body.key, note: '太阳病先辨表里', question: '桂枝汤禁忌？' })
  assert.equal(note.status, 200)
  const state = await call('state')
  assert.equal(state.body.notes[chapter.body.key].note, '太阳病先辨表里')

  const progress = await post('progress', { key: chapter.body.key, read: true })
  assert.equal(progress.status, 200)
  const after = await call('library')
  const done = after.body.groups.flatMap((group) => group.modules).find((item) => item.id === first.id)
  assert.ok(done.read >= 1, '已读进度必须保存')

  const cleared = await post('note', { key: chapter.body.key, note: '', question: '' })
  assert.equal(cleared.status, 200)
  const pruned = await call('state')
  assert.equal(pruned.body.notes[chapter.body.key], undefined)

  await writeFile(join(dataRoot, 'check.txt'), 'ok')
}

await rm(dataRoot, { recursive: true, force: true })
console.log(`check ok${materials ? ' (含资料解析、检索、笔记与进度)' : ''}`)
void root
