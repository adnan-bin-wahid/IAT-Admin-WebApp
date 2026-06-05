"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { duaIndexSchema, DuaIndexInput } from "@/server/validations/dua-index-schema";
import { generateSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { Folder, AlertCircle, Eye, EyeOff } from "lucide-react";

interface IndexFormProps {
  books: { id: string; nameEn: string; nameBn: string; status: string }[];
  initialData?: DuaIndexInput & { id: string };
  onSubmit: (data: DuaIndexInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  serverError: string | null;
  defaultBookId?: string | null;
}

export function IndexForm({
  books,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
  defaultBookId,
}: IndexFormProps) {
  const isEditMode = !!initialData;
  const [activeTab, setActiveTab] = useState<"basic" | "bangla" | "english" | "preview">("basic");
  const [slugManualOverride, setSlugManualOverride] = useState(isEditMode);

  // Sort books so that non-archived books are shown first
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
  } = useForm<DuaIndexInput>({
    resolver: zodResolver(duaIndexSchema),
    defaultValues: initialData || {
      bookId: defaultBookId || "",
      titleBn: "",
      titleEn: "",
      slug: "",
      subtitleBn: "",
      subtitleEn: "",
      descriptionBn: "",
      descriptionEn: "",
      icon: "Folder",
      displayOrder: 0,
      status: "draft",
      isVisibleInApp: true,
    },
  });

  const titleEn = watch("titleEn");
  const titleBn = watch("titleBn");

  // Auto-generate slug when English title changes (unless manual or edit mode)
  useEffect(() => {
    if (!isEditMode && !slugManualOverride && titleEn) {
      setValue("slug", generateSlug(titleEn), { shouldValidate: true });
    }
  }, [titleEn, isEditMode, slugManualOverride, setValue]);

  const onLocalSubmit = async (data: DuaIndexInput) => {
    await onSubmit(data);
  };

  const tabs = [
    { id: "basic", label: "Basic Settings" },
    { id: "bangla", label: "Bangla Translation" },
    { id: "english", label: "English Translation" },
    { id: "preview", label: "App Live Preview" },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onLocalSubmit)} className="space-y-6">
      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Save failed:</span> {serverError}
          </div>
        </div>
      )}

      {/* Tabs list */}
      <div className="flex border-b border-slate-100 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-all outline-none",
              activeTab === tab.id
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            {tab.label}
            {tab.id === "basic" && (errors.bookId || errors.slug || errors.displayOrder) && (
              <span className="ml-1 text-red-500 font-bold">•</span>
            )}
            {tab.id === "bangla" && errors.titleBn && (
              <span className="ml-1 text-red-500 font-bold">•</span>
            )}
            {tab.id === "english" && errors.titleEn && (
              <span className="ml-1 text-red-500 font-bold">•</span>
            )}
          </button>
        ))}
      </div>

      {/* Basic Settings Tab */}
      {activeTab === "basic" && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Parent Book Selector */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500">Parent Book (DuaBook)*</label>
              <select
                {...register("bookId")}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
              >
                <option value="">-- Select a Parent Book --</option>
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

            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Index Slug (Unique per book)*</label>
              <input
                type="text"
                {...register("slug", {
                  onChange: () => setSlugManualOverride(true),
                })}
                placeholder="e.g. daily-prayers"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
              />
              {errors.slug && (
                <span className="text-[10px] text-red-500 font-medium">{errors.slug.message}</span>
              )}
            </div>

            {/* Display Order */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Display Order</label>
              <input
                type="number"
                {...register("displayOrder", { valueAsNumber: true })}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
              />
              {errors.displayOrder && (
                <span className="text-[10px] text-red-500 font-medium">
                  {errors.displayOrder.message}
                </span>
              )}
            </div>

            {/* Icon */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Icon Class Name</label>
              <input
                type="text"
                {...register("icon")}
                placeholder="e.g. Folder, Heart, Star"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
              />
            </div>

            {/* Status Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Default Status</label>
              <select
                {...register("status")}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Visible in App Switch */}
            <div className="flex items-center gap-3 mt-5 md:col-span-2">
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

      {/* Bangla Tab */}
      {activeTab === "bangla" && (
        <div className="space-y-4 animate-fade-in">
          {/* Title Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Title (titleBn)*</label>
            <input
              type="text"
              {...register("titleBn")}
              placeholder="e.g. সকাল-সন্ধ্যার আমল"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
            {errors.titleBn && (
              <span className="text-[10px] text-red-500 font-medium">{errors.titleBn.message}</span>
            )}
          </div>

          {/* Subtitle Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Subtitle</label>
            <input
              type="text"
              {...register("subtitleBn")}
              placeholder="e.g. ফজিলতপূর্ণ দোয়া ও আমল"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
          </div>

          {/* Description Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Description</label>
            <textarea
              rows={4}
              {...register("descriptionBn")}
              placeholder="এই সেকশনের বর্ণনা এখানে লিখুন..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>
        </div>
      )}

      {/* English Tab */}
      {activeTab === "english" && (
        <div className="space-y-4 animate-fade-in">
          {/* Title English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Title (titleEn)*</label>
            <input
              type="text"
              {...register("titleEn")}
              placeholder="e.g. Morning & Evening Prayers"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
            {errors.titleEn && (
              <span className="text-[10px] text-red-500 font-medium">{errors.titleEn.message}</span>
            )}
          </div>

          {/* Subtitle English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Subtitle</label>
            <input
              type="text"
              {...register("subtitleEn")}
              placeholder="e.g. Supplications for day and night"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
          </div>

          {/* Description English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Description</label>
            <textarea
              rows={4}
              {...register("descriptionEn")}
              placeholder="Describe this section in English..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>
        </div>
      )}

      {/* App Display Tab */}
      {activeTab === "preview" && (
        <div className="space-y-6 animate-fade-in flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 min-h-[200px]">
          {/* Mock Mobile Index Card */}
          <div className="w-full max-w-[280px] bg-white rounded-xl border border-slate-100 p-3 shadow-sm flex items-center justify-between gap-3 select-none">
            <div className="flex items-center gap-2 min-w-0">
              <Folder className="h-4 w-4 text-emerald-700 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {titleEn || "Section Title (English)"}
                </span>
                <span className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                  {titleBn || "সেকশন নাম (বাংলা)"}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded shrink-0">
              Duas: 0
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-semibold mt-4 text-center">
            This preview approximates how the index/section may appear inside the mobile app later.
          </p>
        </div>
      )}

      {/* Form Action Controls */}
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
          className="rounded-xl bg-[#022c22] text-white px-5 py-2 text-xs font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
        >
          {isSubmitting ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
              Saving...
            </>
          ) : isEditMode ? (
            "Save Changes"
          ) : (
            "Create Index"
          )}
        </button>
      </div>
    </form>
  );
}
