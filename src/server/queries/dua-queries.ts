import { prisma } from "@/lib/prisma";

/**
 * Gets overview stats for the main dashboard metrics.
 */
export async function getDuaDashboardStats() {
  const [totalBooks, totalIndexes, totalCategories, totalItems] = await Promise.all([
    prisma.duaBook.count(),
    prisma.duaIndex.count(),
    prisma.duaCategory.count(),
    prisma.duaItem.count(),
  ]);

  return {
    totalBooks,
    totalIndexes,
    totalCategories,
    totalItems,
  };
}

/**
 * Gets a tree representation of books and their indexes.
 */
export async function getDuaTree() {
  return prisma.duaBook.findMany({
    include: {
      indexes: {
        orderBy: {
          displayOrder: "asc",
        },
      },
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

/**
 * Gets all books sorted by display order.
 */
export async function getAllDuaBooks() {
  return prisma.duaBook.findMany({
    orderBy: {
      displayOrder: "asc",
    },
  });
}

/**
 * Gets all categories sorted by name or slug.
 */
export async function getAllDuaCategories() {
  return prisma.duaCategory.findMany({
    orderBy: {
      slug: "asc",
    },
  });
}

/**
 * Gets all indexes (chapters/sections) for a specific book.
 */
export async function getIndexesByBookId(bookId: string) {
  return prisma.duaIndex.findMany({
    where: {
      bookId,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}
