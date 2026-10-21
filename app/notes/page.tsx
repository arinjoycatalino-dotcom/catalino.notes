'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Note = {
  id: string
  title: string
  content: string
  updatedAt: number
}

const starterNotes: Note[] = [
  {
    id: 'welcome-note',
    title: 'A fresh start',
    content: 'Every good idea starts somewhere.\n\nUse this space to capture the little things, the big plans, and everything in between. Your notes are saved in this browser as you write.',
    updatedAt: Date.now(),
  },
  {
    id: 'weekend-note',
    title: 'Weekend ideas',
    content: 'A few things to look forward to:\n\n• Find a new coffee spot\n• Take the long way home\n• Make time for a little reading',
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 'reminder-note',
    title: 'Little reminders',
    content: 'Make progress at your own pace.\n\nDrink some water. Step outside. You are doing just fine.',
    updatedAt: Date.now() - 1000 * 60 * 60 * 26,
  },
]

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(timestamp)
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeId, setActiveId] = useState('')
  const [query, setQuery] = useState('')
  const [email, setEmail] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const loadFromStorage = () => {
      setEmail(window.localStorage.getItem('catalino-notes-email') ?? '')
      const savedNotes = window.localStorage.getItem('catalino-notes')

      if (savedNotes) {
        try {
          const parsedNotes: unknown = JSON.parse(savedNotes)
          if (Array.isArray(parsedNotes)) {
            const validNotes = parsedNotes.filter(
              (note): note is Note =>
                typeof note?.id === 'string' &&
                typeof note?.title === 'string' &&
                typeof note?.content === 'string' &&
                typeof note?.updatedAt === 'number',
            )
            setNotes(validNotes)
            setActiveId(validNotes[0]?.id ?? '')
          } else {
            setNotes(starterNotes)
            setActiveId(starterNotes[0].id)
          }
        } catch (error) {
          console.error('Could not read saved notes. Loading starter notes instead.', error)
          setNotes(starterNotes)
          setActiveId(starterNotes[0].id)
        }
      } else {
        setNotes(starterNotes)
        setActiveId(starterNotes[0].id)
      }

      setReady(true)
    }

    const timer = window.setTimeout(loadFromStorage, 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (ready) {
      window.localStorage.setItem('catalino-notes', JSON.stringify(notes))
    }
  }, [notes, ready])

  const visibleNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return [...notes]
      .filter((note) =>
        `${note.title} ${note.content}`.toLowerCase().includes(normalizedQuery),
      )
      .sort((first, second) => second.updatedAt - first.updatedAt)
  }, [notes, query])

  const activeNote = notes.find((note) => note.id === activeId)

  function updateActiveNote(field: 'title' | 'content', value: string) {
    setNotes((current) =>
      current.map((note) =>
        note.id === activeId ? { ...note, [field]: value, updatedAt: Date.now() } : note,
      ),
    )
  }

  function createNote() {
    const note: Note = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      updatedAt: Date.now(),
    }
    setNotes((current) => [note, ...current])
    setActiveId(note.id)
  }

  function deleteActiveNote() {
    if (!activeNote) return
    const remaining = notes.filter((note) => note.id !== activeNote.id)
    setNotes(remaining)
    setActiveId(remaining[0]?.id ?? '')
  }

  return (
    <main className="notes-page">
      <header className="notes-topbar">
        <Link className="brand brand-dark" href="/" aria-label="Catalino Notes home">
          <span className="brand-mark" aria-hidden="true">c.</span>
          <span>catalino<span className="brand-muted">notes</span></span>
        </Link>
        <div className="account-chip">
          <span className="account-avatar">{(email[0] ?? 'G').toUpperCase()}</span>
          <span>{email || 'Your notes'}</span>
          <Link className="sign-out-link" href="/">Sign out</Link>
        </div>
      </header>

      <div className="notes-layout">
        <aside className="notes-sidebar">
          <div className="sidebar-heading">
            <div>
              <span className="eyebrow">YOUR SPACE</span>
              <h1>My notes <span>{notes.length}</span></h1>
            </div>
            <button className="new-note-button" onClick={createNote} type="button" aria-label="Create a new note">+</button>
          </div>

          <label className="search-box">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.3 4.3" /></svg>
            <input
              aria-label="Search notes"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your notes"
              value={query}
            />
            <span>⌘ K</span>
          </label>

          <div className="note-list">
            {visibleNotes.map((note) => (
              <button
                className={`note-list-item${activeId === note.id ? ' selected' : ''}`}
                key={note.id}
                onClick={() => setActiveId(note.id)}
                type="button"
              >
                <span className="note-list-icon" aria-hidden="true">✳</span>
                <span className="note-list-copy">
                  <strong>{note.title || 'Untitled note'}</strong>
                  <span>{note.content.trim().split('\n')[0] || 'No additional text'}</span>
                  <small>{formatDate(note.updatedAt)}</small>
                </span>
              </button>
            ))}
            {visibleNotes.length === 0 && (
              <p className="empty-search">No notes found. Try another search.</p>
            )}
          </div>

          <div className="sidebar-footer"><span>✦</span> Your thoughts stay on this device.</div>
        </aside>

        <section className="note-editor" aria-label="Note editor">
          {activeNote ? (
            <>
              <div className="editor-toolbar">
                <div className="save-status"><span /> Saved in this browser</div>
                <button className="delete-button" onClick={deleteActiveNote} type="button">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16m-10 4v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
                  Delete note
                </button>
              </div>
              <div className="editor-content">
                <input
                  aria-label="Note title"
                  className="note-title-input"
                  onChange={(event) => updateActiveNote('title', event.target.value)}
                  placeholder="Untitled note"
                  value={activeNote.title}
                />
                <div className="editor-meta">Last edited {formatDate(activeNote.updatedAt)}</div>
                <textarea
                  aria-label="Note content"
                  className="note-content-input"
                  onChange={(event) => updateActiveNote('content', event.target.value)}
                  placeholder="Start writing something lovely..."
                  value={activeNote.content}
                />
              </div>
              <div className="editor-footer"><span>✳</span> Made for the things on your mind.</div>
            </>
          ) : (
            <div className="editor-empty">
              <span className="empty-icon">✳</span>
              <h2>{query ? 'No notes found' : 'A blank page, full of possibility.'}</h2>
              <p>{query ? 'Try a different search, or create a new note.' : 'Create a note and give your thoughts a place to land.'}</p>
              {!query && <button className="submit-button empty-create-button" onClick={createNote} type="button">Create your first note <span aria-hidden="true">→</span></button>}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
