import { notFound } from 'next/navigation';

import { CandidateExamView } from '@/components/candidate-exam-view';
import { prisma, safePrismaQuery } from '@/lib/db';

export default async function ExamPage({ params }: { params: Promise<{ versionId: string }> }) {
  const { versionId } = await params;

  const version = await safePrismaQuery(
    () =>
      prisma.examVersion.findUnique({
        where: { id: versionId },
        include: { certification: { include: { vendor: true } } },
      }),
    null,
  );

  if (!version) {
    notFound();
  }

  const questions = await safePrismaQuery(
    () =>
      prisma.question.findMany({
        where: { examVersionId: version.id, active: true },
        orderBy: { orderIndex: 'asc' },
      }),
    [],
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{version.certification.vendor.name}</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{version.certification.name}</h1>
          <p className="mt-2 text-slate-600">{version.displayName}</p>
        </div>

        {questions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-600">
            This exam does not have any questions yet. Ask the admin to import a question dump.
          </div>
        ) : (
          <CandidateExamView
            questions={questions.map((question) => ({
              id: question.id,
              questionText: question.questionText,
              optionA: question.optionA,
              optionB: question.optionB,
              optionC: question.optionC,
              optionD: question.optionD,
              correctAnswers: Array.isArray(question.correctAnswers) ? (question.correctAnswers as string[]) : [],
              answerType: question.answerType as 'SINGLE' | 'MULTIPLE',
            }))}
          />
        )}
      </div>
    </main>
  );
}
