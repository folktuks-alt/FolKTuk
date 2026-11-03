import type { Metadata } from 'next';
import { Providers } from '../components/providers';
import { SiteHeader } from '../components/site-header';
import './globals.css';

export const metadata: Metadata = { title: 'FolkTuk', description: 'Connect. Converse. Belong.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body suppressHydrationWarning><Providers><SiteHeader /><main className="mx-auto min-h-screen max-w-6xl px-5 py-10">{children}</main></Providers></body></html>;
}
