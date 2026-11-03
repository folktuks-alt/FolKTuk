'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { get } from '../lib/api';
import { useAuth } from './auth-context';
import type { TrendingTag, TrendingTopic } from '../lib/types';
import { CreateCommunityModal } from './create-community-modal';

type Membership = { community: { id: string; name: string; slug: string } };

export function DashboardSidebar() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <aside className="space-y-5">
      <button className="button-primary w-full" onClick={() => setModalOpen(true)}>+ Create Community</button>
      {modalOpen && <CreateCommunityModal onClose={() => setModalOpen(false)} />}
      <details className="card md:hidden">
        <summary className="cursor-pointer font-bold text-moss">☰ Open navigation</summary>
        <div className="mt-3 space-y-1">
          <Link className="dashboard-link" href="/">🏠 <span>Home / Feed</span></Link>
          <a className="dashboard-link" href="#trending">🔥 <span>Trending</span></a>
          <Link className="dashboard-link" href="/communities">🌐 <span>Communities</span></Link>
          <Link className="dashboard-link" href="/profile">👤 <span>Profile</span></Link>
        </div>
      </details>
      <nav className="card hidden md:block">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink/50">Navigate</p>
        <div className="space-y-1">
          <Link className="dashboard-link" href="/">🏠 <span>Home / Feed</span></Link>
          <a className="dashboard-link" href="#trending">🔥 <span>Trending</span></a>
          <Link className="dashboard-link" href="/communities">🌐 <span>Communities</span></Link>
          <Link className="dashboard-link" href="/profile">👤 <span>Profile</span></Link>
        </div>
      </nav>
    </aside>
  );
}

export function CommunitySidebar({ onTopicSelect }: { onTopicSelect: (topic: string) => void }) {
  const { token } = useAuth();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [tags, setTags] = useState<TrendingTag[]>([]);
  const [loadingMemberships, setLoadingMemberships] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setMemberships([]);
      setLoadingMemberships(false);
      return;
    }

    setLoadingMemberships(true);
    get<Membership[]>('/communities/joined')
      .then(setMemberships)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unable to load communities'))
      .finally(() => setLoadingMemberships(false));
  }, [token]);

  useEffect(() => {
    get<TrendingTopic[]>('/posts/trending')
      .then(setTopics)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unable to load trending topics'))
      .finally(() => setLoadingTopics(false));
  }, []);

  useEffect(() => {
    get<TrendingTag[]>('/tags/trending')
      .then(setTags)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unable to load trending tags'));
  }, []);

  return (
    <aside className="hidden space-y-5 lg:block">
      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">My joined communities</h2>
          <Link className="text-sm font-semibold text-moss" href="/communities">View all</Link>
        </div>
        {loadingMemberships ? (
          <div className="mt-4 space-y-2" aria-label="Loading communities">
            <div className="skeleton-line" /><div className="skeleton-line" />
          </div>
        ) : memberships.length > 0 ? (
          <div className="mt-4 space-y-2">
            {memberships.map(({ community }) => (
              <Link className="dashboard-link px-0" href={`/communities/${community.id}`} key={community.id}>
                <span className="text-coral">r/</span><span>{community.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-ink/60">
            {token ? 'Join a community to see it here.' : 'Log in to see your communities.'}
          </p>
        )}
      </section>
      <section className="card" id="trending">
        <h2 className="font-bold">Trending topics</h2>
        {error && <p className="mt-3 text-sm text-coral">{error}</p>}
        {loadingTopics ? <div className="mt-4 space-y-2" aria-label="Loading trending topics"><div className="skeleton-line" /><div className="skeleton-line" /></div> : topics.length > 0 ? <div className="mt-4 space-y-3">{topics.map(({ topic, count }) => <button className="flex w-full items-center justify-between text-left text-sm" key={topic} onClick={() => onTopicSelect(topic)}><span className="font-semibold text-moss">{topic}</span><span className="text-ink/45">{count} posts</span></button>)}</div> : <p className="mt-3 text-sm text-ink/60">No trending topics yet.</p>}
      </section>
      <section className="card">
        <h2 className="font-bold">Trending tags</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => <button className="rounded-full bg-moss/10 px-3 py-1 text-xs font-semibold text-moss hover:bg-moss/20" key={tag} onClick={() => onTopicSelect(tag)}>{tag} <span className="text-ink/45">{count}</span></button>)}
        </div>
      </section>
    </aside>
  );
}
