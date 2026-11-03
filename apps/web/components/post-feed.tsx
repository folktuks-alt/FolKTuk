'use client';

import { useEffect, useState } from 'react';
import { get } from '../lib/api';
import type { Page, Post } from '../lib/types';
import { PostCard } from './post-card';
import { CreatePostForm } from './create-post-form';
import { useAuth } from './auth-context';

export function PostFeed({ communityId }: { communityId?: string }) {
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Page<Post> | null>(null);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: '10', sort });
    if (communityId) params.set('communityId', communityId);
    get<Page<Post>>(`/posts?${params}`).then(setResult).catch((e) => setError(e.message));
  }, [communityId, page, sort]);

  return <div className="space-y-5">
    {!communityId && token && <CreatePostForm onCreated={() => setPage(1)} />}
    {!communityId && <div className="flex gap-2"><button className={sort === 'latest' ? 'button-primary' : 'button-quiet'} onClick={() => { setSort('latest'); setPage(1); }}>Latest</button><button className={sort === 'popular' ? 'button-primary' : 'button-quiet'} onClick={() => { setSort('popular'); setPage(1); }}>Popular</button></div>}
    {error && <p className="text-coral">{error}</p>}
    {result?.data.map((item) => <PostCard key={item.id} item={item} />)}
    {result && <div className="flex items-center justify-between text-sm"><span>{result.total} posts</span><div className="flex gap-2"><button className="button-quiet" disabled={page === 1} onClick={() => setPage((n) => n - 1)}>Previous</button><span className="px-3 py-2">Page {page}</span><button className="button-quiet" disabled={page * result.limit >= result.total} onClick={() => setPage((n) => n + 1)}>Next</button></div></div>}
  </div>;
}
