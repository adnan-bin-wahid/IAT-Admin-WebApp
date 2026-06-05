import { z } from "zod";

export const duaItemSchema = z.object({
  bookId: z.string().min(1, "Book is required"),
  indexId: z.string().min(1, "Index is required"),
  categoryId: z.string().min(1, "Category is required"),
  titleBn: z.string().min(1, "Bangla title is required"),
  titleEn: z.string().min(1, "English title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and kebab-case (e.g. test-dua)"
    ),
  shortDescriptionBn: z.string().optional().nullable(),
  shortDescriptionEn: z.string().optional().nullable(),
  arabicText: z.string().min(1, "Arabic text is required"),
  banglaMeaning: z.string().optional().nullable(),
  englishMeaning: z.string().optional().nullable(),
  transliterationBn: z.string().optional().nullable(),
  transliterationEn: z.string().optional().nullable(),
  referenceBn: z.string().optional().nullable(),
  referenceEn: z.string().optional().nullable(),
  benefitsBn: z.string().optional().nullable(),
  benefitsEn: z.string().optional().nullable(),
  notesBn: z.string().optional().nullable(),
  notesEn: z.string().optional().nullable(),
  repeatCount: z.coerce.number().int().min(1, "Repeat count must be at least 1"),
  tagsBn: z.array(z.string()).default([]),
  tagsEn: z.array(z.string()).default([]),
  searchKeywordsBn: z.string().optional().nullable(),
  searchKeywordsEn: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  isVisibleInApp: z.boolean().default(true),
});

export type DuaItemInput = z.infer<typeof duaItemSchema>;
