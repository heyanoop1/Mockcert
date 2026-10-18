import { createExamFromDump } from '@/lib/exam-actions';
import { prisma, safePrismaQuery } from '@/lib/db';

export default async function NewExamDumpPage() {
  const certifications = await safePrismaQuery(
    () => prisma.certification.findMany({ where: { active: true }, include: { vendor: true }, orderBy: { createdAt: 'desc' } }),
    [],
  );

  return (
    <main className="p-8">
      <div className="max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admin import</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Create exam from PDF dump</h1>

        <form action={createExamFromDump} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Certification</label>
            <select name="certificationId" required className="w-full rounded-xl border border-slate-300 px-3 py-2">
              {certifications.length === 0 ? (
                <option value="">No active certifications</option>
              ) : (
                certifications.map((cert) => (
                  <option key={cert.id} value={cert.id}>
                    {cert.vendor.name} • {cert.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Version code</label>
            <input name="versionCode" defaultValue="manual-import" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Question dump</label>
            <textarea
              name="dumpText"
              rows={18}
              placeholder={'Question 1: What is the capital of France?\nA. Berlin\nB. Madrid\nC. Paris\nD. Rome\nCorrect Answer: C'}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              required
            />
          </div>

          <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">
            Import dump and create exam
          </button>
        </form>
      </div>
    </main>
  );
}
