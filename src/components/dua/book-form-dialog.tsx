"use client";

import { useEffect, useRef, useState } from "react";
import { BookForm } from "./book-form";
import { DuaBookInput } from "@/server/validations/dua-book-schema";
import { X } from "lucide-react";
import { toast } from "sonner";
import { createDuaBook, updateDuaBook } from "@/server/actions/dua-book-actions";

interface BookFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: DuaBookInput & { id: string };
  onSuccess?: () => void;
}

export function BookFormDialog({ isOpen, onClose, initialData, onSuccess }: BookFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for Escape key press to close dialog
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

  const handleFormSubmit = async (data: DuaBookInput) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      if (initialData?.id) {
        await updateDuaBook(initialData.id, data);
        toast.success("Book updated successfully");
      } else {
        await createDuaBook(data);
        toast.success("Book created successfully");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save book";
      setServerError(message);
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
    >
      <div
        ref={dialogRef}
        className="bg-white w-full max-w-2xl rounded-2xl border border-slate-100 shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-800">
            {initialData ? "Edit Dua Book" : "Add New Dua Book"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <BookForm
            initialData={initialData}
            onSubmit={handleFormSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
            serverError={serverError}
          />
        </div>
      </div>
    </div>
  );
}
