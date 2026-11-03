'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { io } from 'socket.io-client';
import { API_URL, get, post, remove } from '../lib/api';
import type { Comment, Post, PostLikedEvent } from '../lib/types';
import { useAuth } from './auth-context';

export function PostCard({ item }: { item: Post }) {
  const { token, user } = useAuth();
  const authorId = item.author?.id || item.authorId;
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [count, setCount] = useState(item.likes?.length ?? 0);
  const [dislikeCount, setDislikeCount] = useState(item.reactions?.filter((reaction) => reaction.type === 'DISLIKE').length ?? 0);
  const [following, setFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [shared, setShared] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    setLiked(item.likes?.some((like) => like.userId === user?.id) || item.reactions?.some((reaction) => reaction.userId === user?.id && reaction.type === 'LIKE') || false);
    setDisliked(item.reactions?.some((reaction) => reaction.userId === user?.id && reaction.type === 'DISLIKE') || false);
    setDislikeCount(item.reactions?.filter((reaction) => reaction.type === 'DISLIKE').length ?? 0);
  }, [item.likes, user?.id]);

  useEffect(() => {
    if (!token || !user || user.id === authorId) return;
    get<{ following: boolean }>(`/users/${authorId}/follow`)
      .then(({ following: isFollowing }) => setFollowing(isFollowing))
      .catch(() => setFollowing(false));
  }, [authorId, token, user]);

  useEffect(() => {
    const socket = io(API_URL, { auth: { token } });
    const handleLiked = (event: PostLikedEvent) => {
      if (event.postId === item.id) setCount(event.count);
    };
    const handleCommented = (newComment: Comment) => {
      if (newComment.postId !== item.id) return;
      setComments((items) => items.some((entry) => entry.id === newComment.id) ? items : [...items, newComment]);
    };

    socket.on('post:liked', handleLiked);
    socket.on('post:commented', handleCommented);
    socket.on('connect_error', () => undefined);
    return () => {
      socket.off('post:liked', handleLiked);
      socket.off('post:commented', handleCommented);
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [item.id, token]);

  async function toggleLike() {
    if (!token || busy) return;
    setBusy(true);
    const previousLiked = liked;
    const previousCount = count;
    setLiked(!liked);
    setCount((n) => n + (liked ? -1 : 1));
    try {
      if (liked) await remove(`/posts/${item.id}/like`);
      else {
        await post(`/posts/${item.id}/like`);
        if (disliked) {
          setDisliked(false);
          setDislikeCount((n) => Math.max(0, n - 1));
        }
      }
    } catch (error) {
      setLiked(previousLiked);
      setCount(previousCount);
      setActionError(error instanceof Error ? error.message : 'Unable to update like');
    } finally { setBusy(false); }
  }
  async function toggleDislike() {
    if (!token || busy) return;
    setBusy(true);
    const previousDisliked = disliked;
    const previousLiked = liked;
    const previousDislikeCount = dislikeCount;
    const previousLikeCount = count;
    setDisliked(!disliked);
    setDislikeCount((n) => n + (disliked ? -1 : 1));
    if (!disliked && liked) {
      setLiked(false);
      setCount((n) => n - 1);
    }
    try {
      if (disliked) await remove(`/posts/${item.id}/dislike`);
      else await post(`/posts/${item.id}/dislike`);
    } catch (error) {
      setDisliked(previousDisliked);
      setLiked(previousLiked);
      setDislikeCount(previousDislikeCount);
      setCount(previousLikeCount);
      setActionError(error instanceof Error ? error.message : 'Unable to update dislike');
    } finally { setBusy(false); }
  }
  async function toggleFollow() {
    if (!token || followBusy || !user || user.id === authorId) return;
    setFollowBusy(true);
    try {
      if (following) await remove(`/users/${authorId}/follow`);
      else await post(`/users/${authorId}/follow`);
      setFollowing(!following);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update follow');
    } finally { setFollowBusy(false); }
  }
  async function toggleComments() {
    setCommentsOpen((open) => !open);
    if (commentsOpen || comments.length > 0) return;
    setCommentsLoading(true);
    setCommentError('');
    try { setComments(await get<Comment[]>(`/posts/${item.id}/comments`)); }
    catch (error) { setCommentError(error instanceof Error ? error.message : 'Unable to load comments'); }
    finally { setCommentsLoading(false); }
  }
  async function addComment(event: React.FormEvent) {
    event.preventDefault();
    if (!comment.trim() || !token) return;
    try {
      const created = await post<Comment>(`/posts/${item.id}/comments`, { content: comment });
      setComments((items) => items.some((entry) => entry.id === created.id) ? items : [...items, created]);
      setComment('');
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : 'Unable to add comment');
    }
  }

  async function sharePost() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/posts/${item.id}`);
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to copy the post link');
    }
  }

  const authorName = item.author?.profile?.displayName || item.author?.profile?.username || item.author?.email || 'FolkTuk member';
  const authorProfile = item.author?.profile;
  const initials = authorName.slice(0, 2).toUpperCase();
  return <article className="card">
    <div className="mb-3 flex items-center justify-between text-xs text-ink/50">
      <div className="flex items-center gap-2">
        <Link href={`/profile/${authorId}`} className="flex items-center gap-2 font-bold text-ink hover:text-moss">
          {authorProfile?.avatarUrl ? <img src={authorProfile.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" /> : <span className="flex h-7 w-7 items-center justify-center rounded-full bg-moss/15 text-[10px] text-moss">{initials}</span>}
          <span>{authorName}</span>
        </Link>
        <span>·</span><span>{item.community ? `r/${item.community.slug}` : 'Global feed'}</span>
      </div>
      <div className="flex items-center gap-2"><time>{new Date(item.createdAt).toLocaleDateString()}</time>{token && user?.id !== authorId && <button className="button-quiet" onClick={toggleFollow} disabled={followBusy}>{following ? 'Unfollow' : 'Follow'}</button>}</div>
    </div>
    <h2 className="text-xl font-bold">{item.title}</h2>
    <p className="mt-2 whitespace-pre-wrap leading-7 text-ink/75">{item.content}</p>
    <div className="mt-5 flex items-center gap-3 border-t border-ink/5 pt-4">
      {actionError && <p className="text-sm text-coral">{actionError}</p>}
      <button className="button-quiet text-sm" onClick={toggleLike} disabled={!token}>{liked ? '♥ Liked' : '♡ Like'} · {count}</button>
      <button className="button-quiet text-sm" onClick={toggleDislike} disabled={!token}>{disliked ? 'Disliked' : 'Dislike'} · {dislikeCount}</button>
      <button className="button-quiet text-sm" onClick={toggleComments}>💬 Comment{comments.length ? ` · ${comments.length}` : ''}</button>
      <button className="button-quiet text-sm" onClick={sharePost}>{shared ? 'Copied!' : '↗ Share'}</button>
    </div>
    {commentsOpen && <div className="mt-4 border-t border-ink/5 pt-4">
      {commentsLoading && <p className="text-sm text-ink/60">Loading comments...</p>}
      {commentError && <p className="text-sm text-coral">{commentError}</p>}
      {!commentsLoading && !commentError && comments.length === 0 && <p className="text-sm text-ink/60">No comments yet.</p>}
      <div className="space-y-3">{comments.map((entry) => <div className="rounded-xl bg-cream px-3 py-2 text-sm" key={entry.id}><p>{entry.content}</p><time className="text-xs text-ink/50">{new Date(entry.createdAt).toLocaleDateString()}</time></div>)}</div>
      {token && <form onSubmit={addComment} className="mt-3 flex gap-2"><input className="field py-2" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." /><button className="button-primary py-2">Send</button></form>}
    </div>}
  </article>;
}
