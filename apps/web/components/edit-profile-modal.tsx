'use client';

import { useState } from 'react';
import { patch } from '../lib/api';
import type { User } from '../lib/types';
import { useAuth } from './auth-context';

type ProfileUpdate = { displayName: string; bio: string; avatarUrl: string; bannerUrl: string };

export function EditProfileModal({ onClose, onSaved }: { onClose: () => void; onSaved?: (user: User) => void }) {
  const { user, updateUser } = useAuth();
  const profile = user?.profile;
  const [form, setForm] = useState<ProfileUpdate>({
    displayName: profile?.displayName ?? '',
    bio: profile?.bio ?? '',
    avatarUrl: profile?.avatarUrl ?? '',
    bannerUrl: profile?.bannerUrl ?? '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function update(field: keyof ProfileUpdate, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (!user) {
        setError('Log in to edit your profile.');
        return;
      }
      const updated = await patch<User>('/users/me', form);
      updateUser(updated);
      onSaved?.(updated);
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
      <form className="card w-full max-w-lg space-y-4" onSubmit={submit}>
        <div className="flex items-center justify-between"><h2 id="edit-profile-title" className="text-2xl font-bold">Edit profile</h2><button type="button" className="text-2xl text-ink/50" onClick={onClose} aria-label="Close">×</button></div>
        {error && <p className="text-sm text-coral">{error}</p>}
        <label className="block text-sm font-semibold">Display name<input className="field mt-1" required value={form.displayName} onChange={(event) => update('displayName', event.target.value)} /></label>
        <label className="block text-sm font-semibold">Bio<textarea className="field mt-1 min-h-24" value={form.bio} onChange={(event) => update('bio', event.target.value)} /></label>
        <label className="block text-sm font-semibold">Avatar URL<input className="field mt-1" type="url" value={form.avatarUrl} onChange={(event) => update('avatarUrl', event.target.value)} placeholder="https://..." /></label>
        <label className="block text-sm font-semibold">Banner URL<input className="field mt-1" type="url" value={form.bannerUrl} onChange={(event) => update('bannerUrl', event.target.value)} placeholder="https://..." /></label>
        <div className="flex justify-end gap-2"><button type="button" className="button-quiet" onClick={onClose}>Cancel</button><button className="button-primary" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button></div>
      </form>
    </div>
  );
}
