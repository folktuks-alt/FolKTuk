'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PostFeed } from '../../../components/post-feed';
import { get, post, remove } from '../../../lib/api';
import type { Page, Post, User } from '../../../lib/types';
import { useAuth } from '../../../components/auth-context';
import { EditProfileModal } from '../../../components/edit-profile-modal';

type PublicProfile = User & {
  posts: Page<Post>;
};

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);

  useEffect(() => {
    if (!user || !profile || user.id === profile.id) return;
    get<{ follower: { id: string } }[]>(`/users/${profile.id}/followers`)
      .then((items) => setFollowing(items.some((item) => item.follower.id === user.id)))
      .catch(() => setFollowing(false));
  }, [profile, user]);

  useEffect(() => {
    params
      .then(({ id }) => get<PublicProfile>(`/users/${id}?page=1&limit=10`))
      .then(setProfile)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Unable to load profile'));
  }, [params]);

  if (error) return <p className="text-coral">{error}</p>;
  if (!profile) return <p className="text-ink/60">Loading profile...</p>;

  const displayName = profile.profile?.displayName || profile.profile?.username || profile.email;
  const initials = displayName.slice(0, 2).toUpperCase();

  async function toggleFollow() {
    const currentProfile = profile;
    if (!user || !currentProfile || user.id === currentProfile.id || followBusy) return;
    setFollowBusy(true);
    const previousFollowing = following;
    const previousCount = currentProfile.followerCount ?? 0;
    setFollowing(!following);
    setProfile({ ...currentProfile, followerCount: Math.max(0, previousCount + (following ? -1 : 1)) });
    try {
      const result = following
        ? await remove<{ following: boolean; followerCount: number }>(`/users/${currentProfile.id}/follow`)
        : await post<{ following: boolean; followerCount: number }>(`/users/${currentProfile.id}/follow`);
      setFollowing(result.following);
      setProfile((current) => current ? { ...current, followerCount: result.followerCount } : current);
    } catch (cause) {
      setFollowing(previousFollowing);
      setProfile((current) => current ? { ...current, followerCount: previousCount } : current);
      setError(cause instanceof Error ? cause.message : 'Unable to update follow status');
    } finally {
      setFollowBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/" className="text-sm font-semibold text-moss hover:text-ink">← Back to feed</Link>
      <section className="card mt-4">
        {user?.id === profile.id && <div className="mb-4 flex justify-end"><button className="button-quiet" onClick={() => setEditOpen(true)}>Edit Profile</button></div>}
        {profile.profile?.bannerUrl && <img src={profile.profile.bannerUrl} alt="" className="mb-5 h-32 w-full rounded-xl object-cover" />}
        <div className="flex items-start gap-4">
          {profile.profile?.avatarUrl ? <img src={profile.profile.avatarUrl} alt="" className="h-20 w-20 rounded-full object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-moss/15 text-xl font-bold text-moss">{initials}</div>}
          <div className="min-w-0">
            <p className="text-sm text-ink/50">Profile</p>
            <h1 className="text-3xl font-black">{displayName}</h1>
            {profile.profile?.username && <p className="text-moss">@{profile.profile.username}</p>}
            <p className="mt-3 text-ink/65">{profile.profile?.bio || 'No bio yet.'}</p>
          </div>
          {user?.id !== profile.id && <button className="button-primary" onClick={toggleFollow} disabled={!user || followBusy}>{!user ? 'Log in to follow' : followBusy ? 'Updating...' : following ? 'Unfollow' : 'Follow'}</button>}
        </div>
        <div className="mt-5 flex gap-6 border-t border-ink/5 pt-4 text-sm text-ink/60">
          <span><strong className="text-ink">{profile.posts.total}</strong> posts</span>
          <span><strong className="text-ink">{profile.followerCount ?? 0}</strong> followers</span>
          <span><strong className="text-ink">{profile.followingCount ?? 0}</strong> following</span>
          <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
        </div>
      </section>
      <h2 className="mb-4 mt-10 text-2xl font-bold">Posts by {displayName}</h2>
      <PostFeed authorId={profile.id} />
      {editOpen && <EditProfileModal onClose={() => setEditOpen(false)} onSaved={(updated) => setProfile((current) => current ? { ...current, ...updated } : null)} />}
    </div>
  );
}
