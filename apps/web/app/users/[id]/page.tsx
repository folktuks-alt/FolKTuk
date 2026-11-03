'use client';

import { useEffect, useState } from 'react';
import { get } from '../../../lib/api';
import type { Page, Post, User } from '../../../lib/types';
import { PostCard } from '../../../components/post-card';

type PublicProfile = User & { comments: { id: string; content: string }[]; posts: Page<Post>; communityMemberships: { community: { name: string } }[] };
export default function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  useEffect(() => { params.then(({ id }) => get<PublicProfile>(`/users/${id}/profile?page=1&limit=10`).then(setProfile)); }, [params]);
  if (!profile) return <p>Loading profile...</p>;
  return <div className="max-w-2xl"><div className="card"><p className="text-sm text-ink/50">Profile</p><h1 className="mt-2 text-3xl font-black">{profile.profile?.displayName || profile.email}</h1><p className="text-moss">@{profile.profile?.username}</p><p className="mt-4 text-ink/65">{profile.profile?.bio}</p></div><h2 className="mb-4 mt-10 text-2xl font-bold">Published posts</h2><div className="space-y-5">{profile.posts.data.map((item) => <PostCard key={item.id} item={item} />)}</div></div>;
}
