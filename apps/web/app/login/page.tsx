'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth-context';

export default function Login() {
  const { login } = useAuth(); const router = useRouter(); const [identifier, setIdentifier] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  async function submit(e: FormEvent) { e.preventDefault(); try { await login(identifier, password); router.push('/'); } catch (err) { setError(err instanceof Error ? err.message : 'Unable to log in'); } }
  return <AuthForm title="Welcome back" subtitle="Pick up where you left off." onSubmit={submit} error={error}><input className="field" placeholder="Email or username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required /><input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><button className="button-primary">Log in</button><p className="text-center text-sm text-ink/60">New here? <Link className="font-bold text-moss" href="/register">Create an account</Link></p></AuthForm>;
}

function AuthForm({ title, subtitle, error, onSubmit, children }: { title: string; subtitle: string; error: string; onSubmit: (e: FormEvent) => void; children: React.ReactNode }) {
  return <div className="mx-auto max-w-md"><div className="card"><h1 className="text-3xl font-black">{title}</h1><p className="mt-2 text-ink/60">{subtitle}</p><form onSubmit={onSubmit} className="mt-8 space-y-4">{error && <p className="rounded-xl bg-coral/10 p-3 text-sm text-coral">{error}</p>}{children}</form></div></div>;
}
