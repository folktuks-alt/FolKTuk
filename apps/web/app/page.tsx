import { PostFeed } from '../components/post-feed';

export default function Home() {
  return <div className="grid gap-10 lg:grid-cols-[1fr_320px]"><section><p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-coral">The global gathering place</p><h1 className="mb-8 text-5xl font-black tracking-tight">What&apos;s happening<br /><span className="text-moss">in your FolkTuk?</span></h1><PostFeed /></section><aside className="card h-fit bg-ink text-white"><p className="text-sm font-bold uppercase tracking-widest text-coral">FolkTuk values</p><h2 className="mt-4 text-2xl font-bold">Folks, gather here.</h2><p className="mt-3 leading-7 text-white/70">A calmer corner of the internet for connection, communities, and opportunities.</p><a className="mt-6 inline-block font-semibold text-white underline" href="/communities">Explore communities →</a></aside></div>;
}
