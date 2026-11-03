'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { get } from '../../lib/api';
import type { Community } from '../../lib/types';

export default function Communities() {
  const [items, setItems] = useState<Community[]>([]);
  useEffect(() => { get<Community[]>('/communities').then(setItems); }, []);
  return <div><h1 className="text-4xl font-black">Communities</h1><p className="mt-2 text-ink/60">Find your people.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{items.map((community) => <Link className="card transition hover:-translate-y-1" key={community.id} href={`/communities/${community.id}`}><h2 className="text-xl font-bold">{community.name}</h2><p className="mt-2 text-ink/65">{community.description || 'A place to connect and share.'}</p><span className="mt-5 inline-block font-semibold text-moss">Visit community →</span></Link>)}</div></div>;
}
