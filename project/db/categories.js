const prisma = require("./index");

// given a category (string name) -> return count of all businsses with that category
const countCategories = (category) => {
  return prisma.categoryToBusiness.count({
    where: {
      categoryName: category,
    },
  });
};

/* update all categories 
    - find all categories returning an array
    - loop through each category, returning count of all bussinesses with that category
    - update category that matches current array element with count of businesses*/
const updateCategories = async () => {
  const categories = await prisma.category.findMany();
  for (let i = 0; i < categories.length; i++) {
    const countBusinesses = await countCategories(categories[i].name);
    await prisma.category.update({
      where: { name: categories[i].name },
      data: {
        businessCount: countBusinesses,
      },
    });
  }
};

// get all categories, ordered by count of businesses descending
const getCategories = async () => {
  await updateCategories();
  return prisma.category.findMany({
    orderBy: { businessCount: "asc" },
  });
};

module.exports = getCategories;