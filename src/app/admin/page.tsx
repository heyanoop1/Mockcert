import { auth } from '@/auth';
import { prisma, safePrismaQuery } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const [vendors, certifications, versions, attempts, questions] = await Promise.all([
    safePrismaQuery(() => prisma.vendor.count({ where: { active: true } }), 0),
    safePrismaQuery(() => prisma.certification.count({ where: { active: true } }), 0),
    safePrismaQuery(() => prisma.examVersion.count({ where: { status: 'PUBLISHED' } }), 0),
    safePrismaQuery(() => prisma.examAttempt.count(), 0),
    safePrismaQuery(() => prisma.question.count(), 0),
  ]);

  const cards = [
    { label: 'Active vendors', value: vendors },
    { label: 'Published certifications', value: certifications },
    { label: 'Published versions', value: versions },
    { label: 'Total questions', value: questions },
    { label: 'Total attempts', value: attempts },
  ];

  return (
    <main className="space-y-8 p-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">Operations</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Admin dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
