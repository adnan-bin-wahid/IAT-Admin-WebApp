import { PageHeader } from "@/components/layout/page-header";
import { BookOpen, Users, CheckCircle2, FolderHeart, ArrowUpRight, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Duas Library",
      value: "186",
      change: "+8 this week",
      icon: BookOpen,
      iconColor: "text-emerald-700 bg-emerald-50",
    },
    {
      title: "Dua Categories",
      value: "24",
      change: "Stable",
      icon: FolderHeart,
      iconColor: "text-amber-700 bg-amber-50",
    },
    {
      title: "Active Users (Mobile)",
      value: "4,821",
      change: "+14.3% monthly",
      icon: Users,
      iconColor: "text-indigo-700 bg-indigo-50",
    },
    {
      title: "Amal Submissions",
      value: "28,490",
      change: "+24% increase",
      icon: CheckCircle2,
      iconColor: "text-sky-700 bg-sky-50",
    },
  ];

  const recentDuas = [
    { id: 1, title: "Dua for seeking forgiveness (Istighfar)", category: "Forgiveness", reads: 1240, status: "Published" },
    { id: 2, title: "Dua before sleeping", category: "Daily Life", reads: 980, status: "Published" },
    { id: 3, title: "Dua for patience (Sabr) in hardship", category: "Trials & Patience", reads: 752, status: "Draft" },
    { id: 4, title: "Dua for increase in knowledge (Rabbi zidni 'ilman)", category: "Knowledge", reads: 1543, status: "Published" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of the Islamic Amal Tracker content repository and app ecosystem stats."
      />

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{stat.title}</span>
                <div className={`p-2.5 rounded-xl ${stat.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold tracking-tight text-[#022c22]">{stat.value}</span>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Panel Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Duas List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Recent Duas</h3>
            <button className="text-xs font-semibold text-emerald-700 hover:text-emerald-950 flex items-center gap-0.5">
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold text-right">Reads</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {recentDuas.map((dua) => (
                  <tr key={dua.id} className="group hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="py-3.5 font-medium text-slate-800 pr-4">{dua.title}</td>
                    <td className="py-3.5 text-slate-500">{dua.category}</td>
                    <td className="py-3.5 text-right font-medium text-slate-600">{dua.reads.toLocaleString()}</td>
                    <td className="py-3.5 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          dua.status === "Published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {dua.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Sync & Ecosystem Status Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 mb-4">Mobile App Sync</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              The content created here will sync with the mobile clients. Published updates are queued for global synchronization.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Status</span>
                  <p className="text-sm font-semibold text-[#022c22]">Fully Synced</p>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Pending Updates</span>
                  <p className="text-sm font-semibold text-slate-700">0 Changes</p>
                </div>
                <span className="text-xs font-semibold text-slate-400">Up to date</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <button className="w-full bg-[#022c22] text-white hover:bg-emerald-950 font-medium py-2 px-4 rounded-xl text-sm transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5">
              Trigger Full Resync
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
