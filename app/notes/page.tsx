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
    setEditNote(null); setTitle(''); setBody(''); setModalOpen(true)
  }

  const openEdit = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditNote(note); setTitle(note.title); setBody(note.description); setModalOpen(true)
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
    setTitle(''); setBody(''); setModalOpen(false); setEditNote(null)
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
    document.cookie = 'token=; path=/; max-age=0'
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
          min-height: 100vh; min-height: 100dvh;
          background: #e8e4dc; padding: 1.5rem 1rem 5rem; position: relative;
        }
        @media (min-width: 480px) { .notes-root { padding: 2rem 1.5rem 5rem; } }
        @media (min-width: 768px) { .notes-root { padding: 3rem 2.5rem 3rem; } }

        .notes-root::before {
          content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: radial-gradient(circle, #b0aa9f 1px, transparent 1px);
          background-size: 24px 24px; opacity: 0.18;
        }

        .header {
          position: relative; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.75rem; gap: 0.75rem;
        }
        @media (min-width: 768px) { .header { margin-bottom: 2.5rem; } }

        .page-title { font-family: 'Lora', serif; font-size: 1.6rem; font-weight: 700; color: #1a1714; letter-spacing: -0.02em; line-height: 1.1; }
        @media (min-width: 480px) { .page-title { font-size: 1.85rem; } }
        @media (min-width: 768px) { .page-title { font-size: 2rem; } }
        .page-title em { font-style: italic; color: #c9a96e; }

        .header-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        .add-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          background: #1a1714; color: #faf8f4; border: none; border-radius: 12px;
          padding: 0.65rem 0.85rem; font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; font-weight: 600; letter-spacing: 0.03em; cursor: pointer;
          box-shadow: 0 4px 14px #1a171433;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          min-height: 40px; white-space: nowrap;
        }
        @media (min-width: 480px) { .add-btn { padding: 0.7rem 1.1rem; gap: 8px; } }
        @media (min-width: 768px) { .add-btn { padding: 0.75rem 1.25rem; } }
        .add-btn:hover { background: #2c2620; transform: translateY(-2px); box-shadow: 0 8px 22px #1a171444; }
        .add-btn:active { transform: translateY(0); }
        .add-btn-label { display: none; }
        @media (min-width: 400px) { .add-btn-label { display: inline; } }

        .profile-wrap { position: relative; z-index: 10; }

        .profile-avatar-btn {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #1a1714, #3a3028);
          border: 2.5px solid #e5dfd6; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 700; color: #c9a96e;
          cursor: pointer; box-shadow: 0 2px 8px #1a171420;
          transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
          outline: none; position: relative;
          -webkit-tap-highlight-color: transparent; flex-shrink: 0;
        }
        @media (min-width: 480px) { .profile-avatar-btn { width: 40px; height: 40px; font-size: 0.9rem; } }
        .profile-avatar-btn:hover { border-color: #c9a96e; transform: translateY(-1px); }
        .profile-avatar-btn.open { border-color: #c9a96e; box-shadow: 0 0 0 3px #c9a96e22; }
        .profile-avatar-btn::after {
          content: ''; position: absolute; bottom: 1px; right: 1px;
          width: 9px; height: 9px; background: #22c55e;
          border-radius: 50%; border: 2px solid #e8e4dc;
        }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .profile-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: #faf8f4; border: 1.5px solid #e5dfd6; border-radius: 16px;
          padding: 0.5rem; min-width: 190px;
          box-shadow: 0 2px 0 #e8e0d4, 0 6px 0 #ede6db, 0 16px 40px #1a171428;
          z-index: 200; animation: dropIn 0.2s cubic-bezier(.22,1,.36,1) both;
        }
        .dropdown-header { display: flex; align-items: center; gap: 10px; padding: 0.75rem 0.75rem 0.85rem; border-bottom: 1px solid #f0ece5; margin-bottom: 0.4rem; }
        .dropdown-avatar { width: 34px; height: 34px; flex-shrink: 0; background: linear-gradient(135deg, #1a1714, #3a3028); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: #c9a96e; }
        .dropdown-label { font-size: 0.62rem; font-weight: 600; color: #b5ada4; letter-spacing: 0.09em; text-transform: uppercase; margin-bottom: 1px; }
        .dropdown-username { font-size: 0.85rem; font-weight: 600; color: #1a1714; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 110px; }
        .dropdown-item {
          display: flex; align-items: center; gap: 9px; width: 100%; background: none; border: none;
          border-radius: 9px; padding: 0.65rem 0.75rem; font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 500; color: #6b635a; cursor: pointer;
          transition: background 0.15s, color 0.15s; text-align: left; min-height: 40px;
          -webkit-tap-highlight-color: transparent;
        }
        .dropdown-item:hover { background: #f0ece5; color: #1a1714; }
        .dropdown-item.danger { color: #c0392b; }
        .dropdown-item.danger:hover { background: #fde8e8; color: #a93226; }

        /* ── NOTES GRID ── */
        .notes-list { list-style: none; display: grid; grid-template-columns: 1fr; gap: 0.75rem; position: relative; z-index: 1; }
        @media (min-width: 480px) { .notes-list { grid-template-columns: repeat(2, 1fr); gap: 0.875rem; } }
        @media (min-width: 768px) { .notes-list { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; } }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .note-item {
          background: #faf8f4; border: 1.5px solid #e5dfd6; border-radius: 14px; padding: 1rem;
          box-shadow: 0 2px 8px #1a171410;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
          position: relative; animation: cardIn 0.35s cubic-bezier(.22,1,.36,1) both;
          cursor: pointer; -webkit-tap-highlight-color: transparent;
          display: flex; flex-direction: column;
        }
        @media (min-width: 768px) { .note-item { border-radius: 16px; padding: 1.25rem; } }
        .note-item:hover { transform: translateY(-3px); box-shadow: 0 8px 24px #1a171420; border-color: #cfc4b8; }

        .note-title { font-family: 'Lora', serif; font-size: 0.95rem; font-weight: 700; color: #1a1714; letter-spacing: -0.01em; margin-bottom: 0.4rem; line-height: 1.3; }
        @media (min-width: 768px) { .note-title { font-size: 1rem; padding-right: 3.5rem; } }

        .note-body { font-size: 0.8rem; color: #6b635a; font-weight: 300; line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
        @media (min-width: 768px) { .note-body { font-size: 0.825rem; } }

        /* ── MOBILE ACTION ROW — bottom of card, mobile only ── */
        .note-mobile-actions {
          display: flex; gap: 6px; margin-top: 0.75rem;
          padding-top: 0.65rem; border-top: 1px solid #f0ece5;
        }
        @media (min-width: 768px) { .note-mobile-actions { display: none; } }

        .mobile-action-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
          background: #f0ece5; border: none; border-radius: 8px; padding: 0.5rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 500;
          color: #6b635a; cursor: pointer; transition: background 0.15s, color 0.15s;
          min-height: 34px; -webkit-tap-highlight-color: transparent;
        }
        .mobile-action-btn:active { background: #e5dfd6; }
        .mobile-action-btn.danger { color: #c0392b; }
        .mobile-action-btn.danger:active { background: #fde8e8; }

        /* ── DESKTOP HOVER ACTIONS ── */
        .note-actions { position: absolute; top: 0.85rem; right: 0.85rem; display: none; gap: 4px; }
        @media (min-width: 768px) {
          .note-actions { display: flex; opacity: 0; transition: opacity 0.15s; }
          .note-item:hover .note-actions { opacity: 1; }
        }
        .icon-btn {
          background: #f0ece5; border: none; border-radius: 8px; padding: 6px;
          cursor: pointer; color: #9c9288; display: flex;
          transition: background 0.15s, color 0.15s;
          min-width: 30px; min-height: 30px; align-items: center; justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }
        .icon-btn:hover { background: #e5dfd6; color: #1a1714; }
        .icon-btn.danger:hover { background: #fde8e8; color: #c0392b; }

        .empty { position: relative; z-index: 1; text-align: center; padding: 4rem 1.5rem; }
        .empty-icon { width: 52px; height: 52px; background: #faf8f4; border: 1.5px solid #e5dfd6; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
        .empty-title { font-family: 'Lora', serif; font-size: 1.1rem; font-weight: 700; color: #6b635a; margin-bottom: 0.35rem; }
        .empty-sub { font-size: 0.82rem; color: #b5ada4; font-weight: 300; }

        .fab {
          display: flex; position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 40;
          background: #1a1714; color: #faf8f4; border: none; border-radius: 50%;
          width: 54px; height: 54px; align-items: center; justify-content: center;
          box-shadow: 0 6px 20px #1a171455; cursor: pointer;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .fab:active { transform: scale(0.93); }
        @media (min-width: 768px) { .fab { display: none; } }

        .overlay {
          position: fixed; inset: 0; z-index: 50; background: #1a171466;
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          display: flex; align-items: flex-end; justify-content: center;
          padding: 0; animation: overlayIn 0.2s ease both;
        }
        @media (min-width: 600px) { .overlay { align-items: center; padding: 2rem; } }

        .modal {
          background: #faf8f4; border-radius: 20px 20px 0 0;
          padding: 1.5rem 1.25rem 2rem; width: 100%; max-width: 100%;
          box-shadow: 0 -4px 40px #1a171440;
          animation: sheetUp 0.35s cubic-bezier(.22,1,.36,1) both;
          max-height: 90dvh; overflow-y: auto;
        }
        @media (min-width: 600px) {
          .modal { border-radius: 20px; padding: 2rem; max-width: 460px; box-shadow: 0 2px 0 #e8e0d4, 0 8px 0 #ede6db, 0 24px 80px #1a171455; animation: modalIn 0.3s cubic-bezier(.22,1,.36,1) both; max-height: none; }
        }
        .modal::before { content: ''; display: block; width: 36px; height: 4px; background: #e0d9d0; border-radius: 99px; margin: 0 auto 1.25rem; }
        @media (min-width: 600px) { .modal::before { display: none; } }

        .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
        .modal-title { font-family: 'Lora', serif; font-size: 1.2rem; font-weight: 700; color: #1a1714; letter-spacing: -0.02em; }
        .modal-close { background: #f0ece5; border: none; border-radius: 8px; padding: 7px; cursor: pointer; color: #9c9288; display: flex; transition: background 0.15s, color 0.15s; min-width: 34px; min-height: 34px; align-items: center; justify-content: center; -webkit-tap-highlight-color: transparent; }
        .modal-close:hover { background: #e5dfd6; color: #1a1714; }

        .modal input, .modal textarea {
          width: 100%; background: #f0ece5; border: 1.5px solid #e5dfd6; border-radius: 12px;
          padding: 0.8rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 1rem; color: #1a1714; outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          margin-bottom: 0.75rem; -webkit-appearance: none; display: block; appearance: none;
        }
        @media (min-width: 600px) { .modal input, .modal textarea { font-size: 0.9rem; } }
        .modal input::placeholder, .modal textarea::placeholder { color: #c0b8ae; }
        .modal input:focus, .modal textarea:focus { border-color: #c9a96e; background: #fffefb; box-shadow: 0 0 0 3px #c9a96e33; }
        .modal textarea { resize: none; min-height: 130px; line-height: 1.65; margin-bottom: 1.25rem; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 10px; }

        .btn-cancel { background: #f0ece5; border: none; border-radius: 10px; padding: 0.75rem 1.1rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; color: #6b635a; cursor: pointer; transition: background 0.15s; min-height: 44px; -webkit-tap-highlight-color: transparent; }
        .btn-cancel:hover { background: #e5dfd6; }

        .btn-save { background: #1a1714; border: none; border-radius: 10px; padding: 0.75rem 1.25rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600; color: #faf8f4; cursor: pointer; box-shadow: 0 4px 14px #1a171433; display: flex; align-items: center; gap: 7px; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; min-height: 44px; -webkit-tap-highlight-color: transparent; }
        .btn-save:hover { background: #2c2620; transform: translateY(-1px); }
        .btn-save:active { transform: translateY(0); }

        .delete-modal { background: #faf8f4; border-radius: 20px 20px 0 0; padding: 1.5rem 1.5rem 2.5rem; width: 100%; max-width: 100%; text-align: center; box-shadow: 0 -4px 40px #1a171440; animation: sheetUp 0.35s cubic-bezier(.22,1,.36,1) both; }
        @media (min-width: 600px) { .delete-modal { border-radius: 18px; padding: 1.75rem; max-width: 340px; box-shadow: 0 2px 0 #e8e0d4, 0 8px 0 #ede6db, 0 24px 60px #1a171455; animation: modalIn 0.3s cubic-bezier(.22,1,.36,1) both; } .delete-modal::before { display: none; } }
        .delete-modal::before { content: ''; display: block; width: 36px; height: 4px; background: #e0d9d0; border-radius: 99px; margin: 0 auto 1.25rem; }
        .delete-icon { width: 48px; height: 48px; background: #fde8e8; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #c0392b; }
        .delete-title { font-family: 'Lora', serif; font-size: 1.05rem; font-weight: 700; color: #1a1714; margin-bottom: 0.4rem; }
        .delete-sub { font-size: 0.8rem; color: #9c9288; margin-bottom: 1.25rem; line-height: 1.5; }
        .btn-delete { background: #c0392b; border: none; border-radius: 10px; padding: 0.75rem 1.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600; color: #fff; cursor: pointer; transition: background 0.2s; min-height: 44px; -webkit-tap-highlight-color: transparent; }
        .btn-delete:hover { background: #a93226; }

        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes sheetUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="notes-root" onClick={() => setProfileOpen(false)}>

        <div className="header">
          <h1 className="page-title">Apex <em>Notes</em></h1>
          <div className="header-right">
            <button className="add-btn" onClick={openAdd} style={{ display: 'none' }}
              ref={el => { if (el) el.style.display = 'flex' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="add-btn-label">Add Note</span>
            </button>

            <div className="profile-wrap" onClick={e => e.stopPropagation()}>
              <button className={`profile-avatar-btn ${profileOpen ? 'open' : ''}`} onClick={() => setProfileOpen(p => !p)} aria-label="Profile menu">
                {initial}
              </button>
              {profileOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={() => setProfileOpen(false)} />
                  <div className="profile-dropdown" style={{ zIndex: 200 }}>
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">{initial}</div>
                      <div>
                        <div className="dropdown-label">Signed in as</div>
                        <div className="dropdown-username">@{username}</div>
                      </div>
                    </div>
                    <button className="dropdown-item danger" onClick={handleLogout}>Logout</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c0b8ae" strokeWidth="1.5" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="empty-title">No notes yet</div>
            <div className="empty-sub">Tap + to create your first note</div>
          </div>
        ) : (
          <ul className="notes-list">
            {notes.map((note, i) => (
              <li key={note._id} className="note-item" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => setSelectedNote(note)}>

                {/* Desktop: hover icons top-right */}
                <div className="note-actions">
                  <button className="icon-btn" onClick={e => openEdit(note, e)} title="Edit">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button className="icon-btn danger" onClick={e => { e.stopPropagation(); setDeleteId(note._id) }} title="Delete">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>

                <h2 className="note-title">{note.title}</h2>
                <p className="note-body">{note.description}</p>

                {/* Mobile: Edit + Delete buttons at bottom of card */}
                <div className="note-mobile-actions">
                  <button className="mobile-action-btn" onClick={e => openEdit(note, e)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button className="mobile-action-btn danger" onClick={e => { e.stopPropagation(); setDeleteId(note._id) }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
                    </svg>
                    Delete
                  </button>
                </div>

              </li>
            ))}
          </ul>
        )}

        <button className="fab" onClick={openAdd} aria-label="Add note">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {selectedNote && (
          <div className="overlay" onClick={() => setSelectedNote(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title"><em style={{ fontStyle: 'italic', color: '#c9a96e' }}>{selectedNote.title}</em></span>
                <button className="modal-close" onClick={() => setSelectedNote(null)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <p style={{ fontSize: '0.925rem', color: '#4a3f38', lineHeight: 1.75, fontWeight: 300, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', maxHeight: '55dvh', overflowY: 'auto', padding: '0.25rem 0 0.5rem' }}>
                {selectedNote.description}
              </p>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setSelectedNote(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {modalOpen && (
          <div className="overlay" onClick={() => setModalOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">{editNote ? 'Edit' : 'New'} <em style={{ fontStyle: 'italic', color: '#c9a96e' }}>Note</em></span>
                <button className="modal-close" onClick={() => setModalOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <input placeholder="Title…" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
              <textarea placeholder="Write your note here…" value={body} onChange={e => setBody(e.target.value)} />
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                <button className="btn-save" onClick={handleSave}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {editNote ? 'Save Changes' : 'Save Note'}
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="overlay" onClick={() => setDeleteId(null)}>
            <div className="delete-modal" onClick={e => e.stopPropagation()}>
              <div className="delete-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
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