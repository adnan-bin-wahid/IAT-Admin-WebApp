"use client";

import { useEffect, useRef, useState } from "react";
import { IndexForm } from "./index-form";
import { DuaIndexInput } from "@/server/validations/dua-index-schema";
import { X } from "lucide-react";
import { toast } from "sonner";
import { createDuaIndex, updateDuaIndex } from "@/server/actions/dua-index-actions";

interface IndexFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  books: { id: string; nameEn: string; nameBn: string; status: string }[];
  initialData?: DuaIndexInput & { id: string };
  defaultBookId?: string | null;
  onSuccess?: () => void;
}

export function IndexFormDialog({
  isOpen,
  onClose,
  books,
  initialData,
  defaultBookId,
  onSuccess,
}: IndexFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
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

  const handleFormSubmit = async (data: DuaIndexInput) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      if (initialData?.id) {
        await updateDuaIndex(initialData.id, data);
        toast.success("Index updated successfully");
      } else {
        await createDuaIndex(data);
        toast.success("Index created successfully");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save index";
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
            {initialData ? "Edit Dua Index" : "Add New Dua Index"}
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
          <IndexForm
            books={books}
            initialData={initialData}
            defaultBookId={defaultBookId}
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
