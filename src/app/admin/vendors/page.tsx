import Link from 'next/link';

import { auth } from '@/auth';
import { prisma, safePrismaQuery } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function VendorsPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const vendors = (await safePrismaQuery(
    () =>
      prisma.vendor.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    [] as Array<{ id: string; name: string; slug: string; active: boolean }>,
  )) as Array<{ id: string; name: string; slug: string; active: boolean }>;

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Catalog</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Vendors</h1>
        </div>
        <Link href={'/admin/vendors/new' as never} className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">
          New vendor
        </Link>
      </div>

      <div className="space-y-4">
        {vendors.map((vendor: { id: string; name: string; slug: string; active: boolean }) => (
          <div key={vendor.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{vendor.name}</h2>
                <p className="text-sm text-slate-500">/{vendor.slug}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${vendor.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                {vendor.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
