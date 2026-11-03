'use client';

import { useState } from 'react';
import { post, remove } from '../lib/api';
import type { Post } from '../lib/types';
import { useAuth } from './auth-context';

export function PostCard({ item }: { item: Post }) {
  const { token } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(item.likes?.length ?? 0);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  async function toggleLike() {
    if (!token || busy) return;
    setBusy(true);
    try {
      if (liked) { await remove(`/posts/${item.id}/like`); setCount((n) => n - 1); }
      else { await post(`/posts/${item.id}/like`); setCount((n) => n + 1); }
      setLiked(!liked);
    } finally { setBusy(false); }
  }
  async function addComment(event: React.FormEvent) {
    event.preventDefault();
    if (!comment.trim() || !token) return;
    await post(`/posts/${item.id}/comments`, { content: comment });
    setComment('');
  }

  return <article className="card">
    <div className="mb-3 flex items-center justify-between text-xs text-ink/50"><span>FolkTuk community</span><time>{new Date(item.createdAt).toLocaleDateString()}</time></div>
    <h2 className="text-xl font-bold">{item.title}</h2>
    <p className="mt-2 whitespace-pre-wrap leading-7 text-ink/75">{item.content}</p>
    <div className="mt-5 flex items-center gap-3 border-t border-ink/5 pt-4">
      <button className="button-quiet text-sm" onClick={toggleLike} disabled={!token}>{liked ? '♥ Liked' : '♡ Like'} · {count}</button>
      {token && <form onSubmit={addComment} className="flex flex-1 gap-2"><input className="field py-2" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." /><button className="button-primary py-2">Send</button></form>}
    </div>
  </article>;
}
