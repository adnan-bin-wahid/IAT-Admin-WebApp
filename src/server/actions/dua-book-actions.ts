"use server";

import { prisma } from "@/lib/prisma";
import { duaBookSchema, DuaBookInput } from "../validations/dua-book-schema";
import { revalidatePath } from "next/cache";

/**
 * Creates a new DuaBook in Supabase.
 * Verifies slug uniqueness and defaults version to 1.
 */
export async function createDuaBook(rawInput: DuaBookInput) {
  const parsed = duaBookSchema.parse(rawInput);

  // Check unique slug
  const existing = await prisma.duaBook.findUnique({
    where: { slug: parsed.slug },
  });

  if (existing) {
    throw new Error(`A book with slug '${parsed.slug}' already exists.`);
  }

  const newBook = await prisma.duaBook.create({
    data: {
      ...parsed,
      version: 1,
      publishedAt: parsed.status === "published" ? new Date() : null,
    },
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return newBook;
}

/**
 * Updates an existing DuaBook fields and increments the version by 1.
 */
export async function updateDuaBook(id: string, rawInput: DuaBookInput) {
  const parsed = duaBookSchema.parse(rawInput);

  // Check if another book has the same slug
  const existing = await prisma.duaBook.findFirst({
    where: {
      slug: parsed.slug,
      id: { not: id },
    },
  });

  if (existing) {
    throw new Error(`A book with slug '${parsed.slug}' already exists.`);
  }

  const updated = await prisma.duaBook.update({
    where: { id },
    data: {
      ...parsed,
      version: { increment: 1 },
      publishedAt:
        parsed.status === "published"
          ? (await prisma.duaBook.findUnique({ where: { id } }))?.publishedAt || new Date()
          : undefined, // Let the status-specific publish action handle toggling publishedAt
    },
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return updated;
}

/**
 * Sets book status to archived. Increments the version by 1.
 */
export async function archiveDuaBook(id: string) {
  const updated = await prisma.duaBook.update({
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
 * Publishes the book (sets status to published and sets publishedAt if missing).
 * Increments the version by 1.
 */
export async function publishDuaBook(id: string) {
  const current = await prisma.duaBook.findUnique({
    where: { id },
    select: { publishedAt: true },
  });

  const updated = await prisma.duaBook.update({
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
 * Unpublishes the book (sets status to draft). Do not erase publishedAt.
 * Increments the version by 1.
 */
export async function unpublishDuaBook(id: string) {
  const updated = await prisma.duaBook.update({
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
