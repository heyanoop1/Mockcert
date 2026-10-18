import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma, safePrismaQuery } from '@/lib/db';

export default async function VersionsPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const versions = (await safePrismaQuery(
    () =>
      prisma.examVersion.findMany({
        include: { certification: true },
        orderBy: { createdAt: 'desc' },
      }),
    [] as Array<{ id: string; displayName: string; versionCode: string; status: string; certification: { name: string } }>,
  )) as Array<{ id: string; displayName: string; versionCode: string; status: string; certification: { name: string } }>;

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Catalog</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Versions</h1>
        </div>
        <Link href={'/admin/versions/new' as never} className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">
          New version
        </Link>
      </div>

      <div className="space-y-4">
        {versions.map((version: { id: string; displayName: string; versionCode: string; status: string; certification: { name: string } }) => (
          <div key={version.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{version.displayName}</h2>
                <p className="text-sm text-slate-500">{version.certification.name} • {version.versionCode}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${version.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {version.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
