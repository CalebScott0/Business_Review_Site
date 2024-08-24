const { countBusinessReviews, averageBusinessStars } = require("./utils");

const prisma = require("../index");

async function main() {
  const businesses = await prisma.business.findMany({
    where: {
      reviewCount: 0,
      stars: 0,
    },
    select: {
      id: true,
    },
  });
  console.log(
    `Updating ${businesses.length} businesses with review count and average stars...`
  );
  // for each business, update with review count and average stars rounded to nearest 0.5
  for (let i = 0; i < businesses.length; i++) {
    const reviewCount = await countBusinessReviews(businesses[i].id);

    const stars = await averageBusinessStars(businesses[i].id);

    await prisma.business.update({
      where: { id: businesses[i].id },
      data: {
        reviewCount,
        stars,
      },
    });

    // console log first, last and every 50 businesses to see progress
    if (i === 0 || i % 50 === 0 || i === businesses.length - 1) {
      console.log(
        await prisma.business.findUnique({
          where: { id: businesses[i].id },
        })
      );
      console.log(`Updated business # ${i} / ${businesses.length}`);
    }
  }

  console.log("Businesses updated");

  // update category with count of businesses
  const categories = await prisma.category.findMany();
  for (let item of categories) {
    const businessCount = await prisma.categoryToBusiness.count({
      where: {
        name: item.name,
      },
    });
    await prisma.category.update({
      where: {
        id: item.id,
      },
      data: {
        businessCount,
      },
    });
  }
}

main();
