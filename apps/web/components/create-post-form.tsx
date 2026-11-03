'use client';

import { FormEvent, useState } from 'react';
import { post } from '../lib/api';
import { useAuth } from './auth-context';
import type { Post } from '../lib/types';

export function CreatePostForm({ onCreated }: { onCreated: (post: Post) => void }) {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  if (!token) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const created = await post<Post>('/posts', { title, content, published: true });
      setTitle('');
      setContent('');
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create post');
    }
  }

  return <form className="card mb-8 space-y-3" onSubmit={submit}>
    <h2 className="text-lg font-bold">Start a conversation</h2>
    {error && <p className="text-sm text-coral">{error}</p>}
    <input className="field" placeholder="Post title" value={title} onChange={(e) => setTitle(e.target.value)} required />
    <textarea className="field min-h-24 resize-y" placeholder="What&apos;s on your mind?" value={content} onChange={(e) => setContent(e.target.value)} required />
    <button className="button-primary">Publish post</button>
  </form>;
}
