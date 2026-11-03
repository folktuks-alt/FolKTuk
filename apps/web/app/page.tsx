'use client';

import { useState } from 'react';
import { PostFeed } from '../components/post-feed';
import { CommunitySidebar, DashboardSidebar } from '../components/dashboard-sidebar';

export default function Home() {
  const [topic, setTopic] = useState('');
  return (
    <div className="grid gap-6 md:grid-cols-[190px_minmax(0,1fr)] lg:grid-cols-[190px_minmax(0,1fr)_260px]">
      <DashboardSidebar />
      <section className="min-w-0">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-coral">The global gathering place</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">What&apos;s happening <span className="text-moss">in your FolkTuk?</span></h1>
        </div>
        {topic && <button className="mb-4 text-sm font-semibold text-moss" onClick={() => setTopic('')}>Filtering by {topic} · Clear filter</button>}
        <PostFeed topic={topic} />
      </section>
      <CommunitySidebar onTopicSelect={setTopic} />
    </div>
  );
}
