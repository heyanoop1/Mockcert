import { prisma, safePrismaQuery } from '@/lib/db';
import { createCertification } from '@/lib/admin-actions';

export default async function NewCertificationPage() {
  const vendors = (await safePrismaQuery(
    () => prisma.vendor.findMany({ where: { active: true } }),
    [] as Array<{ id: string; name: string }>,
  )) as Array<{ id: string; name: string }>;

  return (
    <main className="p-8">
      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <h1 className="text-3xl font-bold text-slate-900">Create certification</h1>
        <form action={createCertification} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Vendor</label>
            <select name="vendorId" required className="w-full rounded-xl border border-slate-300 px-3 py-2">
              {vendors.map((vendor: { id: string; name: string }) => (
                <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Exam code</label>
            <input name="examCode" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input name="name" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Slug</label>
            <input name="slug" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Default duration</label>
              <input name="defaultDurationMinutes" type="number" defaultValue={60} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Default question count</label>
              <input name="defaultQuestionCount" type="number" defaultValue={10} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Pass percentage</label>
              <input name="defaultPassPercentage" type="number" defaultValue={75} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Allowed counts</label>
              <input name="allowedQuestionCounts" defaultValue="10,15,20" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Enabled modes</label>
            <input name="enabledModes" defaultValue="FULL_VERSION,MOCK_EXAM" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea name="description" rows={4} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input name="active" type="checkbox" defaultChecked />
            Active
          </label>
          <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">Save certification</button>
        </form>
      </div>
    </main>
  );
}
