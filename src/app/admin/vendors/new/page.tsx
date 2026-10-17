import { createVendor } from '@/lib/admin-actions';

export default function NewVendorPage() {
  return (
    <main className="p-8">
      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <h1 className="text-3xl font-bold text-slate-900">Create vendor</h1>
        <form action={createVendor} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input name="name" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Slug</label>
            <input name="slug" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea name="description" rows={4} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Logo URL</label>
            <input name="logoUrl" type="url" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input name="active" type="checkbox" defaultChecked />
            Active
          </label>
          <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">Save vendor</button>
        </form>
      </div>
    </main>
  );
}
