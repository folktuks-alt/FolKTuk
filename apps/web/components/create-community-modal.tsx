'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { post } from '../lib/api';
import { useAuth } from './auth-context';
import type { Community } from '../lib/types';

export function CreateCommunityModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!token) {
      setError('Log in to create a community.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const community = await post<Community>('/communities', {
        name,
        slug,
        description: description || undefined,
        topics: topics.split(',').map((topic) => topic.trim()).filter(Boolean),
      });
      onClose();
      router.push(`/communities/${community.id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create community');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5" role="dialog" aria-modal="true" aria-labelledby="create-community-title">
      <form className="card w-full max-w-lg space-y-4" onSubmit={submit}>
        <div className="flex items-center justify-between">
          <h2 id="create-community-title" className="text-2xl font-bold">Create a community</h2>
          <button type="button" className="text-2xl text-ink/50" onClick={onClose} aria-label="Close">×</button>
        </div>
        {error && <p className="text-sm text-coral">{error}</p>}
        <input className="field" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Community name" />
        <input className="field" required value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="Slug (for example: photography)" />
        <textarea className="field min-h-24" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
        <input className="field" value={topics} onChange={(event) => setTopics(event.target.value)} placeholder="Topics, separated by commas" />
        <div className="flex justify-end gap-2">
          <button type="button" className="button-quiet" onClick={onClose}>Cancel</button>
          <button className="button-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create community'}</button>
        </div>
      </form>
    </div>
  );
}
