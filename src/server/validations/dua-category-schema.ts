import { z } from "zod";

export const duaCategorySchema = z.object({
  nameBn: z.string().min(1, "Bangla name is required"),
  nameEn: z.string().min(1, "English name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and kebab-case (e.g. daily-prayers)"
    ),
  descriptionBn: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export type DuaCategoryInput = z.infer<typeof duaCategorySchema>;
