import { prisma, safePrismaQuery } from '@/lib/db';
import { createVersion } from '@/lib/admin-actions';

export default async function NewVersionPage() {
  const certifications = (await safePrismaQuery(
    () => prisma.certification.findMany({ where: { active: true } }),
    [] as Array<{ id: string; name: string }>,
  )) as Array<{ id: string; name: string }>;

  return (
    <main className="p-8">
      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <h1 className="text-3xl font-bold text-slate-900">Create version</h1>
        <form action={createVersion} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Certification</label>
            <select name="certificationId" required className="w-full rounded-xl border border-slate-300 px-3 py-2">
              {certifications.map((certification: { id: string; name: string }) => (
                <option key={certification.id} value={certification.id}>{certification.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Display name</label>
            <input name="displayName" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Version code</label>
            <input name="versionCode" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Duration</label>
              <input name="durationMinutes" type="number" defaultValue={60} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Pass percentage</label>
              <input name="passPercentage" type="number" defaultValue={75} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Question count</label>
              <input name="questionCount" type="number" defaultValue={10} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select name="status" className="w-full rounded-xl border border-slate-300 px-3 py-2">
                <option value="DRAFT">DRAFT</option>
                <option value="REVIEW">REVIEW</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Change summary</label>
            <textarea name="changeSummary" rows={4} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input name="legalRightsConfirmed" type="checkbox" defaultChecked />
            Legal rights confirmed
          </label>
          <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">Save version</button>
        </form>
      </div>
    </main>
  );
}
