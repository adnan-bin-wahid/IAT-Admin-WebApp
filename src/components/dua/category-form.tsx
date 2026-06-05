"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { duaCategorySchema, DuaCategoryInput } from "@/server/validations/dua-category-schema";
import { generateSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { Folder, AlertCircle } from "lucide-react";

interface CategoryFormProps {
  initialData?: DuaCategoryInput & { id: string };
  onSubmit: (data: DuaCategoryInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  serverError: string | null;
}

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
}: CategoryFormProps) {
  const isEditMode = !!initialData;
  const [activeTab, setActiveTab] = useState<"basic" | "bangla" | "english" | "display">("basic");
  const [slugManualOverride, setSlugManualOverride] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DuaCategoryInput>({
    resolver: zodResolver(duaCategorySchema),
    defaultValues: initialData || {
      nameBn: "",
      nameEn: "",
      slug: "",
      descriptionBn: "",
      descriptionEn: "",
      icon: "Folder",
      color: "#10b981",
    },
  });

  const nameEn = watch("nameEn");
  const nameBn = watch("nameBn");
  const color = watch("color") || "#10b981";

  // Auto-generate slug when English name changes (unless manual or edit mode)
  useEffect(() => {
    if (!isEditMode && !slugManualOverride && nameEn) {
      setValue("slug", generateSlug(nameEn), { shouldValidate: true });
    }
  }, [nameEn, isEditMode, slugManualOverride, setValue]);

  const onLocalSubmit = async (data: DuaCategoryInput) => {
    await onSubmit(data);
  };

  const tabs = [
    { id: "basic", label: "Basic" },
    { id: "bangla", label: "Bangla Translation" },
    { id: "english", label: "English Translation" },
    { id: "display", label: "Display Preview" },
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
            {tab.id === "basic" && errors.slug && (
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
          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Category Slug (Globally Unique)*</label>
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
              placeholder="e.g. সকাল-সন্ধ্যার দুআ"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
            {errors.nameBn && (
              <span className="text-[10px] text-red-500 font-medium">{errors.nameBn.message}</span>
            )}
          </div>

          {/* Description Bangla */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Bangla Description</label>
            <textarea
              rows={4}
              {...register("descriptionBn")}
              placeholder="ক্যাটাগরির বিবরণ এখানে লিখুন..."
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
              placeholder="e.g. Morning & Evening Duas"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
            />
            {errors.nameEn && (
              <span className="text-[10px] text-red-500 font-medium">{errors.nameEn.message}</span>
            )}
          </div>

          {/* Description English */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">English Description</label>
            <textarea
              rows={4}
              {...register("descriptionEn")}
              placeholder="Describe this category in English..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 resize-y"
            />
          </div>
        </div>
      )}

      {/* Display Tab */}
      {activeTab === "display" && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Color */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setValue("color", e.target.value)}
                  className="h-9 w-9 rounded-xl border border-slate-200 p-1 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  {...register("color")}
                  placeholder="e.g. #10b981"
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
                />
              </div>
            </div>

            {/* Icon */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Icon Class Name</label>
              <input
                type="text"
                {...register("icon")}
                placeholder="e.g. Folder, Heart, Sun"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20"
              />
            </div>
          </div>

          {/* Badge Preview */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 min-h-[160px] mt-4">
            <div
              style={{
                backgroundColor: `${color}15`,
                color: color,
                borderColor: `${color}30`,
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold shadow-xs select-none"
            >
              <Folder className="h-4 w-4 shrink-0" />
              <span className="flex flex-col text-left">
                <span className="text-xs font-bold leading-tight">{nameEn || "Category Name (English)"}</span>
                <span className="text-[10px] font-semibold leading-tight opacity-80">{nameBn || "ক্যাটাগরি নাম (বাংলা)"}</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-4 text-center">
              This preview approximates how the category badge may appear later.
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
            "Create Category"
          )}
        </button>
      </div>
    </form>
  );
}
