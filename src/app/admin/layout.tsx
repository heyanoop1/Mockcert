import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth';

async function signOutAction() {
  'use server';
  await signOut({ redirectTo: '/admin/login' });
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/vendors', label: 'Vendors' },
    { href: '/admin/certifications', label: 'Certifications' },
    { href: '/admin/versions', label: 'Versions' },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 w-72 border-r border-slate-200 bg-slate-900 text-white">
        <div className="border-b border-slate-700 p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">MockCert</p>
          <h1 className="mt-2 text-2xl font-bold">Admin</h1>
        </div>

        <nav className="space-y-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as never}
              className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-700 p-4">
          <div className="mb-3 text-sm text-slate-300">{session.user.name ?? session.user.email}</div>
          <form action={signOutAction}>
            <button type="submit" className="w-full rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="ml-72 min-h-screen">{children}</div>
    </div>
  );
}
