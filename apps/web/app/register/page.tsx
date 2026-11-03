'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth-context';

export default function Register() {
  const { register } = useAuth(); const router = useRouter(); const [form, setForm] = useState({ email: '', username: '', displayName: '', password: '' }); const [error, setError] = useState('');
  async function submit(e: FormEvent) { e.preventDefault(); try { await register(form); router.push('/'); } catch (err) { setError(err instanceof Error ? err.message : 'Unable to register'); } }
  return <div className="mx-auto max-w-md"><div className="card"><h1 className="text-3xl font-black">Join the gathering</h1><p className="mt-2 text-ink/60">Create your FolkTuk identity.</p><form onSubmit={submit} className="mt-8 space-y-4">{error && <p className="rounded-xl bg-coral/10 p-3 text-sm text-coral">{error}</p>}{[['displayName','Display name'],['username','Username'],['email','Email'],['password','Password']].map(([key, label]) => <input key={key} className="field" type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'} placeholder={label} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />)}<button className="button-primary w-full">Create account</button><p className="text-center text-sm text-ink/60">Already a member? <Link className="font-bold text-moss" href="/login">Log in</Link></p></form></div></div>;
}
