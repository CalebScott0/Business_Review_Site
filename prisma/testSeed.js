const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const reviewData = await prisma.review.findMany();
  console.log("reviewData", reviewData.length);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });
