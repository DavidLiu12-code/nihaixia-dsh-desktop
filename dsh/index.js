import Schema from '@deepseek-ai/schemastery'
import { readFile, readdir, stat, mkdir, writeFile, rename } from 'node:fs/promises'
import { dirname, join } from 'node:path'

export const name = 'dsh-workbench-nihaixia'
export const inject = ['connection']

export const Config = Schema.object({
  root: Schema.string().required()
})

const API = '/api/dsh-workbench-nihaixia'
const MAX_FILE_BYTES = 3 * 1024 * 1024
const SKIP_DIRS = new Set(['node_modules', '.git', '.github', '.cache', 'dist', 'build', 'assets', 'images'])
const GROUP_LABELS = [
  ['modules', '讲义'],
  ['cases', '医案'],
  ['references', '速查'],
  ['docs', '说明'],
  ['other', '其他']
]

/* ------------------------------------------------------------------ state */

function emptyState() {
  return { version: 1, sources: [], progress: {}, notes: {}, lastOpened: null }
}

function createStore(root) {
  const file = join(root, 'state.json')
  let cache = null
  let writing = Promise.resolve()

  const normalize = (value) => {
    const base = emptyState()
    if (!value || typeof value !== 'object') return base
    return {
      version: 1,
      sources: Array.isArray(value.sources) ? value.sources.filter((item) => typeof item === 'string') : [],
      progress: value.progress && typeof value.progress === 'object' ? value.progress : {},
      notes: value.notes && typeof value.notes === 'object' ? value.notes : {},
      lastOpened: typeof value.lastOpened === 'string' ? value.lastOpened : null
    }
  }

  const read = async () => {
    if (cache) return cache
    try {
      cache = normalize(JSON.parse(await readFile(file, 'utf8')))
    } catch {
      cache = emptyState()
    }
    return cache
  }

  const write = async (next) => {
    cache = next
    writing = writing.then(async () => {
      await mkdir(dirname(file), { recursive: true })
      const temporary = `${file}.tmp`
      await writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
      await rename(temporary, file)
    }).catch(() => {})
    return writing
  }

  const update = async (mutate) => {
    const current = await read()
    const next = normalize(JSON.parse(JSON.stringify(current)))
    mutate(next)
    await write(next)
    return next
  }

  return { read, update, file }
}

/* --------------------------------------------------------------- library */

async function walk(root, relative = '', depth = 0, out = []) {
  if (depth > 4) return out
  const entries = await readdir(join(root, relative), { withFileTypes: true }).catch(() => [])
  for (const entry of entries) {
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name.toLowerCase())) continue
    const rel = relative ? `${relative}/${entry.name}` : entry.name
    if (entry.isDirectory()) await walk(root, rel, depth + 1, out)
    else if (/\.md$/i.test(entry.name)) out.push(rel)
  }
  return out
}

const HEADING = /^##\s+(.+?)\s*$/
const TITLE = /^#\s+(.+?)\s*$/

function parseFile(rel, text, sourceIndex) {
  const lines = text.split(/\r?\n/)
  const titleLine = lines.find((line) => TITLE.test(line))
  const title = titleLine ? titleLine.replace(TITLE, '$1').trim() : rel.split('/').pop().replace(/\.md$/i, '')
  const summary = lines
    .filter((line) => /^>\s*\*\*/.test(line) || /^>\s*(内容|用途)/.test(line))
    .slice(0, 2)
    .map((line) => line.replace(/^>\s*/, '').replace(/\*\*/g, '').trim())
    .join(' / ')
  const chapters = []
  lines.forEach((line, index) => {
    const match = line.match(HEADING)
    if (match) chapters.push({ index: chapters.length, title: match[1].trim(), line: index })
  })
  if (chapters.length === 0) chapters.push({ index: 0, title: '全文', line: 0 })
  const groupKey = rel.includes('/') ? rel.split('/')[0] : 'other'
  return {
    id: `${sourceIndex}:${rel}`,
    source: sourceIndex,
    file: rel,
    title,
    summary,
    group: groupKey,
    chapters: chapters.map(({ index, title: chapterTitle }) => ({ index, title: chapterTitle }))
  }
}

function sliceChapter(lines, chapterIndex) {
  const headings = []
  lines.forEach((line, index) => {
    const match = line.match(HEADING)
    if (match) headings.push({ index, title: match[1].trim() })
  })
  if (headings.length === 0) return lines.join('\n')
  const from = headings[chapterIndex]?.index ?? headings[0].index
  const to = chapterIndex + 1 < headings.length ? headings[chapterIndex + 1].index : lines.length
  return lines.slice(from, to).join('\n')
}

const cache = { key: '', at: 0, groups: [], files: [] }

