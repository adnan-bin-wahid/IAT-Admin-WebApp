import { StatusBadge } from "@/components/common/status-badge";
import { DuaItem, DuaBook, DuaIndex, DuaCategory } from "@prisma/client";

interface DuaItemWithRelations extends DuaItem {
  book: DuaBook;
  index: DuaIndex;
  category: DuaCategory;
}

interface RecentDuaTableProps {
  items: DuaItemWithRelations[];
}

export function RecentDuaTable({ items }: RecentDuaTableProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium text-slate-400">No recent duas found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6">
      <div className="inline-block min-w-full align-middle px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-3">
              <th className="pb-3.5">Title</th>
              <th className="pb-3.5">Book</th>
              <th className="pb-3.5">Index</th>
              <th className="pb-3.5">Category</th>
              <th className="pb-3.5 text-center">Status</th>
              <th className="pb-3.5 text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {items.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors duration-150">
                <td className="py-3.5 pr-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 line-clamp-1">{item.titleEn}</span>
                    <span className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">{item.titleBn}</span>
                  </div>
                </td>
                <td className="py-3.5 text-slate-500 max-w-[150px] truncate">{item.book.nameEn}</td>
                <td className="py-3.5 text-slate-500 max-w-[150px] truncate">{item.index.titleEn}</td>
                <td className="py-3.5 text-slate-500 truncate">{item.category.nameEn}</td>
                <td className="py-3.5 text-center">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-3.5 text-right text-xs text-slate-400 font-medium whitespace-nowrap">
                  {new Date(item.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
