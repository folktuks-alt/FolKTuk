'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PostFeed } from '../../../components/post-feed';
import { useAuth } from '../../../components/auth-context';
import { get, post } from '../../../lib/api';
import type { Community } from '../../../lib/types';

type JoinedCommunity = { community: { id: string } };

export default function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { token } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [communityId, setCommunityId] = useState('');
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      setCommunityId(id);
      get<Community>(`/communities/${id}?page=1&limit=10`)
        .then(setCommunity)
        .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Unable to load community'));
    });
  }, [params]);

  useEffect(() => {
    if (!token) {
      setJoined(false);
      return;
    }
    get<JoinedCommunity[]>('/communities/joined')
      .then((items) => setJoined(items.some(({ community: item }) => item.id === community?.id)))
      .catch(() => setJoined(false));
  }, [community?.id, token]);

  async function toggleMembership() {
    if (!token || !community) return;
    setBusy(true);
    setError('');
    try {
      await post(`/communities/${community.id}/${joined ? 'leave' : 'join'}`);
      setJoined(!joined);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update membership');
    } finally {
      setBusy(false);
    }
  }

  if (error && !community) return <p className="text-coral">{error}</p>;
  if (!community) return <p className="text-ink/60">Loading community...</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/communities" className="text-sm font-semibold text-moss hover:text-ink">← All communities</Link>
      <section className="card mt-4 overflow-hidden p-0">
        {community.bannerUrl && <img src={community.bannerUrl} alt="" className="h-32 w-full object-cover" />}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {community.avatarUrl ? <img src={community.avatarUrl} alt="" className="h-16 w-16 rounded-2xl object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-coral/15 text-2xl font-black text-coral">r/</div>}
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-coral">Community</p>
                <h1 className="text-3xl font-black">{community.name}</h1>
              </div>
            </div>
            <button className="button-primary" onClick={toggleMembership} disabled={!token || busy}>
              {!token ? 'Log in to join' : busy ? 'Updating...' : joined ? 'Leave' : 'Join'}
            </button>
          </div>
          <p className="mt-5 text-ink/65">{community.description || 'A place to connect and share.'}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-ink/60">
            <span><strong className="text-ink">{community.memberCount ?? 0}</strong> members</span>
            <span>Created {new Date(community.createdAt).toLocaleDateString()}</span>
          </div>
          {community.topics && community.topics.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{community.topics.map((topic) => <span className="rounded-full bg-moss/10 px-3 py-1 text-xs font-semibold text-moss" key={topic}>{topic}</span>)}</div>}
          {error && <p className="mt-4 text-sm text-coral">{error}</p>}
        </div>
      </section>
      <h2 className="mb-4 mt-10 text-2xl font-bold">Community posts</h2>
      <PostFeed communityId={communityId || community.id} />
    </div>
  );
}
