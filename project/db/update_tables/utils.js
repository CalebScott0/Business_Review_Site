const prisma = require("../index");

// convert into float rounding to the nearest 0.5
const roundHalf = (num) => {
  return Math.round(num * 2) / 2;
};

// total count of reviews for a business given an id
const countBusinessReviews = (id) => {
  return prisma.review.count({
    where: { businessId: id },
  });
};

// average all stars from reviews for a business given an id
const averageBusinessStars = async (id) => {
  // return from aggregate will look like: { _avg: { stars: 5 } }
  // return prisma.$queryRaw`SELECT AVG(stars) FROM "Review" WHERE "businessId"=${id};`;
  return roundHalf(
    (
      await prisma.review.aggregate({
        _avg: {
          stars: true,
        },
        where: { businessId: id },
      })
    )._avg.stars
  );
};

// average all stars from reviews for a user given an id
const averageUserStars = async (id) => {
  // return from aggregate will look like: { _avg: { stars: 5 } }

  return roundHalf(
    (
      await prisma.review.aggregate({
        _avg: {
          stars: true,
        },
        where: { authorId: id },
      })
    )._avg.stars
  );
};

module.exports = {
  countBusinessReviews,
  averageBusinessStars,
  averageUserStars,
};
