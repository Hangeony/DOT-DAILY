import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 스티커 데이터 생성
  await prisma.stickers.createMany({
    data: [
      { label: '좋음', emoji: '😊', key: 'good' },
      { label: '나쁨', emoji: '😞', key: 'bad' },
      { label: '그냥그럼', emoji: '😐', key: 'meh' },
      { label: '뿌듯함', emoji: '🤩', key: 'proud' },
      { label: '감사함', emoji: '😌', key: 'grateful' },
    ],
    skipDuplicates: true, // key가 unique이므로 중복 무시 옵션
  });

  console.log('✅ 스티커 데이터 생성 완료');
}

main()
  .then(() => {
    console.log('✅ Seed 완료');
    return prisma.$disconnect();
  })
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
