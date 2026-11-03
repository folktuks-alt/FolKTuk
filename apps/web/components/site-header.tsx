'use client';

import Link from 'next/link';
import { useAuth } from './auth-context';
import { NotificationBell } from './notification-bell';
import { get } from '../lib/api';
import type { SearchResult } from '../lib/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function SiteHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult | null>(null);

  useEffect(() => {
    const value = query.trim();
    if (!value) {
      setSuggestions(null);
      return;
    }
    const timer = window.setTimeout(() => {
      get<SearchResult>(`/search?q=${encodeURIComponent(value)}&type=all`)
        .then(setSuggestions)
        .catch(() => setSuggestions(null));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="border-b border-ink/5 bg-cream/90">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-4">
        <Link href="/" className="text-2xl font-black tracking-tight text-moss">FolkTuk<span className="text-coral">.</span></Link>
        <form className="relative order-last w-full md:order-none md:mx-auto md:max-w-xl" role="search" onSubmit={submit}>
          <input className="field bg-white/80 py-2.5" aria-label="Search posts and communities" placeholder="Search posts, communities, and tags..." value={query} onChange={(event) => setQuery(event.target.value)} />
          {suggestions && <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-black/5 bg-white p-2 shadow-soft">
            {suggestions.posts.slice(0, 3).map((post) => <button type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-cream" key={post.id} onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}><strong>{post.title}</strong><span className="ml-2 text-ink/50">Post</span></button>)}
            {suggestions.communities.slice(0, 3).map((community) => <button type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-cream" key={community.id} onClick={() => router.push(`/communities/${community.id}`)}><strong>{community.name}</strong><span className="ml-2 text-ink/50">Community</span></button>)}
            {suggestions.users.slice(0, 3).map((entry) => <button type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-cream" key={entry.id} onClick={() => router.push(`/profile/${entry.id}`)}><strong>{entry.profile?.displayName || entry.profile?.username}</strong><span className="ml-2 text-ink/50">User</span></button>)}
            {!suggestions.posts.length && !suggestions.communities.length && !suggestions.users.length && <p className="px-3 py-2 text-sm text-ink/60">Press Enter to search for &quot;{query}&quot;</p>}
          </div>}
        </form>
        <nav className="ml-auto flex shrink-0 items-center gap-4 text-sm font-semibold">
          {user ? <><NotificationBell /><Link className="hidden sm:block" href="/profile">{user.profile?.displayName || user.email}</Link><button onClick={logout}>Log out</button></> : <><Link href="/login">Log in</Link><Link href="/register" className="button-primary">Join FolkTuk</Link></>}
        </nav>
      </div>
    </header>
  );
}
