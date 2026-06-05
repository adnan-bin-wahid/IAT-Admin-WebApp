import { z } from "zod";

export const duaIndexSchema = z.object({
  bookId: z.string().min(1, "Parent Book is required"),
  titleBn: z.string().min(1, "Bangla title is required"),
  titleEn: z.string().min(1, "English title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and kebab-case (e.g. daily-prayers)"
    ),
  subtitleBn: z.string().optional().nullable(),
  subtitleEn: z.string().optional().nullable(),
  descriptionBn: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  displayOrder: z.number().int(),
  status: z.enum(["draft", "published", "archived"]),
  isVisibleInApp: z.boolean(),
});

export type DuaIndexInput = z.infer<typeof duaIndexSchema>;
