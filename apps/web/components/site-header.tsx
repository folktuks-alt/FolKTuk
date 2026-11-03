'use client';

import Link from 'next/link';
import { useAuth } from './auth-context';

export function SiteHeader() {
  const { user, logout } = useAuth();
  return (
    <header className="border-b border-ink/5 bg-cream/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" className="text-2xl font-black tracking-tight text-moss">FolkTuk<span className="text-coral">.</span></Link>
        <nav className="flex items-center gap-5 text-sm font-semibold">
          <Link href="/communities">Communities</Link>
          {user ? <><Link href="/profile">My activity</Link><button onClick={logout}>Log out</button></> : <><Link href="/login">Log in</Link><Link href="/register" className="button-primary">Join FolkTuk</Link></>}
        </nav>
      </div>
    </header>
  );
}
