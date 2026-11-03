'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API_URL, get } from '../lib/api';
import type { CursorPage, Post } from '../lib/types';
import { PostCard } from './post-card';
import { CreatePostForm } from './create-post-form';
import { useAuth } from './auth-context';

export function PostFeed({ communityId, topic, authorId }: { communityId?: string; topic?: string; authorId?: string }) {
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const [result, setResult] = useState<CursorPage<Post> | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams({ limit: '10', sort });
    if (communityId) params.set('communityId', communityId);
    if (authorId) params.set('authorId', authorId);
    if (topic) params.set('topic', topic);
    setLoading(true);
    setError('');
    get<CursorPage<Post>>(`/posts?${params}`)
      .then(setResult)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unable to load posts'))
      .finally(() => setLoading(false));
  }, [authorId, communityId, sort, topic]);

  async function loadMore() {
    if (!result?.nextCursor || loadingMore) return;
    const params = new URLSearchParams({ limit: '10', sort, cursor: result.nextCursor });
    if (communityId) params.set('communityId', communityId);
    if (authorId) params.set('authorId', authorId);
    if (topic) params.set('topic', topic);
    setLoadingMore(true);
    setError('');
    try {
      const next = await get<CursorPage<Post>>(`/posts?${params}`);
      setResult((current) => current ? {
        items: [...current.items, ...next.items.filter((item) => !current.items.some((existing) => existing.id === item.id))],
        nextCursor: next.nextCursor,
      } : next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unable to load more posts');
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    const socket = io(API_URL, { auth: { token } });
    const handlePostCreated = (newPost: Post) => {
      if (!newPost.published || (authorId && newPost.authorId !== authorId) || (communityId && newPost.communityId !== communityId)) return;
      if (topic && !`${newPost.title} ${newPost.content}`.toLowerCase().includes(topic.toLowerCase())) return;
      setResult((current) => {
        if (!current || current.items.some((post) => post.id === newPost.id)) return current;
        return { ...current, items: [newPost, ...current.items] };
      });
    };

    socket.on('post:created', handlePostCreated);
    socket.on('connect_error', () => undefined);
    return () => {
      socket.off('post:created', handlePostCreated);
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [authorId, communityId, token, topic]);

  return <div className="space-y-5">
    {!communityId && !authorId && token && <CreatePostForm onCreated={(created) => setResult((current) => current && current.items.every((item) => item.id !== created.id) ? { ...current, items: [created, ...current.items] } : current)} />}
    {!communityId && !authorId && <div className="flex gap-2"><button className={sort === 'latest' ? 'button-primary' : 'button-quiet'} onClick={() => setSort('latest')}>Latest</button><button className={sort === 'popular' ? 'button-primary' : 'button-quiet'} onClick={() => setSort('popular')}>Popular</button></div>}
    {error && <p className="text-coral">{error}</p>}
    {loading && <p className="text-ink/60">Loading posts...</p>}
    {!loading && result?.items.length === 0 && <p className="text-ink/60">No posts yet. Be the first to start a conversation!</p>}
    {!loading && result?.items.map((item) => <PostCard key={item.id} item={item} />)}
    {result?.nextCursor && <button className="button-quiet w-full" onClick={loadMore} disabled={loadingMore}>{loadingMore ? 'Loading...' : 'Load more posts'}</button>}
  </div>;
}
