"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { deleteDuaCategory } from "@/server/actions/dua-category-actions";
import { toast } from "sonner";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  name: string;
  type: "category";
  onSuccess?: () => void;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  id,
  name,
  type,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (type === "category") {
        await deleteDuaCategory(id);
        toast.success("Category deleted successfully");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to delete ${type}`;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
    >
      <div
        ref={dialogRef}
        className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-xl flex flex-col overflow-hidden animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-red-500" /> Confirm Delete
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete the {type} <span className="font-bold text-slate-800">&quot;{name}&quot;</span>?
          </p>
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-[11px] text-red-700 font-semibold leading-relaxed">
              Deleting a category is only allowed if no duas are currently linked to it. If this category is already used by one or more duas, the system will block deletion.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 bg-white text-slate-500 px-4 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="rounded-xl bg-red-600 text-white px-5 py-2 text-xs font-bold hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
