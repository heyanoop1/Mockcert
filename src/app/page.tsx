export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-12 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">MockCert</p>
            <h1 className="mt-2 text-3xl font-bold">Certification mock exam platform</h1>
          </div>
          <button className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Admin login</button>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Public portal</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-900">Prepare smarter for certification exams</h2>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Choose a vendor, select a published exam version, and practice with a clean, professional mock-exam experience built for public certification prep.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-sm text-slate-500">Vendors</div>
                <div className="mt-2 text-2xl font-bold">3</div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-sm text-slate-500">Certifications</div>
                <div className="mt-2 text-2xl font-bold">3</div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-sm text-slate-500">Versions</div>
                <div className="mt-2 text-2xl font-bold">2+</div>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-card">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Available exams</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-800 p-4">
                <div className="font-semibold">AWS</div>
                <div className="mt-1 text-sm text-slate-300">Solutions Architect Associate</div>
              </div>
              <div className="rounded-2xl bg-slate-800 p-4">
                <div className="font-semibold">Azure</div>
                <div className="mt-1 text-sm text-slate-300">AZ-104 Administrator</div>
              </div>
              <div className="rounded-2xl bg-slate-800 p-4">
                <div className="font-semibold">Nutanix</div>
                <div className="mt-1 text-sm text-slate-300">NCP-MCI</div>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            'Vendor and certification selection',
            'Version-aware import and comparison',
            'Server-side scoring and review',
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <div className="mb-3 h-10 w-10 rounded-xl bg-brand-100 text-lg font-bold text-brand-600">✓</div>
              <p className="text-lg font-semibold">{item}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
