"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Note {
  _id: string
  title: string
  description: string
}

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editNote, setEditNote] = useState<Note | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [username, setUsername] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const router = useRouter()

  const fetchNotes = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch("/api/notes", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    const data = await res.json()
    setNotes(data)
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/"); return }
    const stored = localStorage.getItem("username")
    if (stored) setUsername(stored)
    fetchNotes()
  }, [])

  const openAdd = () => {
    setEditNote(null)
    setTitle('')
    setBody('')
    setModalOpen(true)
  }

  const openEdit = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditNote(note)
    setTitle(note.title)
    setBody(note.description)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!title.trim() && !body.trim()) return
    const token = localStorage.getItem("token")

    if (editNote) {
      const res = await fetch(`/api/notes/${editNote._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ title, description: body })
      })
      if (res.ok) {
        const updated = await res.json()
        setNotes(prev => prev.map(n => n._id === editNote._id ? updated : n))
      }
    } else {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ title, description: body })
      })
      if (res.ok) {
        const newNote = await res.json()
        setNotes(prev => [newNote, ...prev])
      }
    }

    setTitle('')
    setBody('')
    setModalOpen(false)
    setEditNote(null)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const token = localStorage.getItem("token")
    const res = await fetch(`/api/notes/${deleteId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (res.ok) setNotes(prev => prev.filter(n => n._id !== deleteId))
    setDeleteId(null)
  }

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" })
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    router.push("/")
  }

  const initial = username ? username.charAt(0).toUpperCase() : '?'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .notes-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #e8e4dc;
          padding: 3rem 2.5rem;
          position: relative;
        }
        .notes-root::before {
          content: '';
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: radial-gradient(circle, #b0aa9f 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.18;
        }

        .header {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 2.5rem;
          gap: 1rem;
        }
        .page-title {
          font-family: 'Lora', serif;
          font-size: 2rem; font-weight: 700;
          color: #1a1714; letter-spacing: -0.02em;
        }
        .page-title em { font-style: italic; color: #c9a96e; }

        .header-right {
          display: flex; align-items: center; gap: 10px;
        }

        .add-btn {
          display: flex; align-items: center; gap: 8px;
          background: #1a1714; color: #faf8f4;
          border: none; border-radius: 12px;
          padding: 0.75rem 1.25rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; font-weight: 600;
          letter-spacing: 0.03em; cursor: pointer;
          box-shadow: 0 4px 14px #1a171433;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .add-btn:hover { background: #2c2620; transform: translateY(-2px); box-shadow: 0 8px 22px #1a171444; }
        .add-btn:active { transform: translateY(0); }

        /* ── PROFILE ── */
        .profile-wrap { position: relative; }

        .profile-avatar-btn {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #1a1714, #3a3028);
          border: 2.5px solid #e5dfd6;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem; font-weight: 700;
          color: #c9a96e;
          cursor: pointer;
          box-shadow: 0 2px 8px #1a171420;
          transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0;
          outline: none;
          position: relative;
        }
        .profile-avatar-btn:hover {
          border-color: #c9a96e;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px #1a171430;
        }
        .profile-avatar-btn.open {
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px #c9a96e22, 0 4px 14px #1a171430;
        }

        /* Online dot */
        .profile-avatar-btn::after {
          content: '';
          position: absolute; bottom: 1px; right: 1px;
          width: 9px; height: 9px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid #e8e4dc;
        }

        /* Dropdown */
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .profile-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: #faf8f4;
          border: 1.5px solid #e5dfd6;
          border-radius: 16px;
          padding: 0.5rem;
          min-width: 200px;
          box-shadow:
            0 2px 0 #e8e0d4,
            0 6px 0 #ede6db,
            0 16px 40px #1a171428;
          z-index: 100;
          animation: dropIn 0.2s cubic-bezier(.22,1,.36,1) both;
        }

        .dropdown-header {
          display: flex; align-items: center; gap: 10px;
          padding: 0.75rem 0.75rem 0.85rem;
          border-bottom: 1px solid #f0ece5;
          margin-bottom: 0.4rem;
        }
        .dropdown-avatar {
          width: 36px; height: 36px; flex-shrink: 0;
          background: linear-gradient(135deg, #1a1714, #3a3028);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 700;
          color: #c9a96e;
        }
        .dropdown-info {}
        .dropdown-label {
          font-size: 0.65rem; font-weight: 600;
          color: #b5ada4; letter-spacing: 0.09em;
          text-transform: uppercase; margin-bottom: 1px;
        }
        .dropdown-username {
          font-size: 0.875rem; font-weight: 600;
          color: #1a1714;
        }

        .dropdown-item {
          display: flex; align-items: center; gap: 9px;
          width: 100%; background: none; border: none;
          border-radius: 9px; padding: 0.6rem 0.75rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 500;
          color: #6b635a; cursor: pointer;
          transition: background 0.15s, color 0.15s;
          text-align: left;
        }
        .dropdown-item:hover { background: #f0ece5; color: #1a1714; }
        .dropdown-item.danger { color: #c0392b; }
        .dropdown-item.danger:hover { background: #fde8e8; color: #a93226; }

        /* ── NOTES GRID ── */
        .notes-list {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
          position: relative; z-index: 1;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .note-item {
          background: #faf8f4;
          border: 1.5px solid #e5dfd6;
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 2px 8px #1a171410;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
          position: relative;
          animation: cardIn 0.35s cubic-bezier(.22,1,.36,1) both;
        }
        .note-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px #1a171420;
          border-color: #cfc4b8;
          cursor: pointer;
        }
        .note-item:hover .note-actions { opacity: 1; }

        .note-title {
          font-family: 'Lora', serif;
          font-size: 1rem; font-weight: 700;
          color: #1a1714; letter-spacing: -0.01em;
          margin-bottom: 0.5rem;
          padding-right: 3rem;
        }
        .note-body {
          font-size: 0.825rem; color: #6b635a;
          font-weight: 300; line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .note-actions {
          position: absolute; top: 1rem; right: 1rem;
          display: flex; gap: 4px;
          opacity: 0; transition: opacity 0.15s;
        }
        .icon-btn {
          background: #f0ece5; border: none;
          border-radius: 8px; padding: 5px;
          cursor: pointer; color: #9c9288; display: flex;
          transition: background 0.15s, color 0.15s;
        }
        .icon-btn:hover { background: #e5dfd6; color: #1a1714; }
        .icon-btn.danger:hover { background: #fde8e8; color: #c0392b; }

        .empty {
          position: relative; z-index: 1;
          text-align: center; padding: 5rem 2rem;
        }
        .empty-icon {
          width: 52px; height: 52px;
          background: #faf8f4; border: 1.5px solid #e5dfd6;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
        }
        .empty-title {
          font-family: 'Lora', serif; font-size: 1.1rem; font-weight: 700;
          color: #6b635a; margin-bottom: 0.35rem;
        }
        .empty-sub { font-size: 0.82rem; color: #b5ada4; font-weight: 300; }

        /* ── MODAL ── */
        .overlay {
          position: fixed; inset: 0; z-index: 50;
          background: #1a171466;
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem;
          animation: overlayIn 0.2s ease both;
        }
        .modal {
          background: #faf8f4; border-radius: 20px;
          padding: 2rem; width: 100%; max-width: 460px;
          box-shadow: 0 2px 0 #e8e0d4, 0 8px 0 #ede6db, 0 24px 80px #1a171455;
          animation: modalIn 0.3s cubic-bezier(.22,1,.36,1) both;
        }
        .modal-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .modal-title {
          font-family: 'Lora', serif;
          font-size: 1.3rem; font-weight: 700;
          color: #1a1714; letter-spacing: -0.02em;
        }
        .modal-close {
          background: #f0ece5; border: none; border-radius: 8px;
          padding: 6px; cursor: pointer; color: #9c9288; display: flex;
          transition: background 0.15s, color 0.15s;
        }
        .modal-close:hover { background: #e5dfd6; color: #1a1714; }

        .modal input, .modal textarea {
          width: 100%; background: #f0ece5;
          border: 1.5px solid #e5dfd6; border-radius: 12px;
          padding: 0.8rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; color: #1a1714; outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          margin-bottom: 0.75rem; -webkit-appearance: none; display: block;
        }
        .modal input::placeholder, .modal textarea::placeholder { color: #c0b8ae; }
        .modal input:focus, .modal textarea:focus {
          border-color: #c9a96e; background: #fffefb;
          box-shadow: 0 0 0 3px #c9a96e33;
        }
        .modal textarea {
          resize: none; min-height: 140px;
          line-height: 1.65; margin-bottom: 1.5rem;
        }
        .modal-footer { display: flex; justify-content: flex-end; gap: 10px; }

        .btn-cancel {
          background: #f0ece5; border: none; border-radius: 10px;
          padding: 0.7rem 1.2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; font-weight: 500;
          color: #6b635a; cursor: pointer; transition: background 0.15s;
        }
        .btn-cancel:hover { background: #e5dfd6; }

        .btn-save {
          background: #1a1714; border: none; border-radius: 10px;
          padding: 0.7rem 1.4rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; font-weight: 600; color: #faf8f4;
          cursor: pointer; box-shadow: 0 4px 14px #1a171433;
          display: flex; align-items: center; gap: 7px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .btn-save:hover { background: #2c2620; transform: translateY(-1px); box-shadow: 0 6px 18px #1a171444; }
        .btn-save:active { transform: translateY(0); }

        .delete-modal {
          background: #faf8f4; border-radius: 18px;
          padding: 1.75rem; width: 100%; max-width: 340px;
          text-align: center;
          box-shadow: 0 2px 0 #e8e0d4, 0 8px 0 #ede6db, 0 24px 60px #1a171455;
          animation: modalIn 0.3s cubic-bezier(.22,1,.36,1) both;
        }
        .delete-icon {
          width: 48px; height: 48px; background: #fde8e8;
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem; color: #c0392b;
        }
        .delete-title {
          font-family: 'Lora', serif; font-size: 1.05rem; font-weight: 700;
          color: #1a1714; margin-bottom: 0.4rem;
        }
        .delete-sub { font-size: 0.8rem; color: #9c9288; margin-bottom: 1.25rem; line-height: 1.5; }
        .btn-delete {
          background: #c0392b; border: none; border-radius: 10px;
          padding: 0.7rem 1.2rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600;
          color: #fff; cursor: pointer; transition: background 0.2s;
        }
        .btn-delete:hover { background: #a93226; }

        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="notes-root" onClick={() => setProfileOpen(false)}>

        {/* Header */}
        <div className="header">
          <h1 className="page-title">Apex <em>Notes</em></h1>

          <div className="header-right">
            <button className="add-btn" onClick={openAdd}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Note
            </button>

            {/* Profile avatar */}
            <div className="profile-wrap" onClick={e => e.stopPropagation()}>
              <button
                className={`profile-avatar-btn ${profileOpen ? 'open' : ''}`}
                onClick={() => setProfileOpen(p => !p)}
                aria-label="Profile menu"
              >
                {initial}
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{initial}</div>
                    <div className="dropdown-info">
                      <div className="dropdown-label">Signed in as</div>
                      <div className="dropdown-username">@{username}</div>
                    </div>
                  </div>
                  <button className="dropdown-item danger cursor-pointer" onClick={handleLogout}>
                    {/* <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg> */}
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        {notes.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c0b8ae" strokeWidth="1.5" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="empty-title">No notes yet</div>
            <div className="empty-sub">Click Add Note to get started</div>
          </div>
        ) : (
          <ul className="notes-list">
            {notes.map((note, i) => (
              <li key={note._id} className="note-item" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => setSelectedNote(note)}>
                <div className="note-actions">
                  <button className="icon-btn" onClick={e => openEdit(note, e)} title="Edit">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button className="icon-btn danger" onClick={e => { e.stopPropagation(); setDeleteId(note._id) }} title="Delete">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
                <h2 className="note-title">{note.title}</h2>
                <p className="note-body">{note.description}</p>
              </li>
            ))}
          </ul>
        )}

        {/* View Modal */}
        {selectedNote && (
          <div className="overlay" onClick={() => setSelectedNote(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">
                  <em style={{ fontStyle: 'italic', color: '#c9a96e' }}>{selectedNote.title}</em>
                </span>
                <button className="modal-close" onClick={() => setSelectedNote(null)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <p style={{
                fontSize: '0.925rem', color: '#4a3f38', lineHeight: 1.75,
                fontWeight: 300, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                overflowWrap: 'break-word', maxHeight: '60vh', overflowY: 'auto',
                padding: '0.25rem 0 0.5rem',
              }}>
                {selectedNote.description}
              </p>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setSelectedNote(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Add / Edit Modal */}
        {modalOpen && (
          <div className="overlay" onClick={() => setModalOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">
                  {editNote ? 'Edit' : 'New'} <em style={{ fontStyle: 'italic', color: '#c9a96e' }}>Note</em>
                </span>
                <button className="modal-close" onClick={() => setModalOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <input placeholder="Title…" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
              <textarea placeholder="Write your note here…" value={body} onChange={e => setBody(e.target.value)} />
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                <button className="btn-save" onClick={handleSave}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {editNote ? 'Save Changes' : 'Save Note'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteId && (
          <div className="overlay" onClick={() => setDeleteId(null)}>
            <div className="delete-modal" onClick={e => e.stopPropagation()}>
              <div className="delete-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </div>
              <div className="delete-title">Delete note?</div>
              <div className="delete-sub">This can't be undone. The note will be permanently removed.</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                <button className="btn-cancel" onClick={() => setDeleteId(null)}>Keep it</button>
                <button className="btn-delete" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}