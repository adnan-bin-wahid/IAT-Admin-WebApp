"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { duaItemSchema, DuaItemInput } from "@/server/validations/dua-item-schema";
import { generateSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { AlertCircle, Eye, EyeOff, BookOpen, Compass, Tag, Calendar, ShieldCheck } from "lucide-react";
import { CategorySelect } from "./category-select";
import { DuaBookWithIndexes, DuaCategoryWithCount } from "@/types/dua";

const duaItemFormSchema = z.object({
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
  repeatCount: z.preprocess((val) => Number(val), z.number().int().min(1, "Repeat count must be at least 1")),
  tagsBnString: z.string().optional().nullable(),
  tagsEnString: z.string().optional().nullable(),
  searchKeywordsBn: z.string().optional().nullable(),
  searchKeywordsEn: z.string().optional().nullable(),
  displayOrder: z.preprocess((val) => val === "" || val === undefined || val === null ? 0 : Number(val), z.number().int().default(0)),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  isVisibleInApp: z.boolean().default(true),
});

type DuaItemFormValues = z.infer<typeof duaItemFormSchema>;

interface DuaItemFormProps {
  books: DuaBookWithIndexes[];
  categories: DuaCategoryWithCount[];
  initialData?: DuaItemInput & { id: string; version?: number; createdAt?: Date | string; updatedAt?: Date | string };
  onSubmit: (data: DuaItemInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  serverError: string | null;
  defaultBookId?: string | null;
  defaultIndexId?: string | null;
}

export function DuaItemForm({
  books,
  categories,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
  defaultBookId,
  defaultIndexId,
}: DuaItemFormProps) {
  const isEditMode = !!initialData;
  const [activeTab, setActiveTab] = useState<"basic" | "bangla" | "english" | "arabic" | "metadata">("basic");
  const [slugManualOverride, setSlugManualOverride] = useState(isEditMode);

  // Filter archived books in selector, sorting non-archived first
  const sortedBooks = [...books].sort((a, b) => {
    if (a.status === "archived" && b.status !== "archived") return 1;
    if (a.status !== "archived" && b.status === "archived") return -1;
    return 0;
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DuaItemFormValues>({
    resolver: zodResolver(duaItemFormSchema),
    defaultValues: initialData
      ? {
          bookId: initialData.bookId,
          indexId: initialData.indexId,
          categoryId: initialData.categoryId,
          titleBn: initialData.titleBn,
          titleEn: initialData.titleEn,
          slug: initialData.slug,
          shortDescriptionBn: initialData.shortDescriptionBn || "",
          shortDescriptionEn: initialData.shortDescriptionEn || "",
          arabicText: initialData.arabicText || "",
          banglaMeaning: initialData.banglaMeaning || "",
          englishMeaning: initialData.englishMeaning || "",
          transliterationBn: initialData.transliterationBn || "",
          transliterationEn: initialData.transliterationEn || "",
          referenceBn: initialData.referenceBn || "",
          referenceEn: initialData.referenceEn || "",
          benefitsBn: initialData.benefitsBn || "",
          benefitsEn: initialData.benefitsEn || "",
          notesBn: initialData.notesBn || "",
          notesEn: initialData.notesEn || "",
          repeatCount: initialData.repeatCount,
          tagsBnString: initialData.tagsBn?.join(", ") || "",
          tagsEnString: initialData.tagsEn?.join(", ") || "",
          searchKeywordsBn: initialData.searchKeywordsBn || "",
          searchKeywordsEn: initialData.searchKeywordsEn || "",
          displayOrder: initialData.displayOrder,
          status: initialData.status,
          isVisibleInApp: initialData.isVisibleInApp,
        }
      : {
          bookId: defaultBookId || "",
          indexId: defaultIndexId || "",
          categoryId: "",
          titleBn: "",
          titleEn: "",
          slug: "",
          shortDescriptionBn: "",
          shortDescriptionEn: "",
          arabicText: "",
          banglaMeaning: "",
          englishMeaning: "",
          transliterationBn: "",
          transliterationEn: "",
          referenceBn: "",
          referenceEn: "",
          benefitsBn: "",
          benefitsEn: "",
          notesBn: "",
          notesEn: "",
          repeatCount: 1,
          tagsBnString: "",
          tagsEnString: "",
          searchKeywordsBn: "",
          searchKeywordsEn: "",
          displayOrder: 0,
          status: "draft",
          isVisibleInApp: true,
        },
  });

  const selectedBookId = watch("bookId");
  const selectedIndexId = watch("indexId");
  const selectedCategoryId = watch("categoryId");
  const titleEn = watch("titleEn");
  const arabicText = watch("arabicText");

  // Get indexes for the selected book dynamically
  const availableIndexes = useMemo(() => {
    return books.find((b) => b.id === selectedBookId)?.indexes || [];
  }, [books, selectedBookId]);

  // Reset index selection if parent book changes and index does not belong to it
  useEffect(() => {
    if (selectedBookId) {
      const indexBelongsToBook = availableIndexes.some((idx) => idx.id === selectedIndexId);
      if (!indexBelongsToBook && selectedIndexId !== "") {
        setValue("indexId", "", { shouldValidate: true });
      }
    } else {
      setValue("indexId", "", { shouldValidate: true });
    }
  }, [selectedBookId, availableIndexes, selectedIndexId, setValue]);

  // Auto-generate slug from English title
  useEffect(() => {
    if (!isEditMode && !slugManualOverride && titleEn) {
      setValue("slug", generateSlug(titleEn), { shouldValidate: true });
    }
  }, [titleEn, isEditMode, slugManualOverride, setValue]);

  const onLocalSubmit = async (values: DuaItemFormValues) => {
    // Parse comma separated tags to arrays
    const tagsBn = values.tagsBnString
      ? values.tagsBnString
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    const tagsEn = values.tagsEnString
      ? values.tagsEnString
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const formattedData: DuaItemInput = {
      bookId: values.bookId,
      indexId: values.indexId,
      categoryId: values.categoryId,
      titleBn: values.titleBn,
      titleEn: values.titleEn,
      slug: values.slug,
      shortDescriptionBn: values.shortDescriptionBn || "",
      shortDescriptionEn: values.shortDescriptionEn || "",
      arabicText: values.arabicText || "",
      banglaMeaning: values.banglaMeaning || "",
      englishMeaning: values.englishMeaning || "",
      transliterationBn: values.transliterationBn || "",
      transliterationEn: values.transliterationEn || "",
      referenceBn: values.referenceBn || "",
      referenceEn: values.referenceEn || "",
      benefitsBn: values.benefitsBn || "",
      benefitsEn: values.benefitsEn || "",
      notesBn: values.notesBn || "",
      notesEn: values.notesEn || "",
      repeatCount: values.repeatCount,
      tagsBn,
      tagsEn,
      searchKeywordsBn: values.searchKeywordsBn || "",
      searchKeywordsEn: values.searchKeywordsEn || "",
      displayOrder: values.displayOrder,
      status: values.status,
      isVisibleInApp: values.isVisibleInApp,
    };

    await onSubmit(formattedData);
  };

  const tabs = [
    { id: "basic", label: "Basic Settings" },
    { id: "bangla", label: "Bangla Content" },
    { id: "english", label: "English Content" },
    { id: "arabic", label: "Arabic & Meaning" },
    { id: "metadata", label: "Metadata & Info" },
  ] as const;

  // Resolve badge/info values for Preview
  const currentCategory = categories.find((c) => c.id === selectedCategoryId);
  const currentBook = books.find((b) => b.id === selectedBookId);
  const currentIndex = availableIndexes.find((i) => i.id === selectedIndexId);

  return (
    <form onSubmit={handleSubmit(onLocalSubmit)} className="space-y-6">
      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Save failed:</span> {serverError}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-100 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          let hasError = false;
          if (tab.id === "basic") {
            hasError = !!(errors.bookId || errors.indexId || errors.categoryId || errors.slug || errors.repeatCount || errors.displayOrder);
          } else if (tab.id === "bangla") {
            hasError = !!errors.titleBn;
          } else if (tab.id === "english") {
            hasError = !!errors.titleEn;
          } else if (tab.id === "arabic") {
            hasError = !!errors.arabicText;
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-all outline-none cursor-pointer",
                activeTab === tab.id
                  ? "border-emerald-700 text-emerald-800"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              {tab.label}
              {hasError && <span className="ml-1 text-red-500 font-bold">•</span>}
            </button>
          );
        })}
      </div>

      {/* Tab: Basic Settings */}
      {activeTab === "basic" && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Book Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Parent Book (DuaBook)*</label>
              <select
                {...register("bookId")}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
              >
                <option value="">-- Select a Book --</option>
                {sortedBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.nameEn} ({book.nameBn}) {book.status === "archived" ? "[Archived]" : ""}
                  </option>
                ))}
              </select>
              {errors.bookId && (
                <span className="text-[10px] text-red-500 font-medium">{errors.bookId.message}</span>
              )}
            </div>

            {/* Index Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Parent Index (DuaIndex)*</label>
              <select
                {...register("indexId")}
                disabled={!selectedBookId}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 disabled:bg-slate-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedBookId ? "-- Select an Index --" : "-- Choose a book first --"}
                </option>
                {availableIndexes.map((idx) => (
                  <option key={idx.id} value={idx.id}>
                    {idx.titleEn} ({idx.titleBn})
                  </option>
                ))}
              </select>
              {errors.indexId && (
                <span className="text-[10px] text-red-500 font-medium">{errors.indexId.message}</span>
              )}
            </div>

            {/* Category Selector (Reusable category-select) */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <CategorySelect
                categories={categories}
                label="Dua Category (Required)*"
                error={errors.categoryId?.message}
                {...register("categoryId")}
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Dua Slug (Unique within Index)*</label>
              <input
                type="text"
                {...register("slug", {
                  onChange: () => setSlugManualOverride(true),
                })}
                placeholder="e.g. daily-forgiveness-dua"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
              />
              {errors.slug && (
                <span className="text-[10px] text-red-500 font-medium">{errors.slug.message}</span>
              )}
            </div>

            {/* Repeat Count */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Repeat Count (Min 1)*</label>
              <input
                type="number"
                min="1"
                {...register("repeatCount")}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
              />
              {errors.repeatCount && (
                <span className="text-[10px] text-red-500 font-medium">
                  {errors.repeatCount.message}
                </span>
              )}
            </div>

            {/* Display Order */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Display Order</label>
              <input
                type="number"
                {...register("displayOrder")}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
              />
              {errors.displayOrder && (
                <span className="text-[10px] text-red-500 font-medium">
                  {errors.displayOrder.message}
                </span>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Status</label>
              <select
                {...register("status")}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Visible in App */}
            <div className="flex items-center gap-3 mt-4 md:col-span-2">
              <input
                type="checkbox"
                id="isVisibleInApp"
                {...register("isVisibleInApp")}
                className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
              />
              <label
                htmlFor="isVisibleInApp"
                className="text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5 select-none"
              >
                {watch("isVisibleInApp") ? (
                  <><Eye className="h-4 w-4 text-emerald-600" /> Visible in Mobile App</>
                ) : (
                  <><EyeOff className="h-4 w-4 text-slate-400" /> Hidden in Mobile App</>
                )}
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Bangla Content */}
      {activeTab === "bangla" && (
        <div className="space-y-4 animate-fade-in">
          {/* Title Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Title (titleBn)*</label>
            <input
              type="text"
              {...register("titleBn")}
              placeholder="e.g. ক্ষমার দোয়া"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
            {errors.titleBn && (
              <span className="text-[10px] text-red-500 font-medium">{errors.titleBn.message}</span>
            )}
          </div>

          {/* Short Description Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Short Description</label>
            <textarea
              rows={2}
              {...register("shortDescriptionBn")}
              placeholder="সংক্ষিপ্ত ভূমিকা বা বিবরণ..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>

          {/* Transliteration Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Transliteration</label>
            <textarea
              rows={3}
              {...register("transliterationBn")}
              placeholder="বাংলা উচ্চারণ..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>

          {/* Bangla Meaning */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Meaning</label>
            <textarea
              rows={3}
              {...register("banglaMeaning")}
              placeholder="বাংলা অর্থ..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>

          {/* Reference Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Reference</label>
            <input
              type="text"
              {...register("referenceBn")}
              placeholder="e.g. সুনানে ইবনে মাজাহ: ৩৮২২"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
          </div>

          {/* Benefits Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Benefits & Virtues</label>
            <textarea
              rows={3}
              {...register("benefitsBn")}
              placeholder="এই দুআর ফজিলত..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>

          {/* Notes Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Notes</label>
            <textarea
              rows={3}
              {...register("notesBn")}
              placeholder="গুরুত্বপূর্ণ নোট..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>

          {/* Tags Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Tags (Comma separated)</label>
            <input
              type="text"
              {...register("tagsBnString")}
              placeholder="e.g. ক্ষমা, ইস্তিগফার, তাওবা"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
          </div>

          {/* Search Keywords Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Search Keywords</label>
            <input
              type="text"
              {...register("searchKeywordsBn")}
              placeholder="e.g. মাফ চাওয়া, গুনাহ মাফ"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
          </div>
        </div>
      )}

      {/* Tab: English Content */}
      {activeTab === "english" && (
        <div className="space-y-4 animate-fade-in">
          {/* Title English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Title (titleEn)*</label>
            <input
              type="text"
              {...register("titleEn")}
              placeholder="e.g. Supplication for Forgiveness"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
            {errors.titleEn && (
              <span className="text-[10px] text-red-500 font-medium">{errors.titleEn.message}</span>
            )}
          </div>

          {/* Short Description English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Short Description</label>
            <textarea
              rows={2}
              {...register("shortDescriptionEn")}
              placeholder="Brief intro in English..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>

          {/* Transliteration English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Transliteration</label>
            <textarea
              rows={3}
              {...register("transliterationEn")}
              placeholder="English transliteration..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>

          {/* English Meaning */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Meaning</label>
            <textarea
              rows={3}
              {...register("englishMeaning")}
              placeholder="English translation meaning..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>

          {/* Reference English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Reference</label>
            <input
              type="text"
              {...register("referenceEn")}
              placeholder="e.g. Sunan Ibn Majah: 3822"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
          </div>

          {/* Benefits English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Benefits & Virtues</label>
            <textarea
              rows={3}
              {...register("benefitsEn")}
              placeholder="Benefits of reciting this Supplication..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>

          {/* Notes English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Notes</label>
            <textarea
              rows={3}
              {...register("notesEn")}
              placeholder="Important notes..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>

          {/* Tags English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Tags (Comma separated)</label>
            <input
              type="text"
              {...register("tagsEnString")}
              placeholder="e.g. forgiveness, istighfar, tawbah"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
          </div>

          {/* Search Keywords English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Search Keywords</label>
            <input
              type="text"
              {...register("searchKeywordsEn")}
              placeholder="e.g. forgiveness, seek mercy, delete sin"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
          </div>
        </div>
      )}

      {/* Tab: Arabic & Meaning */}
      {activeTab === "arabic" && (
        <div className="space-y-4 animate-fade-in">
          {/* Arabic Text Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Arabic Text (arabicText)*</label>
            <textarea
              rows={6}
              dir="rtl"
              {...register("arabicText")}
              placeholder="اَللّٰهُمَّ اغْفِرْ لِيْ..."
              className="rounded-xl border border-slate-200 px-4 py-3 text-lg font-medium outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y bg-slate-50/20 text-slate-800 leading-loose"
            />
            {errors.arabicText && (
              <span className="text-[10px] text-red-500 font-medium">{errors.arabicText.message}</span>
            )}
          </div>

          {/* Quick Arabic Preview */}
          {arabicText && (
            <div className="p-4 bg-emerald-50/10 border border-emerald-100/50 rounded-2xl flex flex-col items-center gap-3 select-none">
              <span className="text-[9px] font-bold tracking-widest text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Arabic text typography preview
              </span>
              <p dir="rtl" className="text-2xl text-slate-800 leading-loose text-center font-semibold max-w-lg mt-1">
                {arabicText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Metadata & Info */}
      {activeTab === "metadata" && (
        <div className="space-y-5 animate-fade-in">
          {/* Layout relationships info */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-slate-700">Dua Relationship Context</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200/50">
                <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Book</p>
                  <p className="font-semibold text-slate-700 truncate">{currentBook?.nameEn || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200/50">
                <Compass className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Index (Chapter)</p>
                  <p className="font-semibold text-slate-700 truncate">{currentIndex?.titleEn || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200/50">
                <Tag className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Category</p>
                  <p className="font-semibold text-slate-700 truncate">{currentCategory?.nameEn || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Logs and Version Controls */}
          {isEditMode && initialData && (
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-700">Audit Info</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">Current Version</p>
                    <p className="font-semibold text-slate-700">v{initialData.version || 1}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">Created Date</p>
                    <p className="font-semibold text-slate-700">
                      {initialData.createdAt ? new Date(initialData.createdAt).toLocaleString() : "—"}
                    </p>
                  </div>
                </div>

                {initialData.updatedAt && (
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold">Last Updated</p>
                      <p className="font-semibold text-slate-700">
                        {new Date(initialData.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Future Mobile Sync Notification */}
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-[10px] text-amber-800 font-semibold leading-relaxed">
            Note: All changes made to Duas will increment versions automatically. These updates are indexed directly for mobile client synchronization on downstream Flutter applications.
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-200 bg-white text-slate-500 px-4 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#022c22] text-white px-5 py-2 text-xs font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
              Saving...
            </>
          ) : isEditMode ? (
            "Save Changes"
          ) : (
            "Create Dua"
          )}
        </button>
      </div>
    </form>
  );
}
