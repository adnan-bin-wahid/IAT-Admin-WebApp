"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { duaBookSchema, DuaBookInput } from "@/server/validations/dua-book-schema";
import { generateSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { BookOpen, AlertCircle, Eye, EyeOff } from "lucide-react";

interface BookFormProps {
  initialData?: DuaBookInput & { id: string };
  onSubmit: (data: DuaBookInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  serverError: string | null;
}

export function BookForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
}: BookFormProps) {
  const isEditMode = !!initialData;
  const [activeTab, setActiveTab] = useState<"basic" | "bangla" | "english" | "preview">("basic");
  const [slugManualOverride, setSlugManualOverride] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DuaBookInput>({
    resolver: zodResolver(duaBookSchema),
    defaultValues: initialData || {
      nameBn: "",
      nameEn: "",
      slug: "",
      subtitleBn: "",
      subtitleEn: "",
      descriptionBn: "",
      descriptionEn: "",
      icon: "BookOpen",
      coverImage: "",
      accentColor: "#022c22",
      displayOrder: 0,
      status: "draft",
      isVisibleInApp: true,
    },
  });

  const nameEn = watch("nameEn");
  const nameBn = watch("nameBn");
  const accentColor = watch("accentColor") || "#022c22";

  // Auto-generate slug when English name changes (unless user manually touched it or it's edit mode)
  useEffect(() => {
    if (!isEditMode && !slugManualOverride && nameEn) {
      setValue("slug", generateSlug(nameEn), { shouldValidate: true });
    }
  }, [nameEn, isEditMode, slugManualOverride, setValue]);

  const onLocalSubmit = async (data: DuaBookInput) => {
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
            {tab.id === "basic" && (errors.slug || errors.displayOrder || errors.accentColor) && (
              <span className="ml-1 text-red-500 font-bold">•</span>
            )}
            {tab.id === "bangla" && errors.nameBn && (
              <span className="ml-1 text-red-500 font-bold">•</span>
            )}
            {tab.id === "english" && errors.nameEn && (
              <span className="ml-1 text-red-500 font-bold">•</span>
            )}
          </button>
        ))}
      </div>

      {/* Basic Settings Tab */}
      {activeTab === "basic" && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Book Slug (Unique URL/ID)*</label>
              <input
                type="text"
                {...register("slug", {
                  onChange: () => setSlugManualOverride(true),
                })}
                placeholder="e.g. morning-evening"
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

            {/* Accent Color */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Accent Hex Color (App UI)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={accentColor || "#022c22"}
                  onChange={(e) => setValue("accentColor", e.target.value)}
                  className="h-9 w-9 rounded-xl border border-slate-200 p-1 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  {...register("accentColor")}
                  placeholder="e.g. #022c22"
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
                />
              </div>
              {errors.accentColor && (
                <span className="text-[10px] text-red-500 font-medium">
                  {errors.accentColor.message}
                </span>
              )}
            </div>

            {/* Icon */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Icon Class Name</label>
              <input
                type="text"
                {...register("icon")}
                placeholder="e.g. BookOpen, Heart, Sun"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
              />
              {errors.icon && (
                <span className="text-[10px] text-red-500 font-medium">{errors.icon.message}</span>
              )}
            </div>

            {/* Cover Image */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500">Cover Image URL</label>
              <input
                type="text"
                {...register("coverImage")}
                placeholder="e.g. https://example.com/cover.jpg"
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
            <div className="flex items-center gap-3 mt-5">
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
          {/* Name Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Name (nameBn)*</label>
            <input
              type="text"
              {...register("nameBn")}
              placeholder="e.g. প্রতিদিনের দুআ"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
            {errors.nameBn && (
              <span className="text-[10px] text-red-500 font-medium">{errors.nameBn.message}</span>
            )}
          </div>

          {/* Subtitle Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Subtitle</label>
            <input
              type="text"
              {...register("subtitleBn")}
              placeholder="e.g. প্রয়োজনীয় দোয়া ও আমল"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
          </div>

          {/* Description Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Description</label>
            <textarea
              rows={4}
              {...register("descriptionBn")}
              placeholder="বইটির বিস্তারিত বিবরণ এখানে লিখুন..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>
        </div>
      )}

      {/* English Tab */}
      {activeTab === "english" && (
        <div className="space-y-4 animate-fade-in">
          {/* Name English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Name (nameEn)*</label>
            <input
              type="text"
              {...register("nameEn")}
              placeholder="e.g. Daily Duas & Supplications"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
            {errors.nameEn && (
              <span className="text-[10px] text-red-500 font-medium">{errors.nameEn.message}</span>
            )}
          </div>

          {/* Subtitle English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Subtitle</label>
            <input
              type="text"
              {...register("subtitleEn")}
              placeholder="e.g. Supplications for daily routines"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
          </div>

          {/* Description English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Description</label>
            <textarea
              rows={4}
              {...register("descriptionEn")}
              placeholder="Describe this book in English..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>
        </div>
      )}

      {/* App Display Tab */}
      {activeTab === "preview" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 min-h-[200px]">
            {/* Mock Mobile App Book Card */}
            <div
              style={{ borderColor: accentColor }}
              className="w-full max-w-[280px] bg-white rounded-2xl border-l-4 p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4 cursor-default select-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
                  className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100"
                >
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Book
                  </span>
                  <span className="font-bold text-slate-800 text-sm truncate leading-snug">
                    {nameEn || "Book Title (English)"}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold truncate">
                    {nameBn || "বইয়ের নাম (বাংলা)"}
                  </span>
                </div>
              </div>
              <span className="h-6 w-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold shrink-0">
                →
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-semibold mt-4 text-center">
              This preview approximates how the book card may appear in the mobile app later.
            </p>
          </div>
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
            "Create Book"
          )}
        </button>
      </div>
    </form>
  );
}
