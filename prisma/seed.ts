import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { parseQuestionDump } from '../src/lib/question-dump';

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

  const version = await prisma.examVersion.upsert({
    where: { certificationId_versionCode: { certificationId: awsCert.id, versionCode: '2026.09' } },
    update: {},
    create: {
      certificationId: awsCert.id,
      displayName: 'September 2026',
      versionCode: '2026.09',
      durationMinutes: 90,
      passPercentage: 75,
      questionCount: 0,
      status: 'PUBLISHED',
      isLatest: true,
      legalRightsConfirmed: true,
      changeSummary: { summary: 'Synthetic demo version for local development' },
    },
  });

  const sampleDump = `
Question 1: Which AWS service is best suited for serverless compute?
A. EC2
B. Lambda
C. RDS
D. S3
Correct Answer: B

Question 2: Which of these is a managed relational database service in AWS?
A. DynamoDB
B. Redshift
C. RDS
D. CloudFront
Answer: C

Question 3: What does IAM help you manage?
A. Storage buckets
B. Identity and access permissions
C. Load balancing
D. Network routing
Correct Answer: B
`;

  const questions = parseQuestionDump(sampleDump);

  const existingCount = await prisma.question.count({ where: { examVersionId: version.id } });

  for (let index = 0; index < questions.length; index += 1) {
    const question = questions[index];

    await prisma.question.create({
      data: {
        examVersionId: version.id,
        sourceQuestionNumber: existingCount + index + 1,
        stableKey: `seed-${version.id}-${index + 1}`,
        fingerprint: `seed-${version.id}-${index + 1}`,
        questionText: question.questionText,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        correctAnswers: question.correctAnswers,
        answerType: question.answerType,
        explanation: 'Demo question for local development',
        topic: 'AWS basics',
        difficulty: 'MEDIUM',
        changeType: 'NEW',
        active: true,
        orderIndex: index + 1,
      },
    });
  }

  await prisma.examVersion.update({
    where: { id: version.id },
    data: { questionCount: questions.length },
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
