import { PrismaClient } from '@prisma/client';
import { DEPARTMENTS, PROGRAMS } from '@attendance/constants';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding departments...');
  for (const d of DEPARTMENTS) {
    await prisma.department.upsert({
      where: { deptCode: d.code },
      update: { deptName: d.name },
      create: { deptCode: d.code, deptName: d.name },
    });
  }

  console.log('Seeding programs...');
  for (const p of PROGRAMS) {
    await prisma.program.upsert({
      where: { programCode: p.code },
      update: { programName: p.name },
      create: { programCode: p.code, programName: p.name },
    });
  }

  console.log('✅ Seed complete.');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
