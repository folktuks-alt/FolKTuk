'use client';

import { useEffect, useState } from 'react';
import { get } from '../../lib/api';
import { useAuth } from '../../components/auth-context';
import type { Page, Post, User } from '../../lib/types';
import { PostCard } from '../../components/post-card';

type Activity = User & { posts: Page<Post>; comments: { id: string; content: string }[]; postLikes: { post: Post }[]; commentLikes: { comment: { content: string } }[] };
export default function Profile() {
  const { user } = useAuth(); const [activity, setActivity] = useState<Activity | null>(null);
  useEffect(() => { if (user) get<Activity>('/users/me/activity?page=1&limit=20').then(setActivity); }, [user]);
  if (!user) return <div className="card"><h1 className="text-2xl font-bold">Log in to see your activity.</h1></div>;
  if (!activity) return <p>Loading activity...</p>;
  return <div className="max-w-2xl"><div className="card"><p className="text-sm text-ink/50">Your profile</p><h1 className="mt-2 text-3xl font-black">{activity.profile?.displayName || activity.email}</h1><p className="text-moss">@{activity.profile?.username}</p><p className="mt-4 text-ink/65">{activity.profile?.bio}</p></div><h2 className="mb-4 mt-10 text-2xl font-bold">Your posts</h2><div className="space-y-5">{activity.posts.data.map((item) => <PostCard key={item.id} item={item} />)}</div></div>;
}
