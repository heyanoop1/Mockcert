import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma, safePrismaQuery } from '@/lib/db';

export default async function CertificationsPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const certifications = (await safePrismaQuery(
    () =>
      prisma.certification.findMany({
        include: { vendor: true },
        orderBy: { createdAt: 'desc' },
      }),
    [] as Array<{ id: string; name: string; examCode: string; active: boolean; vendor: { name: string } }>,
  )) as Array<{ id: string; name: string; examCode: string; active: boolean; vendor: { name: string } }>;

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Catalog</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Certifications</h1>
        </div>
        <Link href={'/admin/certifications/new' as never} className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">
          New certification
        </Link>
      </div>

      <div className="space-y-4">
        {certifications.map((certification: { id: string; name: string; examCode: string; active: boolean; vendor: { name: string } }) => (
          <div key={certification.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{certification.name}</h2>
                <p className="text-sm text-slate-500">{certification.vendor.name} • {certification.examCode}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${certification.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                {certification.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
