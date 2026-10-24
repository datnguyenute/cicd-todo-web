'use client';

import { FormEvent, useEffect, useState } from 'react';

type Todo = { id: number; title: string; done: boolean };
type Health = { env: string; version: string; db: string };

// NEXT_PUBLIC_* được THAY THẲNG vào code JS lúc `next build`.
// → Đổi giá trị thì phải BUILD LẠI image, set env lúc `docker run` sẽ không có tác dụng.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const WEB_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? 'local';
const WEB_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev';

const ENV_COLORS: Record<string, string> = { dev: '#2563eb', test: '#d97706', prod: '#dc2626' };

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState('');

  async function call<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, { ...init, headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${path}`);
    return res.json();
  }

  async function load() {
    try {
      setTodos(await call<Todo[]>('/todos'));
      setError('');
    } catch (e) {
      setError(`Không gọi được API ${API_URL}: ${e}`);
    }
  }

  useEffect(() => {
    call<Health>('/health').then(setHealth).catch(() => setHealth(null));
    load();
  }, []);

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await call('/todos', { method: 'POST', body: JSON.stringify({ title }) });
    setTitle('');
    load();
  }

  async function toggle(id: number) {
    await call(`/todos/${id}/toggle`, { method: 'PATCH' });
    load();
  }

  return (
    <main>
      {/* Thanh màu theo môi trường: nhìn là biết đang ở dev/test/prod, tránh thao tác nhầm */}
      <div style={{ background: ENV_COLORS[WEB_ENV] ?? '#6b7280', color: 'white', padding: '6px 12px', borderRadius: 6, fontSize: 13 }}>
        WEB: <b>{WEB_ENV}</b> v{WEB_VERSION} &nbsp;·&nbsp; API:{' '}
        {health ? (
          <>
            <b>{health.env}</b> v{health.version} · db {health.db}
          </>
        ) : (
          'không kết nối được'
        )}
      </div>

      <h1>Todo</h1>

      <form onSubmit={add} style={{ display: 'flex', gap: 8 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Việc cần làm…" style={{ flex: 1, padding: 6 }} />
        <button type="submit">Thêm</button>
      </form>

      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {todos.map((t) => (
          <li key={t.id} style={{ padding: '6px 0' }}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />{' '}
              <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
            </label>
          </li>
        ))}
      </ul>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </main>
  );
}
