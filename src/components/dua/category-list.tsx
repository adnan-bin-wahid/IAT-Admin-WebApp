"use client";

import { useState } from "react";
import { Edit, Trash, Folder } from "lucide-react";
import { CategoryFormDialog } from "./category-form-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";

interface Category {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  icon: string | null;
  color: string | null;
  descriptionEn: string | null;
  descriptionBn: string | null;
  createdAt: Date | string;
  _count?: {
    duaItems: number;
  };
}

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase font-bold tracking-widest text-slate-400">
              <th className="py-3 px-4">Name (En/Bn)</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Appearance</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-center">Duas Linked</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                  No categories found. Click Add Category to create one.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50/30 transition-colors">
                  {/* Name En/Bn */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-slate-800">{category.nameEn}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{category.nameBn}</span>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 font-bold bg-slate-50 border border-slate-100/40 px-2.5 py-0.5 rounded-lg max-w-[150px] truncate">
                    {category.slug}
                  </td>

                  {/* Icon & Color */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          backgroundColor: `${category.color || "#10b981"}15`,
                          color: category.color || "#10b981",
                        }}
                        className="h-7 w-7 rounded-lg flex items-center justify-center border border-slate-100/50"
                      >
                        <Folder className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">
                        {category.color || "#10b981"}
                      </span>
                    </div>
                  </td>

                  {/* Description En */}
                  <td className="py-3.5 px-4 text-slate-500 max-w-[200px] truncate">
                    {category.descriptionEn || "—"}
                  </td>

                  {/* Duas Count */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/50">
                      {category._count?.duaItems ?? 0}
                    </span>
                  </td>

                  {/* Created At */}
                  <td className="py-3.5 px-4 text-slate-400 font-medium">
                    {formatDate(category.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingCategory(category)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Category Dialog */}
      {editingCategory && (
        <CategoryFormDialog
          isOpen={true}
          onClose={() => setEditingCategory(null)}
          initialData={{
            id: editingCategory.id,
            nameBn: editingCategory.nameBn,
            nameEn: editingCategory.nameEn,
            slug: editingCategory.slug,
            descriptionBn: editingCategory.descriptionBn || "",
            descriptionEn: editingCategory.descriptionEn || "",
            icon: editingCategory.icon || "Folder",
            color: editingCategory.color || "#10b981",
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingCategory && (
        <DeleteConfirmDialog
          isOpen={true}
          onClose={() => setDeletingCategory(null)}
          id={deletingCategory.id}
          name={deletingCategory.nameEn}
          type="category"
        />
      )}
    </div>
  );
}
