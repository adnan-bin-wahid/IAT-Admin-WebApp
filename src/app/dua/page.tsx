import { PageHeader } from "@/components/layout/page-header";
import { BookOpen, Database, Plus, HelpCircle } from "lucide-react";

export default function DuaLibraryPage() {
  return (
    <div>
      <PageHeader
        title="Dua Library"
        description="Create, edit, and organize Duas, translations, categories, and references."
        actions={
          <button
            className="bg-[#022c22] text-white opacity-80 cursor-not-allowed font-medium py-2 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center gap-1.5"
            disabled
          >
            <Plus className="h-4 w-4" /> Add New Dua
          </button>
        }
      />

      {/* Database/Prisma connection status placeholder */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-12 py-16">
        <div className="h-16 w-16 rounded-2xl bg-amber-50 border border-amber-200/50 flex items-center justify-center text-amber-600 mb-6">
          <Database className="h-8 w-8" />
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 mb-2">Database Connection Pending</h3>
        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          Prisma ORM and Postgres database actions will be implemented in the next step. Currently, the interface is in layout prototype mode.
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>Next Step: Prisma Integration & CRUD Actions</span>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 w-full max-w-sm flex items-center justify-center gap-6 text-slate-400 text-xs">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>Modular Schema Ready</span>
          </div>
          <div className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            <span>Offline Sync Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
