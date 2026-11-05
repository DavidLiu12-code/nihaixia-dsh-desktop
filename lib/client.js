window.__ModuleLoader__.load({
  id: 'dsh-workbench-nihaixia',
  factory: (require) => {
    const React = require('react')
    const API = '/api/dsh-workbench-nihaixia'

    const css = `
.nhFrame{display:flex;flex-direction:column;flex:1;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;container-type:inline-size;background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-label-primary,#1c1c1e);font-size:14px;line-height:1.65;font-family:inherit}
.nhFrame *{box-sizing:border-box}
.nhToolbar{flex:none;display:flex;align-items:center;gap:10px;min-height:48px;padding:8px 14px;padding-inline-start:max(14px,var(--dsh-frame-leading-clearance,0px));border-bottom:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.1));background:var(--dsw-alias-bg-base,#fff);position:sticky;top:0;z-index:3;flex-wrap:wrap}
.nhBrand{font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:40%}
.nhSpacer{flex:1 1 auto;min-width:8px}
.nhSearch{display:flex;align-items:center;gap:6px;flex:1 1 220px;min-width:160px;max-width:340px}
.nhSearch input{flex:1;min-width:0;padding:6px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16));background:var(--dsw-alias-bg-layer-1,#f7f7f8);color:inherit;font-size:13px;font-family:inherit}
.nhBtn{border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16));background:var(--dsw-alias-bg-layer-1,#f7f7f8);color:inherit;border-radius:8px;padding:5px 10px;font-size:13px;line-height:20px;cursor:pointer;white-space:nowrap;font-family:inherit}
.nhBtn:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2,#eee)}
.nhBtn:disabled{opacity:.5;cursor:default}
.nhBtn.primary{background:var(--dsw-alias-button-primary-fill,#2a6df5);color:#fff;border-color:transparent}
.nhBtn.ghost{background:transparent}
.nhBtn.on{background:var(--dsw-alias-bg-layer-2,#ececf0)}
.nhBody{flex:1;min-height:0;display:grid;grid-template-columns:242px minmax(0,1fr);overflow:hidden}
.nhBody.withRail{grid-template-columns:242px minmax(0,1fr) 320px}
.nhBody.withAi{grid-template-columns:242px minmax(0,1fr) 380px}
.nhSide{border-right:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.1));overflow:auto;padding:10px 8px 24px;min-width:0}
.nhGroup{margin:10px 0 4px;padding:0 8px;font-size:12px;letter-spacing:.04em;color:var(--dsw-alias-label-secondary,#6b6b70);display:flex;justify-content:space-between;gap:8px}
.nhModule{display:block;width:100%;text-align:left;border:0;background:transparent;color:inherit;padding:7px 9px;border-radius:8px;cursor:pointer;font-size:13px;line-height:1.45;font-family:inherit}
.nhModule:hover{background:var(--dsw-alias-bg-layer-2,#efeff2)}
.nhModule.on{background:var(--dsw-alias-bg-layer-2,#e8e8ee);font-weight:600}
.nhModule small{display:block;color:var(--dsw-alias-label-secondary,#6b6b70);font-weight:400;font-size:12px}
.nhMain{min-width:0;min-height:0;overflow:auto;padding:0}
.nhChapterHead{position:sticky;top:0;z-index:2;background:var(--dsw-alias-bg-base,#fff);border-bottom:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.08));padding:10px 20px}
.nhCrumb{font-size:12px;color:var(--dsw-alias-label-secondary,#6b6b70);margin-bottom:4px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.nhChapterTitle{font-size:17px;font-weight:650;line-height:1.4;margin:0;word-break:break-word}
.nhChapterBody{padding:16px 20px 60px;max-width:78ch}
.nhChapterBody h3{font-size:15px;margin:22px 0 8px;font-weight:650}
.nhChapterBody h4{font-size:14px;margin:18px 0 6px;font-weight:600;color:var(--dsw-alias-label-primary,#1c1c1e)}
.nhChapterBody p{margin:0 0 10px}
.nhChapterBody blockquote{margin:0 0 10px;padding:8px 12px;border-left:3px solid var(--dsw-alias-border-l2,rgba(0,0,0,.18));background:var(--dsw-alias-bg-layer-1,#f7f7f8);border-radius:0 6px 6px 0;color:var(--dsw-alias-label-secondary,#3a3a3e)}
.nhChapterBody ul{margin:0 0 10px;padding-left:20px}
.nhChapterBody li{margin:0 0 4px}
.nhChapterBody code{font-size:12.5px;background:var(--dsw-alias-bg-layer-2,#efeff2);padding:1px 4px;border-radius:4px}
.nhChapterBody hr{border:0;border-top:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.1));margin:18px 0}
.nhRail{border-left:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.1));min-width:0;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
.nhRail h4{margin:0;font-size:13px;font-weight:600;color:var(--dsw-alias-label-secondary,#6b6b70)}
.nhRail textarea{width:100%;min-height:96px;resize:vertical;padding:8px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16));background:var(--dsw-alias-bg-layer-1,#f7f7f8);color:inherit;font:inherit;font-size:13px;line-height:1.6}
.nhRail textarea:focus-visible{outline:2px solid var(--dsw-alias-label-primary,#1c1c1e);outline-offset:1px}
.nhRailFoot{display:flex;gap:8px;align-items:center;font-size:12px;color:var(--dsw-alias-label-secondary,#6b6b70)}
.nhAi{display:flex;flex-direction:column;min-width:0;min-height:0;border-left:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.1))}
.nhAiHead{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.08))}
.nhAiBody{flex:1;min-height:0;display:flex;flex-direction:column}
.nhAiHint{padding:10px 12px;font-size:12px;color:var(--dsw-alias-label-secondary,#6b6b70);border-top:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.08))}
.nhEmpty{flex:1;display:flex;align-items:center;justify-content:center;padding:32px 20px;overflow:auto}
.nhEmptyCard{max-width:520px;width:100%;border:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.12));border-radius:14px;padding:24px;background:var(--dsw-alias-bg-layer-1,#fafafa)}
.nhEmptyCard h2{margin:0 0 6px;font-size:17px}
.nhEmptyCard p{margin:0 0 14px;color:var(--dsw-alias-label-secondary,#6b6b70);font-size:13px}
.nhSteps{margin:0 0 16px;padding-left:18px;font-size:13px;color:var(--dsw-alias-label-secondary,#5c5c62)}
.nhSteps li{margin-bottom:4px}
.nhResult{display:block;width:100%;text-align:left;border:0;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.07));background:transparent;color:inherit;padding:10px 4px;cursor:pointer;font-family:inherit;font-size:13px}
.nhResult:hover{background:var(--dsw-alias-bg-layer-1,#f7f7f8)}
.nhResult b{font-weight:600}
.nhResult span{display:block;color:var(--dsw-alias-label-secondary,#6b6b70);font-size:12px;margin-top:2px}
.nhError{margin:0;padding:8px 14px;background:rgba(200,40,40,.08);color:#b3261e;font-size:12.5px;border-bottom:1px solid rgba(200,40,40,.2)}
.nhChips{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.nhChip{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--dsw-alias-bg-layer-2,#ececf0);color:var(--dsw-alias-label-secondary,#4a4a50);white-space:nowrap}
.nhSource{max-width:220px}
@container (max-width: 1040px){.nhBody.withRail{grid-template-columns:220px minmax(0,1fr)}.nhBody.withAi{grid-template-columns:220px minmax(0,1fr)}.nhRail{grid-column:1/-1;border-left:0;border-top:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.1));flex-direction:row;flex-wrap:wrap;align-items:flex-start}.nhRail>div{flex:1 1 220px;min-width:180px}.nhAi{grid-column:1/-1;border-left:0;border-top:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.1));min-height:360px}}
@container (max-width: 820px){.nhBody,.nhBody.withRail,.nhBody.withAi{grid-template-columns:1fr}.nhSide{border-right:0;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.1));max-height:186px}.nhBrand{display:none}.nhSearch{max-width:none;flex:1 1 180px}.nhChapterBody{padding:14px 14px 48px}.nhChapterHead{padding:8px 14px}.nhAi{grid-column:1/-1;border-left:0;border-top:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.1));min-height:320px}}
@container (max-width: 520px){.nhToolbar{padding:6px 10px;gap:6px}.nhBtn{padding:4px 8px}.nhChapterTitle{font-size:16px}}
`

    async function request(path, init) {
      const response = await fetch(`${API}/${path}`, { credentials: 'same-origin', cache: 'no-store', ...init })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || `请求失败（${response.status}）`)
      return data
    }

    const post = (path, body) => request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    function pickDirectory(ctx) {
      const desktop = globalThis.__DSH_DIRECTORY_PICKER__
      if (desktop && typeof desktop.pick === 'function') return desktop.pick()
      const workspace = ctx.get('uiWorkspace')
      if (workspace && typeof workspace.pickDirectory === 'function') return workspace.pickDirectory()
      return Promise.resolve(null)
    }

    function promptFor(moduleTitle, chapterTitle) {
      return `请按倪海厦的讲义帮我讲清楚这一节：${moduleTitle} · ${chapterTitle}。\n先概括这一节在讲什么，再解释其中的辨证思路和用方要点，最后指出我需要重点记住的条文或禁忌。`
    }

    function ChapterView({ chapter, onToggleRead, saving }) {
      return React.createElement('div', null,
        React.createElement('div', { className: 'nhChapterHead' },
          React.createElement('div', { className: 'nhCrumb' },
            React.createElement('span', null, chapter.moduleTitle),
            React.createElement('span', null, `· 第 ${chapter.index + 1}/${chapter.total} 节`),
            React.createElement('button', {
              className: `nhBtn ${chapter.read ? 'on' : ''}`,
              onClick: () => onToggleRead(!chapter.read),
              disabled: saving,
              type: 'button'
            }, chapter.read ? '已读懂' : '标记为已读懂')
          ),
          React.createElement('h2', { className: 'nhChapterTitle' }, chapter.title)
        ),
        React.createElement('div', {
          className: 'nhChapterBody',
          dangerouslySetInnerHTML: { __html: chapter.html }
        })
      )
    }

    function EmptyState({ onPick, busy }) {
      return React.createElement('div', { className: 'nhEmpty' },
        React.createElement('div', { className: 'nhEmptyCard' },
          React.createElement('h2', null, '先选一个资料文件夹'),
          React.createElement('p', null, '工作台不打包教材：它读你自己放在本机的资料文件夹，按文件夹里的目录和标题自动排出模块与章节。'),
          React.createElement('ol', { className: 'nhSteps' },
            React.createElement('li', null, '把倪海厦讲义资料放进一个文件夹（已经下载过就直接用）。'),
            React.createElement('li', null, '点下面的按钮选中这个文件夹；以后加的每一份资料都会保留。'),
            React.createElement('li', null, '工作台按 Markdown 标题拆出章节，读、记笔记、搜方剂穴位都在这里完成。')
          ),
          React.createElement('button', { className: 'nhBtn primary', onClick: onPick, disabled: busy, type: 'button' },
            busy ? '正在读取…' : '选择资料文件夹')
        )
      )
    }

    function SearchResults({ query, results, onOpen, onClose }) {
      return React.createElement('div', { className: 'nhChapterHead', style: { position: 'static' } },
        React.createElement('div', { className: 'nhCrumb' },
          React.createElement('span', null, `“${query}” 的检索结果 · ${results.length} 条`),
          React.createElement('button', { className: 'nhBtn ghost', onClick: onClose, type: 'button' }, '返回阅读')
        ),
        results.length === 0
          ? React.createElement('p', { style: { color: 'var(--dsw-alias-label-secondary,#6b6b70)', fontSize: 13 } }, '没有找到包含这个词的章节，换一个方名、穴位或症状再试。')
          : results.map((item, index) => React.createElement('button', {
            key: `${item.moduleId}#${item.chapterIndex}#${index}`,
            className: 'nhResult',
            type: 'button',
            onClick: () => onOpen(item)
          },
          React.createElement('b', null, item.chapterTitle || item.moduleTitle),
          React.createElement('span', null, `${item.moduleTitle} · ${item.line}`)
          ))
      )
    }

    function Panel({ service, entry, active, conversation }) {
      const ctx = service.ctx
      const [library, setLibrary] = React.useState(null)
      const [chapter, setChapter] = React.useState(null)
      const [moduleId, setModuleId] = React.useState(null)
      const [error, setError] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const [query, setQuery] = React.useState('')
      const [results, setResults] = React.useState(null)
      const [railOpen, setRailOpen] = React.useState(false)
      const [aiOpen, setAiOpen] = React.useState(false)
      const [aiNote, setAiNote] = React.useState('')
      const [note, setNote] = React.useState('')
      const [question, setQuestion] = React.useState('')
      const [dirty, setDirty] = React.useState(false)
      const loading = React.useRef(false)
      const saveTimer = React.useRef(null)

      const loadLibrary = React.useCallback(async () => {
        const data = await request('library')
        setLibrary(data)
        return data
      }, [])

      React.useEffect(() => {
        if (!active) return undefined
        let alive = true
        loadLibrary().then((data) => {
          if (!alive || !data) return
          const last = data.lastOpened
          if (!last) return
          const [id, index] = last.split('#')
          const module = data.groups.flatMap((group) => group.modules).find((item) => item.id === id)
          if (!module) return
          void openChapter(id, Number(index) || 0, { silent: true })
        }).catch((cause) => { if (alive) setError(cause.message) })
        return () => { alive = false }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [active, loadLibrary])

      const openChapter = React.useCallback(async (id, index, options = {}) => {
        setBusy(true)
        setError('')
        try {
          const data = await request(`chapter?module=${encodeURIComponent(id)}&index=${index}`)
          setChapter(data)
          setModuleId(id)
          setNote(data.note || '')
          setQuestion(data.question || '')
          setDirty(false)
          setResults(null)
          setQuery('')
          if (!options.silent) setRailOpen(true)
        } catch (cause) {
          setError(cause.message)
        } finally {
          setBusy(false)
        }
      }, [])

      const saveNote = React.useCallback(async (nextNote, nextQuestion) => {
        if (!chapter) return
        try {
          await post('note', { key: chapter.key, note: nextNote, question: nextQuestion })
          setDirty(false)
        } catch (cause) {
          setError(cause.message)
        }
      }, [chapter])

      const scheduleSave = (nextNote, nextQuestion) => {
        setDirty(true)
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => { void saveNote(nextNote, nextQuestion) }, 900)
      }

      React.useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current) }, [])

      const toggleRead = async (read) => {
        if (!chapter) return
        setBusy(true)
        try {
          await post('progress', { key: chapter.key, read })
          setChapter({ ...chapter, read })
          void loadLibrary()
        } catch (cause) {
          setError(cause.message)
        } finally {
          setBusy(false)
        }
      }

      const pickSource = async () => {
        setBusy(true)
        setError('')
        try {
          const path = await pickDirectory(ctx)
          if (!path) return
          const data = await post('source', { path })
          setLibrary(data)
        } catch (cause) {
          setError(cause.message)
        } finally {
          setBusy(false)
        }
      }

      const runSearch = async (value) => {
        const text = value.trim()
        if (!text) {
          setResults(null)
          return
        }
        try {
          const data = await request(`search?q=${encodeURIComponent(text)}`)
          setResults(data.results)
        } catch (cause) {
          setError(cause.message)
        }
      }

      const startAi = async () => {
        if (!chapter || !library) return
        setBusy(true)
        setAiNote('')
        try {
          const source = library.sources[chapter.source ?? 0] ?? library.sources[0]
          if (!source) throw new Error('请先选择资料文件夹。')
          const prompt = promptFor(chapter.moduleTitle, chapter.title)
          const sessionId = await service.ensureSession({ folder: source.path })
          setAiOpen(true)
          let placed = false
          const conversationService = ctx.get('conversation')
          for (let attempt = 0; attempt < 6 && !placed; attempt += 1) {
            if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 220))
            try {
              const shell = conversationService?.input?.shell?.(sessionId)
              if (shell && typeof shell.setDraft === 'function') {
                shell.setDraft(prompt)
                placed = true
              }
            } catch {
              /* 宿主尚未挂载该会话的输入框时重试 */
            }
          }
          if (!placed) setAiNote('对话已打开，但没有把问题放进输入框，可以复制下面这句自己发送：')
        } catch (cause) {
          setAiNote(cause.message)
          setAiOpen(false)
        } finally {
          setBusy(false)
        }
      }

      const groups = library?.groups ?? []
      const currentModule = groups.flatMap((group) => group.modules).find((item) => item.id === moduleId)
      const hasSources = (library?.sources?.length ?? 0) > 0

      return React.createElement('div', { className: 'nhFrame', 'data-plugin': 'dsh-workbench-nihaixia' },
        React.createElement('header', { 'data-dsh-workbench-toolbar': '', className: 'nhToolbar' },
          React.createElement('div', { className: 'nhBrand' }, entry?.title || '倪海厦自学中医工作台'),
          React.createElement('div', { className: 'nhSearch' },
            React.createElement('input', {
              type: 'search',
              placeholder: '搜方剂 / 穴位 / 症状 / 条文',
              value: query,
              'aria-label': '检索资料',
              onChange: (event) => {
                setQuery(event.target.value)
                if (event.target.value.trim() === '') setResults(null)
              },
              onKeyDown: (event) => { if (event.key === 'Enter') void runSearch(query) }
            }),
            React.createElement('button', { className: 'nhBtn', type: 'button', onClick: () => void runSearch(query) }, '检索')
          ),
          React.createElement('div', { className: 'nhSpacer' }),
          React.createElement('button', {
            className: `nhBtn ${railOpen ? 'on' : ''}`,
            type: 'button',
            onClick: () => setRailOpen((value) => !value),
            disabled: !chapter
          }, '笔记与疑问'),
          React.createElement('button', {
            className: `nhBtn ${aiOpen ? 'on' : ''}`,
            type: 'button',
            onClick: () => { if (aiOpen) setAiOpen(false); else void startAi() },
            disabled: !chapter || busy
          }, aiOpen ? '收起对话' : '问 AI'),
          React.createElement('button', { className: 'nhBtn ghost', type: 'button', onClick: pickSource, disabled: busy }, '资料夹')
        ),
        error ? React.createElement('p', { className: 'nhError' }, error) : null,
        !library
          ? React.createElement('div', { className: 'nhEmpty' }, React.createElement('div', { className: 'nhEmptyCard' }, '正在读取资料…'))
          : !hasSources
            ? React.createElement(EmptyState, { onPick: pickSource, busy })
            : React.createElement('div', {
              className: `nhBody ${aiOpen ? 'withAi' : railOpen && chapter ? 'withRail' : ''}`
            },
            React.createElement('aside', { className: 'nhSide' },
              groups.map((group) => React.createElement('div', { key: group.id },
                React.createElement('div', { className: 'nhGroup' },
                  React.createElement('span', null, group.label),
                  React.createElement('span', null, String(group.modules.length))
                ),
                group.modules.map((module) => React.createElement('button', {
                  key: module.id,
                  type: 'button',
                  className: `nhModule ${module.id === moduleId ? 'on' : ''}`,
                  onClick: () => void openChapter(module.id, module.chapters[0]?.index ?? 0)
                },
                module.title,
                React.createElement('small', null, `${module.read}/${module.total} 节已读${module.noted ? ` · ${module.noted} 条笔记` : ''}`)
                ))
              )),
              React.createElement('div', { className: 'nhGroup', style: { marginTop: 16 } },
                React.createElement('span', null, '资料夹'),
                React.createElement('button', { className: 'nhBtn ghost', type: 'button', onClick: pickSource, style: { padding: '0 6px' } }, '添加')
              ),
              (library.sources ?? []).map((source) => React.createElement('div', {
                key: source.index,
                className: 'nhGroup nhSource',
                title: source.path
              }, React.createElement('span', null, source.name), React.createElement('span', null, String(source.modules))))
            ),
            React.createElement('main', { className: 'nhMain' },
              results
                ? React.createElement(SearchResults, {
                  query,
                  results,
                  onClose: () => { setResults(null); setQuery('') },
                  onOpen: (item) => void openChapter(item.moduleId, item.chapterIndex)
                })
                : chapter
                  ? React.createElement(ChapterView, { chapter, onToggleRead: toggleRead, saving: busy })
                  : React.createElement('div', { className: 'nhEmpty' },
                    React.createElement('div', { className: 'nhEmptyCard' },
                      React.createElement('h2', null, '从左边选一讲开始'),
                      React.createElement('p', null, '模块按资料文件夹里的目录排好；点进去就是这一节的正文，读完可以标记“已读懂”，进度会记住。'),
                      React.createElement('p', { style: { fontSize: 12 } }, `已收录 ${groups.reduce((total, group) => total + group.modules.length, 0)} 份资料。`)
                    ))
            ),
            aiOpen
              ? React.createElement('section', { className: 'nhAi', 'aria-label': 'AI 对话' },
                React.createElement('div', { className: 'nhAiHead' },
                  React.createElement('strong', { style: { fontSize: 13 } }, chapter ? `就这一节问 AI · ${chapter.title}` : 'AI 对话'),
                  React.createElement('button', { className: 'nhBtn ghost', type: 'button', onClick: () => setAiOpen(false) }, '收起')
                ),
                React.createElement('div', { className: 'nhAiBody' }, conversation ?? null),
                aiNote
                  ? React.createElement('div', { className: 'nhAiHint' },
                    aiNote,
                    chapter ? React.createElement('div', { style: { marginTop: 6, wordBreak: 'break-word' } }, promptFor(chapter.moduleTitle, chapter.title)) : null)
                  : React.createElement('div', { className: 'nhAiHint' }, '已把问题放进输入框，确认后发送即可；这里不会替你自动发送。')
              )
              : railOpen && chapter
                ? React.createElement('aside', { className: 'nhRail', 'aria-label': '笔记与疑问' },
                  React.createElement('div', null,
                    React.createElement('h4', null, '我的笔记'),
                    React.createElement('textarea', {
                      value: note,
                      placeholder: '这一节你记住了什么？用自己的话说一遍。',
                      onChange: (event) => { setNote(event.target.value); scheduleSave(event.target.value, question) }
                    })
                  ),
                  React.createElement('div', null,
                    React.createElement('h4', null, '没弄懂的疑问'),
                    React.createElement('textarea', {
                      value: question,
                      placeholder: '哪一句条文或哪个方证还没想通？',
                      onChange: (event) => { setQuestion(event.target.value); scheduleSave(note, event.target.value) }
                    })
                  ),
                  React.createElement('div', { className: 'nhRailFoot' },
                    React.createElement('span', null, dirty ? '会自动保存…' : '已保存'),
                    currentModule ? React.createElement('span', null, `· ${currentModule.read}/${currentModule.total} 节已读`) : null
                  )
                )
                : null
          )
      )
    }

    function apply(ctx) {
      ctx.effect(() => {
        const element = document.createElement('style')
        element.setAttribute('data-plugin', 'dsh-workbench-nihaixia')
        element.textContent = css
        document.head.appendChild(element)
        return () => { element.remove() }
      }, 'nihaixia-workbench: styles')

      ctx.effect(() => ctx.desktopWorkbenches.register({
        title: '倪海厦自学中医工作台',
        panelTitle: '自学中医',
        description: '跟课推进、章节笔记与资料速查，资料留在本机',
        repository: 'https://github.com/DavidLiu12-code/nihaixia-dsh-desktop',
        customFrame: true,
        headerLayout: 'compact'
      }, Panel), 'nihaixia-workbench: workbench')
    }

    return { apply, inject: ['desktopWorkbenches'] }
  }
})
