import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@localhost';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';
  const adminName = process.env.ADMIN_NAME ?? 'MockCert Admin';

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: 'ADMIN',
      active: true,
    },
  });

  const aws = await prisma.vendor.upsert({
    where: { slug: 'aws' },
    update: {},
    create: {
      name: 'AWS',
      slug: 'aws',
      description: 'Synthetic AWS practice content for mock exam training.',
      active: true,
    },
  });

  const awsCert = await prisma.certification.upsert({
    where: { vendorId_examCode: { vendorId: aws.id, examCode: 'SAA-C03' } },
    update: {},
    create: {
      vendorId: aws.id,
      examCode: 'SAA-C03',
      name: 'AWS Solutions Architect Associate',
      slug: 'aws-solutions-architect-associate',
      description: 'Sample practice exam content for AWS SAA-C03.',
      defaultDurationMinutes: 90,
      defaultQuestionCount: 15,
      defaultPassPercentage: 75,
      allowedQuestionCounts: [10, 15, 20],
      enabledModes: ['FULL_VERSION', 'MOCK_EXAM', 'PRACTICE'],
      active: true,
    },
  });

  await prisma.examVersion.upsert({
    where: { certificationId_versionCode: { certificationId: awsCert.id, versionCode: '2026.09' } },
    update: {},
    create: {
      certificationId: awsCert.id,
      displayName: 'September 2026',
      versionCode: '2026.09',
      durationMinutes: 90,
      passPercentage: 75,
      questionCount: 10,
      status: 'PUBLISHED',
      isLatest: true,
      legalRightsConfirmed: true,
      changeSummary: { summary: 'Synthetic demo version for local development' },
    },
  });

  console.log('Seed complete');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
