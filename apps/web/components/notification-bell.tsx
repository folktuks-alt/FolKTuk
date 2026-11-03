'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { get, patch } from '../lib/api';
import type { Notification } from '../lib/types';
import { API_URL } from '../lib/api';
import { useAuth } from './auth-context';

type NotificationResult = { data: Notification[]; unreadCount: number };

function message(notification: Notification) {
  const name = notification.actor.profile?.username
    ? `@${notification.actor.profile.username}`
    : notification.actor.profile?.displayName || 'Someone';
  if (notification.type === 'LIKE') return `${name} liked your post`;
  if (notification.type === 'COMMENT') return `${name} commented on your post`;
  return `${name} started following you`;
}

export function NotificationBell() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) {
      setItems([]);
      setUnreadCount(0);
      return;
    }
    get<NotificationResult>('/notifications').then((result) => {
      setItems(result.data);
      setUnreadCount(result.unreadCount);
    }).catch(() => undefined);

    const socket = io(API_URL, { auth: { token } });
    const handleNotification = (notification: Notification) => {
      setItems((current) => current.some((item) => item.id === notification.id)
        ? current
        : [notification, ...current].slice(0, 30));
      setUnreadCount((count) => count + 1);
    };
    socket.on('notification:received', handleNotification);
    socket.on('connect_error', () => undefined);
    return () => {
      socket.off('notification:received', handleNotification);
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [token]);

  async function markRead(notification: Notification) {
    try {
      if (!notification.read) {
        await patch(`/notifications/${notification.id}/read`, {});
        setItems((current) => current.map((item) => item.id === notification.id ? { ...item, read: true } : item));
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      setOpen(false);
    } catch {
      setOpen(false);
    }
  }

  async function markAllRead() {
    try {
      await patch('/notifications/read-all', {});
      setItems((current) => current.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
    } catch {
      return;
    }
  }

  if (!token) return null;
  return (
    <div className="relative">
      <button className="relative rounded-xl p-2 text-lg hover:bg-white/70" onClick={() => setOpen((value) => !value)} aria-label="Notifications" aria-expanded={open}>
        🔔
        {unreadCount > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-coral px-1 text-center text-[10px] leading-5 text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>
      {open && <div className="absolute right-0 z-40 mt-2 w-80 rounded-2xl border border-black/5 bg-white p-3 shadow-soft">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-bold">Notifications</h2>
          {unreadCount > 0 && <button className="text-xs font-semibold text-moss" onClick={markAllRead}>Mark all read</button>}
        </div>
        <div className="mt-2 max-h-80 overflow-y-auto">
          {items.length === 0 && <p className="px-2 py-6 text-sm text-ink/60">No notifications yet.</p>}
          {items.map((notification) => <Link
            href={notification.type === 'FOLLOW' ? `/profile/${notification.actor.id}` : `/?post=${notification.targetId}`}
            onClick={() => { void markRead(notification); }}
            className={`block rounded-xl px-2 py-3 text-sm hover:bg-cream ${notification.read ? '' : 'bg-moss/5'}`}
            key={notification.id}
          >
            <p>{message(notification)}</p>
            <time className="text-xs text-ink/45">{new Date(notification.createdAt).toLocaleDateString()}</time>
          </Link>)}
        </div>
      </div>}
    </div>
  );
}
