import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { RecentDuaTable } from "@/components/dashboard/recent-dua-table";
import { RecentBooksTable } from "@/components/dashboard/recent-books-table";
import { getDuaDashboardStats, getRecentDuaItems, getRecentDuaBooks } from "@/server/queries/dua-queries";
import { BookOpen, FolderTree, FileText, Tags, CheckCircle2, Clock, Archive, Eye } from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
  const stats = await getDuaDashboardStats();
  const recentDuas = await getRecentDuaItems();
  const recentBooks = await getRecentDuaBooks();

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Ecosystem stats and latest content updates from the Supabase repository."
      />

      {/* Section 1: Dua Library Overview */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Dua Library Overview
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            icon={BookOpen}
            iconColor="text-emerald-700 bg-emerald-50 border border-emerald-100/50"
            href="/dua?type=book"
          />
          <StatCard
            title="Total Indexes"
            value={stats.totalIndexes}
            icon={FolderTree}
            iconColor="text-teal-700 bg-teal-50 border border-teal-100/50"
            href="/dua?type=index"
          />
          <StatCard
            title="Total Duas"
            value={stats.totalItems}
            icon={FileText}
            iconColor="text-amber-700 bg-amber-50 border border-amber-100/50"
            href="/dua?type=dua"
          />
          <StatCard
            title="Categories"
            value={stats.totalCategories}
            icon={Tags}
            iconColor="text-blue-700 bg-blue-50 border border-blue-100/50"
          />
        </div>
      </div>

      {/* Section 2: Publishing Status & Visibility */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Publishing Status & Visibility
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Published Duas"
            value={stats.publishedItems}
            icon={CheckCircle2}
            iconColor="text-emerald-700 bg-emerald-50 border border-emerald-100/50"
            href="/dua?type=dua&status=published"
          />
          <StatCard
            title="Draft Duas"
            value={stats.draftItems}
            icon={Clock}
            iconColor="text-amber-700 bg-amber-50 border border-amber-100/50"
            href="/dua?type=dua&status=draft"
          />
          <StatCard
            title="Archived Duas"
            value={stats.archivedItems}
            icon={Archive}
            iconColor="text-slate-500 bg-slate-50 border border-slate-200"
            href="/dua?type=dua&status=archived"
          />
          <StatCard
            title="Visible in App"
            value={stats.visibleItems}
            icon={Eye}
            iconColor="text-indigo-700 bg-indigo-50 border border-indigo-100/50"
            href="/dua?type=dua&visibility=visible"
          />
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Recent Dua Content */}
        <div className="lg:col-span-2">
          <DashboardSection title="Recent Dua Content">
            <RecentDuaTable items={recentDuas} />
          </DashboardSection>
        </div>

        {/* Recent Books */}
        <div className="lg:col-span-1">
          <DashboardSection title="Recent Books">
            <RecentBooksTable books={recentBooks} />
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}
