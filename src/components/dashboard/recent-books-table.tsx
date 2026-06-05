import { StatusBadge } from "@/components/common/status-badge";
import { DuaBook } from "@prisma/client";

interface DuaBookWithCounts extends DuaBook {
  _count: {
    indexes: number;
    duaItems: number;
  };
}

interface RecentBooksTableProps {
  books: DuaBookWithCounts[];
}

export function RecentBooksTable({ books }: RecentBooksTableProps) {
  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium text-slate-400">No recent books found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6">
      <div className="inline-block min-w-full align-middle px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-3">
              <th className="pb-3.5">Book</th>
              <th className="pb-3.5 text-center">Indexes</th>
              <th className="pb-3.5 text-center">Duas</th>
              <th className="pb-3.5 text-center">Status</th>
              <th className="pb-3.5 text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {books.map((book) => (
              <tr key={book.id} className="group hover:bg-slate-50/50 transition-colors duration-150">
                <td className="py-3.5 pr-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 line-clamp-1">{book.nameEn}</span>
                    <span className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">{book.nameBn}</span>
                  </div>
                </td>
                <td className="py-3.5 text-center text-slate-600 font-medium">{book._count.indexes}</td>
                <td className="py-3.5 text-center text-slate-600 font-medium">{book._count.duaItems}</td>
                <td className="py-3.5 text-center">
                  <StatusBadge status={book.status} />
                </td>
                <td className="py-3.5 text-right text-xs text-slate-400 font-medium whitespace-nowrap">
                  {new Date(book.updatedAt).toLocaleDateString(undefined, {
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