async function readLibrary(store) {
  const state = await store.read()
  const key = JSON.stringify(state.sources)
  if (cache.key === key && Date.now() - cache.at < 5000) return cache
  const groups = GROUP_LABELS.map(([id, label]) => ({ id, label, modules: [] }))
  const byId = new Map(groups.map((group) => [group.id, group]))
  const files = []
  for (let sourceIndex = 0; sourceIndex < state.sources.length; sourceIndex += 1) {
    const root = state.sources[sourceIndex]
    const exists = await stat(root).then((info) => info.isDirectory(), () => false)
    if (!exists) continue
    const rels = (await walk(root)).sort((a, b) => a.localeCompare(b, 'zh'))
    for (const rel of rels) {
      const info = await stat(join(root, rel)).catch(() => null)
      if (!info || info.size > MAX_FILE_BYTES) continue
      const text = await readFile(join(root, rel), 'utf8').catch(() => '')
      if (!text.trim()) continue
      const module = parseFile(rel, text, sourceIndex)
      const group = byId.get(module.group) ?? byId.get('other')
      group.modules.push(module)
      files.push({ module, root, text })
    }
  }
  const visible = groups.filter((group) => group.modules.length > 0)
  Object.assign(cache, { key, at: Date.now(), groups: visible, files })
  return cache
}

/* ---------------------------------------------------------------- markdown */

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

function renderMarkdown(source) {
  const lines = source.split(/\r?\n/)
  const out = []
  let list = null
  let quote = null
  const flushList = () => {
    if (list) {
      out.push(`<ul>${list.join('')}</ul>`)
      list = null
    }
  }
  const flushQuote = () => {
    if (quote) {
      out.push(`<blockquote>${quote.join('<br>')}</blockquote>`)
      quote = null
    }
  }
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      flushList()
      flushQuote()
      continue
    }
    if (/^###\s+/.test(line)) {
      flushList()
      flushQuote()
      out.push(`<h4>${inline(line.replace(/^###\s+/, ''))}</h4>`)
      continue
    }
    if (/^##\s+/.test(line)) {
      flushList()
      flushQuote()
      out.push(`<h3>${inline(line.replace(/^##\s+/, ''))}</h3>`)
      continue
    }
    if (/^#\s+/.test(line)) {
      flushList()
      flushQuote()
      out.push(`<h2>${inline(line.replace(/^#\s+/, ''))}</h2>`)
      continue
    }
    if (/^>\s?/.test(line)) {
      flushList()
      quote = quote ?? []
      quote.push(inline(line.replace(/^>\s?/, '')))
      continue
    }
    if (/^[-*]\s+/.test(line)) {
      flushQuote()
      list = list ?? []
      list.push(`<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`)
      continue
    }
    if (/^\d+\.\s+/.test(line)) {
      flushQuote()
      list = list ?? []
      list.push(`<li>${inline(line.replace(/^\d+\.\s+/, ''))}</li>`)
      continue
    }
    if (/^---+$/.test(line)) {
      flushList()
      flushQuote()
      out.push('<hr>')
      continue
    }
    flushList()
    flushQuote()
    out.push(`<p>${inline(line)}</p>`)
  }
  flushList()
  flushQuote()
  return out.join('\n')
}

/* ------------------------------------------------------------------ routes */

function json(value, status = 200) {
  return Response.json(value, { status, headers: { 'cache-control': 'no-store' } })
}

async function handleLibrary(store) {
  const state = await store.read()
  const library = await readLibrary(store)
  const progress = state.progress || {}
  const notes = state.notes || {}
  return json({
    sources: state.sources.map((path, index) => ({
      index,
      path,
      name: path.split(/[\\/]/).filter(Boolean).pop() ?? path,
      modules: library.groups.reduce((total, group) => total + group.modules.filter((item) => item.source === index).length, 0)
    })),
    groups: library.groups.map((group) => ({
      id: group.id,
      label: group.label,
      modules: group.modules.map((module) => {
        const done = module.chapters.filter((chapter) => progress[`${module.id}#${chapter.index}`]).length
        return {
          id: module.id,
          title: module.title,
          summary: module.summary,
          source: module.source,
          file: module.file,
          chapters: module.chapters,
          read: done,
          total: module.chapters.length,
          noted: module.chapters.filter((chapter) => notes[`${module.id}#${chapter.index}`]).length
        }
      })
    })),
    lastOpened: state.lastOpened
  })
}

async function handleChapter(store, url) {
  const id = url.searchParams.get('module')
  const index = Number(url.searchParams.get('index') ?? '0')
  const library = await readLibrary(store)
  const entry = library.files.find((item) => item.module.id === id)
  if (!entry) return json({ error: '找不到这一章，资料文件夹可能已变动。' }, 404)
  const chapter = entry.module.chapters[index] ?? entry.module.chapters[0]
  const body = sliceChapter(entry.text.split(/\r?\n/), chapter.index)
  const state = await store.read()
  const key = `${entry.module.id}#${chapter.index}`
  return json({
    key,
    moduleTitle: entry.module.title,
    source: entry.module.source,
    title: chapter.title,
    summary: entry.module.summary,
    html: renderMarkdown(body),
    index: chapter.index,
    total: entry.module.chapters.length,
    read: Boolean(state.progress?.[key]),
    note: state.notes?.[key]?.note ?? '',
    question: state.notes?.[key]?.question ?? '',
    file: entry.module.file
  })
}

