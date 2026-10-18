'use server';

import crypto from 'crypto';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { parseQuestionDump } from '@/lib/question-dump';

const requireAdmin = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
};

export async function createExamFromDump(formData: FormData) {
  await requireAdmin();

  const certificationId = String(formData.get('certificationId') ?? '').trim();
  const versionCode = String(formData.get('versionCode') ?? '').trim() || 'manual-import';
  const dumpText = String(formData.get('dumpText') ?? '').trim();

  if (!certificationId) {
    throw new Error('A certification is required.');
  }

  if (!dumpText) {
    throw new Error('Question dump is required.');
  }

  const questions = parseQuestionDump(dumpText);

  if (questions.length === 0) {
    throw new Error('No valid questions were detected in the dump.');
  }

  const version =
    (await prisma.examVersion.findFirst({
      where: { certificationId, versionCode },
    })) ??
    (await prisma.examVersion.create({
      data: {
        certificationId,
        displayName: versionCode,
        versionCode,
        durationMinutes: 60,
        passPercentage: 75,
        questionCount: questions.length,
        status: 'DRAFT',
        isLatest: true,
        legalRightsConfirmed: true,
        changeSummary: { summary: 'Imported from PDF text dump' },
      },
    }));

  const existingCount = await prisma.question.count({ where: { examVersionId: version.id } });

  for (let index = 0; index < questions.length; index += 1) {
    const question = questions[index];
    const sourceText = [
      question.questionText,
      question.optionA,
      question.optionB,
      question.optionC,
      question.optionD,
      ...question.correctAnswers,
    ].join('|');

    const stableKey = crypto.createHash('sha256').update(`${version.id}:${index}:${sourceText}`).digest('hex');
    const fingerprint = crypto.createHash('sha256').update(sourceText).digest('hex');

    const existingQuestion = await prisma.question.findFirst({
      where: { examVersionId: version.id, stableKey },
    });

    if (existingQuestion) {
      continue;
    }

    await prisma.question.create({
      data: {
        examVersionId: version.id,
        sourceQuestionNumber: existingCount + index + 1,
        stableKey,
        fingerprint,
        questionText: question.questionText,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        correctAnswers: question.correctAnswers,
        answerType: question.answerType,
        explanation: question.explanation ?? null,
        topic: 'Imported',
        difficulty: 'MEDIUM',
        changeType: 'NEW',
        active: true,
        orderIndex: index + 1,
      },
    });
  }

  await prisma.examVersion.update({
    where: { id: version.id },
    data: { questionCount: existingCount + questions.length, status: 'PUBLISHED', isLatest: true },
  });

  revalidatePath('/admin/versions');
  revalidatePath('/exams');
  redirect('/admin/versions');
}
