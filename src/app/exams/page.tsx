import Link from 'next/link';

import { prisma, safePrismaQuery } from '@/lib/db';

export default async function PublicExamsPage() {
  const versions = await safePrismaQuery(
    () =>
      prisma.examVersion.findMany({
        where: { status: 'PUBLISHED' },
        include: { certification: { include: { vendor: true } } },
        orderBy: { publishedAt: 'desc' },
      }),
    [],
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Public portal</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Available mock exams</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {versions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-600">
              No published exams are available yet. Please create one from the admin area.
            </div>
          ) : (
            versions.map((version) => (
              <div key={version.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                <div className="text-sm uppercase tracking-[0.18em] text-slate-500">{version.certification.vendor.name}</div>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">{version.certification.name}</h2>
                <p className="mt-2 text-slate-600">{version.displayName}</p>
                <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
                  <span>{version.questionCount} questions</span>
                  <span>•</span>
                  <span>{version.durationMinutes} min</span>
                </div>
                <Link
                  href={`/exams/${version.id}`}
                  className="mt-6 inline-flex rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white"
                >
                  Start exam
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