async function handleSearch(store, url) {
  const query = (url.searchParams.get('q') ?? '').trim()
  if (query.length < 1) return json({ results: [] })
  const library = await readLibrary(store)
  const needle = query.toLowerCase()
  const results = []
  for (const entry of library.files) {
    const flat = entry.text
    let at = flat.toLowerCase().indexOf(needle)
    if (at === -1) continue
    while (at !== -1 && results.length < 60) {
      const lineStart = flat.lastIndexOf('\n', at) + 1
      const lineEnd = flat.indexOf('\n', at)
      const line = flat.slice(lineStart, lineEnd === -1 ? flat.length : lineEnd)
      const heading = flat.lastIndexOf('\n## ', at)
      let chapterIndex = 0
      if (heading !== -1) {
        const headingLine = flat.slice(heading + 1, flat.indexOf('\n', heading + 1)).replace(/^##\s+/, '').trim()
        const match = entry.module.chapters.find((item) => item.title === headingLine)
        chapterIndex = match?.index ?? 0
      }
      results.push({
        moduleId: entry.module.id,
        moduleTitle: entry.module.title,
        chapterTitle: entry.module.chapters[chapterIndex]?.title ?? '',
        chapterIndex,
        line: line.trim().slice(0, 180)
      })
      at = flat.toLowerCase().indexOf(needle, at + needle.length)
    }
    if (results.length >= 60) break
  }
  return json({ results })
}

function validKey(key) {
  return typeof key === 'string' && key.length > 0 && key.length < 400
}

async function handleState(store) {
  const state = await store.read()
  return json(state)
}

function createHandlers(store) {
  return {
    async library() {
      return handleLibrary(store)
    },
    async state() {
      return handleState(store)
    },
    async source(body) {
      const path = typeof body.path === 'string' ? body.path.trim() : ''
      if (!path) return json({ error: '请选择一个资料文件夹。' }, 400)
      const info = await stat(path).catch(() => null)
      if (!info || !info.isDirectory()) return json({ error: '这个位置不是可读取的文件夹。' }, 400)
      await store.update((next) => {
        if (!next.sources.includes(path)) next.sources.push(path)
      })
      cache.key = ''
      return handleLibrary(store)
    },
    async removeSource(body) {
      const path = typeof body.path === 'string' ? body.path : ''
      await store.update((next) => {
        next.sources = next.sources.filter((item) => item !== path)
      })
      cache.key = ''
      return handleLibrary(store)
    },
    async note(body) {
      if (!validKey(body.key)) return json({ error: '缺少章节标识。' }, 400)
      const note = typeof body.note === 'string' ? body.note.slice(0, 20000) : ''
      const question = typeof body.question === 'string' ? body.question.slice(0, 20000) : ''
      const next = await store.update((draft) => {
        if (!note.trim() && !question.trim()) delete draft.notes[body.key]
        else draft.notes[body.key] = { note, question, updatedAt: new Date().toISOString() }
      })
      return json({ key: body.key, note: next.notes[body.key]?.note ?? '', question: next.notes[body.key]?.question ?? '' })
    },
    async progress(body) {
      if (!validKey(body.key)) return json({ error: '缺少章节标识。' }, 400)
      const read = body.read === true
      await store.update((draft) => {
        if (read) draft.progress[body.key] = true
        else delete draft.progress[body.key]
        draft.lastOpened = body.key
      })
      return json({ key: body.key, read })
    }
  }
}

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

export function apply(ctx, config) {
  const store = createStore(config.root)
  const handlers = createHandlers(store)
  const register = (path, methods, run) => ctx.connection.fetch.register({
    path: `${API}/${path}`,
    methods,
    requestBody: 'buffered',
    async fetch(request) {
      try {
        const body = methods.includes('POST') ? await readJson(request) : {}
        return await run(request, body)
      } catch (error) {
        ctx.logger?.warn?.(error)
        return json({ error: error instanceof Error ? error.message : '数据读取失败。' }, 500)
      }
    }
  })

  register('library', ['GET'], (request) => handlers.library(request))
  register('state', ['GET'], () => handlers.state())
  register('chapter', ['GET'], (request) => handleChapter(store, new URL(request.url)))
  register('search', ['GET'], (request) => handleSearch(store, new URL(request.url)))
  register('source', ['POST'], (request, body) => handlers.source(body))
  register('source/remove', ['POST'], (request, body) => handlers.removeSource(body))
  register('note', ['POST'], (request, body) => handlers.note(body))
  register('progress', ['POST'], (request, body) => handlers.progress(body))
}
