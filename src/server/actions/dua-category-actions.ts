"use server";

import { prisma } from "@/lib/prisma";
import { duaCategorySchema, DuaCategoryInput } from "../validations/dua-category-schema";
import { revalidatePath } from "next/cache";

/**
 * Creates a new DuaCategory in Supabase.
 * Checks for global slug uniqueness.
 */
export async function createDuaCategory(rawInput: DuaCategoryInput) {
  const parsed = duaCategorySchema.parse(rawInput);

  // Check unique slug globally
  const existing = await prisma.duaCategory.findUnique({
    where: { slug: parsed.slug },
  });

  if (existing) {
    throw new Error(`A category with slug '${parsed.slug}' already exists.`);
  }

  const newCategory = await prisma.duaCategory.create({
    data: parsed,
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return newCategory;
}

/**
 * Updates an existing DuaCategory fields.
 */
export async function updateDuaCategory(id: string, rawInput: DuaCategoryInput) {
  const parsed = duaCategorySchema.parse(rawInput);

  // Check if another category has the same slug
  const existing = await prisma.duaCategory.findFirst({
    where: {
      slug: parsed.slug,
      id: { not: id },
    },
  });

  if (existing) {
    throw new Error(`A category with slug '${parsed.slug}' already exists.`);
  }

  const updated = await prisma.duaCategory.update({
    where: { id },
    data: parsed,
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return updated;
}

/**
 * Deletes a category if it is not referenced by any DuaItem.
 * Throws a clear error if referenced.
 */
export async function deleteDuaCategory(id: string) {
  // Check if any DuaItem uses this category
  const linkedDua = await prisma.duaItem.findFirst({
    where: { categoryId: id },
    select: { id: true },
  });

  if (linkedDua) {
    throw new Error("This category is used by existing duas and cannot be deleted.");
  }

  const deleted = await prisma.duaCategory.delete({
    where: { id },
  });

  revalidatePath("/dua");
  revalidatePath("/dashboard");

  return deleted;
}
