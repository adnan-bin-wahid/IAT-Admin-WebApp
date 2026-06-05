"use server";

import { prisma } from "@/lib/prisma";
import { duaItemSchema, DuaItemInput } from "../validations/dua-item-schema";
import { revalidatePath } from "next/cache";

/**
 * Creates a new DuaItem in Supabase.
 * Enforces relationship checks and scoped slug uniqueness.
 */
export async function createDuaItem(rawInput: DuaItemInput) {
  const parsed = duaItemSchema.parse(rawInput);

  // 1. Verify book exists
  const book = await prisma.duaBook.findUnique({
    where: { id: parsed.bookId },
  });
  if (!book) {
    throw new Error("The selected book does not exist.");
  }

  // 2. Verify index exists and belongs to the selected book
  const index = await prisma.duaIndex.findUnique({
    where: { id: parsed.indexId },
  });
  if (!index) {
    throw new Error("The selected index does not exist.");
  }
  if (index.bookId !== parsed.bookId) {
    throw new Error("The selected index does not belong to the selected book.");
  }

  // 3. Verify category exists
  const category = await prisma.duaCategory.findUnique({
    where: { id: parsed.categoryId },
  });
  if (!category) {
    throw new Error("The selected category does not exist.");
  }

  // 4. Verify slug uniqueness within this specific index
  const existingSlug = await prisma.duaItem.findFirst({
    where: {
      indexId: parsed.indexId,
      slug: parsed.slug,
    },
  });
  if (existingSlug) {
    throw new Error(`A dua item with slug '${parsed.slug}' already exists in this index.`);
  }

  // 5. Create
  const newDua = await prisma.duaItem.create({
    data: {
      ...parsed,
      version: 1,
    },
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return newDua;
}

/**
 * Updates an existing DuaItem's fields, incrementing its version.
 */
export async function updateDuaItem(id: string, rawInput: DuaItemInput) {
  const parsed = duaItemSchema.parse(rawInput);

  // 0. Verify current dua item exists
  const currentDua = await prisma.duaItem.findUnique({
    where: { id },
  });
  if (!currentDua) {
    throw new Error("Dua item to update does not exist.");
  }

  // 1. Verify book exists
  const book = await prisma.duaBook.findUnique({
    where: { id: parsed.bookId },
  });
  if (!book) {
    throw new Error("The selected book does not exist.");
  }

  // 2. Verify index exists and belongs to the selected book
  const index = await prisma.duaIndex.findUnique({
    where: { id: parsed.indexId },
  });
  if (!index) {
    throw new Error("The selected index does not exist.");
  }
  if (index.bookId !== parsed.bookId) {
    throw new Error("The selected index does not belong to the selected book.");
  }

  // 3. Verify category exists
  const category = await prisma.duaCategory.findUnique({
    where: { id: parsed.categoryId },
  });
  if (!category) {
    throw new Error("The selected category does not exist.");
  }

  // 4. Verify slug uniqueness within this specific index, ignoring current item
  const existingSlug = await prisma.duaItem.findFirst({
    where: {
      indexId: parsed.indexId,
      slug: parsed.slug,
      id: { not: id },
    },
  });
  if (existingSlug) {
    throw new Error(`A dua item with slug '${parsed.slug}' already exists in this index.`);
  }

  // 5. Update and increment version
  const updated = await prisma.duaItem.update({
    where: { id },
    data: {
      ...parsed,
      version: currentDua.version + 1,
    },
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return updated;
}

/**
 * Sets status of a DuaItem to archived, incrementing its version.
 */
export async function archiveDuaItem(id: string) {
  const currentDua = await prisma.duaItem.findUnique({
    where: { id },
  });
  if (!currentDua) {
    throw new Error("Dua item does not exist.");
  }

  const archived = await prisma.duaItem.update({
    where: { id },
    data: {
      status: "archived",
      version: currentDua.version + 1,
    },
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return archived;
}

/**
 * Sets status of a DuaItem to published, sets publishedAt, and increments version.
 */
export async function publishDuaItem(id: string) {
  const currentDua = await prisma.duaItem.findUnique({
    where: { id },
  });
  if (!currentDua) {
    throw new Error("Dua item does not exist.");
  }

  const published = await prisma.duaItem.update({
    where: { id },
    data: {
      status: "published",
      publishedAt: currentDua.publishedAt || new Date(),
      version: currentDua.version + 1,
    },
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return published;
}

/**
 * Reverts a published DuaItem's status to draft, keeping publishedAt, and increments version.
 */
export async function unpublishDuaItem(id: string) {
  const currentDua = await prisma.duaItem.findUnique({
    where: { id },
  });
  if (!currentDua) {
    throw new Error("Dua item does not exist.");
  }

  const unpublished = await prisma.duaItem.update({
    where: { id },
    data: {
      status: "draft",
      version: currentDua.version + 1,
    },
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return unpublished;
}
