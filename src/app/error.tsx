'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">Error</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Something went wrong</h1>
        <p className="mt-2 text-slate-600">The application hit an unexpected problem while rendering this view.</p>
        <button className="mt-6 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white" onClick={reset}>Try again</button>
      </div>
    </main>
  );
}
