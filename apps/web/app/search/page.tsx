'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { get } from '../../lib/api';
import type { SearchResult } from '../../lib/types';
import { PostCard } from '../../components/post-card';

type SearchType = 'all' | 'posts' | 'communities' | 'tags';

export default function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<SearchType>('all');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    searchParams.then((params) => {
      setQuery(params.q ?? '');
      const requestedType = params.type;
      if (requestedType === 'posts' || requestedType === 'communities' || requestedType === 'tags') setType(requestedType);
    });
  }, [searchParams]);

  useEffect(() => {
    if (!query.trim()) {
      setResult(null);
      return;
    }
    setError('');
    get<SearchResult>(`/search?q=${encodeURIComponent(query)}&type=${type}`)
      .then(setResult)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Unable to search'));
  }, [query, type]);

  function tab(nextType: SearchType) {
    setType(nextType);
    window.history.replaceState(null, '', `/search?q=${encodeURIComponent(query)}&type=${nextType}`);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-4xl font-black">Discover</h1>
      <p className="mt-2 text-ink/60">Find conversations, communities, and people.</p>
      <form className="mt-6 flex gap-2" onSubmit={(event) => { event.preventDefault(); setQuery(query.trim()); }}>
        <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts, communities, and tags..." />
        <button className="button-primary">Search</button>
      </form>
      <div className="mt-6 flex gap-2 border-b border-ink/10 pb-3">
        {(['all', 'posts', 'communities', 'tags'] as SearchType[]).map((item) => <button className={type === item ? 'button-primary' : 'button-quiet'} key={item} onClick={() => tab(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}
      </div>
      {error && <p className="mt-6 text-coral">{error}</p>}
      {!query.trim() && <p className="mt-8 text-ink/60">Enter a search term to get started.</p>}
      {query.trim() && !result && !error && <p className="mt-8 text-ink/60">Searching...</p>}
      {result && result.posts.length === 0 && result.communities.length === 0 && result.users.length === 0 && result.tags.length === 0 && <p className="mt-8 text-ink/60">No results found.</p>}
      {result && (type === 'all' || type === 'posts') && result.posts.length > 0 && <section className="mt-8 space-y-5"><h2 className="text-2xl font-bold">Posts</h2>{result.posts.map((post) => <PostCard item={post} key={post.id} />)}</section>}
      {result && (type === 'all' || type === 'communities') && result.communities.length > 0 && <section className="mt-8"><h2 className="text-2xl font-bold">Communities</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{result.communities.map((community) => <Link className="card transition hover:-translate-y-1" href={`/communities/${community.id}`} key={community.id}><h3 className="text-xl font-bold">{community.name}</h3><p className="mt-2 text-ink/65">{community.description || 'A place to connect and share.'}</p></Link>)}</div></section>}
      {result && (type === 'all' || type === 'tags') && result.tags.length > 0 && <section className="mt-8"><h2 className="text-2xl font-bold">Tags</h2><div className="mt-4 flex flex-wrap gap-3">{result.tags.map(({ tag, count }) => <button className="rounded-full bg-moss/10 px-4 py-2 font-semibold text-moss" key={tag} onClick={() => { setQuery(tag); tab('tags'); }}>{tag} <span className="text-ink/45">{count}</span></button>)}</div></section>}
      {result && (type === 'all' || type === 'communities') && result.users.length > 0 && <section className="mt-8"><h2 className="text-2xl font-bold">People</h2><div className="mt-4 space-y-2">{result.users.map((entry) => <Link className="dashboard-link" href={`/profile/${entry.id}`} key={entry.id}>{entry.profile?.displayName || entry.profile?.username || 'FolkTuk member'}</Link>)}</div></section>}
    </div>
  );
}
