import { z } from "zod";

export const duaBookSchema = z.object({
  nameBn: z.string().min(1, "Bangla name is required"),
  nameEn: z.string().min(1, "English name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and kebab-case (e.g. morning-evening)"
    ),
  subtitleBn: z.string().optional().nullable(),
  subtitleEn: z.string().optional().nullable(),
  descriptionBn: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  accentColor: z.string().optional().nullable(),
  displayOrder: z.number().int(),
  status: z.enum(["draft", "published", "archived"]),
  isVisibleInApp: z.boolean(),
});

export type DuaBookInput = z.infer<typeof duaBookSchema>;
