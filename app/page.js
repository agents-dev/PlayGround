'use client';

import { useEffect, useMemo, useState } from 'react';
import './globals.css';

const STORAGE_KEY = 'nextjs-todos-v1';

function loadTodos() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Page() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTodos(loadTodos());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {}
  }, [todos, loaded]);

  const remaining = todos.filter((t) => !t.done).length;

  const visible = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.done);
    if (filter === 'completed') return todos.filter((t) => t.done);
    return todos;
  }, [todos, filter]);

  function addTodo(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), text, done: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInput('');
  }

  function toggleTodo(id) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function startEdit(todo) {
    setEditingId(todo.id);
    setEditingText(todo.text);
  }

  function saveEdit(id) {
    const text = editingText.trim();
    if (!text) {
      deleteTodo(id);
    } else {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
    }
    setEditingId(null);
    setEditingText('');
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.done));
  }

  function toggleAll() {
    const allDone = todos.length > 0 && todos.every((t) => t.done);
    setTodos((prev) => prev.map((t) => ({ ...t, done: !allDone })));
  }

  return (
    <main className="page">
      <div className="card">
        <header className="header">
          <h1>Todo List</h1>
          <p className="subtitle">Next.js · static export · localStorage</p>
        </header>

        <form className="add-row" onSubmit={addTodo}>
          {todos.length > 0 && (
            <button type="button" className="toggle-all" onClick={toggleAll} title="Toggle all" aria-label="Toggle all">
              ❯
            </button>
          )}
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
          />
          <button className="btn primary" type="submit">
            Add
          </button>
        </form>

        <div className="filters">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              className={`chip ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
          <span className="count">{remaining} left</span>
        </div>

        <ul className="list">
          {visible.length === 0 && (
            <li className="empty">
              {todos.length === 0 ? 'No todos yet — add your first one above.' : 'Nothing in this filter.'}
            </li>
          )}
          {visible.map((todo) => (
            <li key={todo.id} className={`item ${todo.done ? 'done' : ''}`}>
              <button
                className="checkbox"
                onClick={() => toggleTodo(todo.id)}
                aria-label={todo.done ? 'Mark as active' : 'Mark as completed'}
              >
                {todo.done ? '✓' : ''}
              </button>
              {editingId === todo.id ? (
                <input
                  className="input edit"
                  value={editingText}
                  autoFocus
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => saveEdit(todo.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(todo.id);
                    if (e.key === 'Escape') {
                      setEditingId(null);
                      setEditingText('');
                    }
                  }}
                />
              ) : (
                <span className="text" onDoubleClick={() => startEdit(todo)} title="Double-click to edit">
                  {todo.text}
                </span>
              )}
              <div className="actions">
                {editingId !== todo.id && (
                  <button className="icon-btn" onClick={() => startEdit(todo)} title="Edit">
                    ✎
                  </button>
                )}
                <button className="icon-btn danger" onClick={() => deleteTodo(todo.id)} title="Delete">
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>

        <footer className="footer">
          <span>{todos.length} total · {todos.filter((t) => t.done).length} completed</span>
          {todos.some((t) => t.done) && (
            <button className="btn ghost" onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </footer>
      </div>
      <p className="hint">Double-click a todo to edit. Todos persist in your browser.</p>
    </main>
  );
}
