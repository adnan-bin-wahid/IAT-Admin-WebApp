"use server";

import { prisma } from "@/lib/prisma";
import { duaIndexSchema, DuaIndexInput } from "../validations/dua-index-schema";
import { revalidatePath } from "next/cache";

/**
 * Creates a new DuaIndex in Supabase under a selected book.
 * Checks for index slug uniqueness within the same parent book.
 */
export async function createDuaIndex(rawInput: DuaIndexInput) {
  const parsed = duaIndexSchema.parse(rawInput);

  // Check unique slug within the same book
  const existing = await prisma.duaIndex.findUnique({
    where: {
      bookId_slug: {
        bookId: parsed.bookId,
        slug: parsed.slug,
      },
    },
  });

  if (existing) {
    throw new Error(`An index with slug '${parsed.slug}' already exists in this book.`);
  }

  const newIndex = await prisma.duaIndex.create({
    data: {
      ...parsed,
      version: 1,
      publishedAt: parsed.status === "published" ? new Date() : null,
    },
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return newIndex;
}

/**
 * Updates index fields and increments the version by 1.
 */
export async function updateDuaIndex(id: string, rawInput: DuaIndexInput) {
  const parsed = duaIndexSchema.parse(rawInput);

  // Check if another index in the same book has the same slug
  const existing = await prisma.duaIndex.findFirst({
    where: {
      bookId: parsed.bookId,
      slug: parsed.slug,
      id: { not: id },
    },
  });

  if (existing) {
    throw new Error(`An index with slug '${parsed.slug}' already exists in this book.`);
  }

  const updated = await prisma.duaIndex.update({
    where: { id },
    data: {
      ...parsed,
      version: { increment: 1 },
      publishedAt:
        parsed.status === "published"
          ? (await prisma.duaIndex.findUnique({ where: { id } }))?.publishedAt || new Date()
          : undefined,
    },
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return updated;
}

/**
 * Soft-archives the index (sets status to archived). Increments the version by 1.
 */
export async function archiveDuaIndex(id: string) {
  const updated = await prisma.duaIndex.update({
    where: { id },
    data: {
      status: "archived",
      version: { increment: 1 },
    },
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return updated;
}

/**
 * Publishes the index. Increments the version by 1.
 */
export async function publishDuaIndex(id: string) {
  const current = await prisma.duaIndex.findUnique({
    where: { id },
    select: { publishedAt: true },
  });

  const updated = await prisma.duaIndex.update({
    where: { id },
    data: {
      status: "published",
      publishedAt: current?.publishedAt || new Date(),
      version: { increment: 1 },
    },
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return updated;
}

/**
 * Unpublishes the index (sets status to draft). Do not erase publishedAt.
 * Increments the version by 1.
 */
export async function unpublishDuaIndex(id: string) {
  const updated = await prisma.duaIndex.update({
    where: { id },
    data: {
      status: "draft",
      version: { increment: 1 },
    },
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return updated;
}
