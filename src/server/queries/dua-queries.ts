import { prisma } from "@/lib/prisma";

/**
 * Gets overview stats for the main dashboard metrics.
 */
export async function getDuaDashboardStats() {
  const [
    totalBooks,
    totalIndexes,
    totalCategories,
    totalItems,
    publishedItems,
    draftItems,
    archivedItems,
    visibleItems,
  ] = await Promise.all([
    prisma.duaBook.count(),
    prisma.duaIndex.count(),
    prisma.duaCategory.count(),
    prisma.duaItem.count(),
    prisma.duaItem.count({ where: { status: "published" } }),
    prisma.duaItem.count({ where: { status: "draft" } }),
    prisma.duaItem.count({ where: { status: "archived" } }),
    prisma.duaItem.count({ where: { isVisibleInApp: true } }),
  ]);

  return {
    totalBooks,
    totalIndexes,
    totalCategories,
    totalItems,
    publishedItems,
    draftItems,
    archivedItems,
    visibleItems,
  };
}

/**
 * Fetches latest 5 DuaItem records with relationships.
 */
export async function getRecentDuaItems() {
  return prisma.duaItem.findMany({
    take: 5,
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      book: true,
      index: true,
      category: true,
    },
  });
}

/**
 * Fetches latest 5 DuaBook records with relation counts.
 */
export async function getRecentDuaBooks() {
  return prisma.duaBook.findMany({
    take: 5,
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      _count: {
        select: {
          indexes: true,
          duaItems: true,
        },
      },
    },
  });
}

/**
 * Gets a tree representation of books and their indexes.
 */
export async function getDuaTree() {
  return prisma.duaBook.findMany({
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "asc" },
    ],
    include: {
      _count: {
        select: {
          indexes: true,
          duaItems: true,
        },
      },
      indexes: {
        orderBy: [
          { displayOrder: "asc" },
          { createdAt: "asc" },
        ],
        include: {
          _count: {
            select: {
              duaItems: true,
            },
          },
          duaItems: {
            orderBy: [
              { displayOrder: "asc" },
              { createdAt: "asc" },
            ],
            include: {
              category: true,
            },
          },
        },
      },
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
