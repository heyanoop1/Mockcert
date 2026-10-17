'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';

const requireAdmin = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
};

const vendorSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional().default(''),
  logoUrl: z.string().url().optional().or(z.literal('')).optional(),
  active: z.string().optional(),
});

export async function createVendor(formData: FormData) {
  await requireAdmin();
  const parsed = vendorSchema.parse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') ?? '',
    logoUrl: formData.get('logoUrl') ?? '',
    active: formData.get('active') ?? 'on',
  });

  await prisma.vendor.create({
    data: {
      name: parsed.name,
      slug: parsed.slug,
      description: parsed.description || null,
      logoUrl: parsed.logoUrl || null,
      active: parsed.active !== 'off',
    },
  });

  revalidatePath('/admin/vendors');
  redirect('/admin/vendors' as never);
}

const certificationSchema = z.object({
  vendorId: z.string().min(1),
  examCode: z.string().min(2),
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional().default(''),
  defaultDurationMinutes: z.coerce.number().min(1),
  defaultQuestionCount: z.coerce.number().min(1),
  defaultPassPercentage: z.coerce.number().min(1).max(100),
  allowedQuestionCounts: z.string().default('10,15,20'),
  enabledModes: z.string().default('FULL_VERSION,MOCK_EXAM'),
  active: z.string().optional(),
});

export async function createCertification(formData: FormData) {
  await requireAdmin();
  const parsed = certificationSchema.parse({
    vendorId: formData.get('vendorId'),
    examCode: formData.get('examCode'),
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') ?? '',
    defaultDurationMinutes: formData.get('defaultDurationMinutes') ?? 60,
    defaultQuestionCount: formData.get('defaultQuestionCount') ?? 10,
    defaultPassPercentage: formData.get('defaultPassPercentage') ?? 75,
    allowedQuestionCounts: formData.get('allowedQuestionCounts') ?? '10,15,20',
    enabledModes: formData.get('enabledModes') ?? 'FULL_VERSION,MOCK_EXAM',
    active: formData.get('active') ?? 'on',
  });

  await prisma.certification.create({
    data: {
      vendorId: parsed.vendorId,
      examCode: parsed.examCode,
      name: parsed.name,
      slug: parsed.slug,
      description: parsed.description || null,
      defaultDurationMinutes: parsed.defaultDurationMinutes,
      defaultQuestionCount: parsed.defaultQuestionCount,
      defaultPassPercentage: parsed.defaultPassPercentage,
      allowedQuestionCounts: parsed.allowedQuestionCounts.split(',').map(Number),
      enabledModes: parsed.enabledModes.split(',').map((mode) => mode.trim()),
      active: parsed.active !== 'off',
    },
  });

  revalidatePath('/admin/certifications');
  redirect('/admin/certifications' as never);
}

const versionSchema = z.object({
  certificationId: z.string().min(1),
  displayName: z.string().min(2),
  versionCode: z.string().min(2),
  durationMinutes: z.coerce.number().min(1),
  passPercentage: z.coerce.number().min(1).max(100),
  questionCount: z.coerce.number().min(1),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']),
  legalRightsConfirmed: z.string().optional(),
  changeSummary: z.string().optional().default(''),
});

export async function createVersion(formData: FormData) {
  await requireAdmin();
  const parsed = versionSchema.parse({
    certificationId: formData.get('certificationId'),
    displayName: formData.get('displayName'),
    versionCode: formData.get('versionCode'),
    durationMinutes: formData.get('durationMinutes') ?? 60,
    passPercentage: formData.get('passPercentage') ?? 75,
    questionCount: formData.get('questionCount') ?? 10,
    status: formData.get('status') ?? 'DRAFT',
    legalRightsConfirmed: formData.get('legalRightsConfirmed') ?? 'on',
    changeSummary: formData.get('changeSummary') ?? '',
  });

  await prisma.examVersion.create({
    data: {
      certificationId: parsed.certificationId,
      displayName: parsed.displayName,
      versionCode: parsed.versionCode,
      durationMinutes: parsed.durationMinutes,
      passPercentage: parsed.passPercentage,
      questionCount: parsed.questionCount,
      status: parsed.status,
      isLatest: parsed.status === 'PUBLISHED',
      legalRightsConfirmed: parsed.legalRightsConfirmed !== 'off',
      changeSummary: parsed.changeSummary ? { summary: parsed.changeSummary } : Prisma.JsonNull,
    },
  });

  revalidatePath('/admin/versions');
  redirect('/admin/versions' as never);
}
