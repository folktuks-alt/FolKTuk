'use client';

import { useEffect, useState } from 'react';
import { get } from '../../../lib/api';
import type { Community } from '../../../lib/types';
import { PostCard } from '../../../components/post-card';

export default function CommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const [community, setCommunity] = useState<Community | null>(null);
  useEffect(() => { params.then(({ slug }) => get<Community>(`/communities/${slug}?page=1&limit=10`).then(setCommunity)); }, [params]);
  if (!community) return <p>Loading community...</p>;
  return <div><p className="text-sm font-bold uppercase tracking-widest text-coral">Community</p><h1 className="mt-2 text-4xl font-black">{community.name}</h1><p className="mt-3 max-w-2xl text-ink/65">{community.description}</p><div className="mt-8 max-w-2xl space-y-5">{community.posts?.data.map((item) => <PostCard key={item.id} item={item} />)}</div></div>;
}
