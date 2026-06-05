import { forwardRef } from "react";

interface CategorySelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  categories: {
    id: string;
    nameEn: string;
    nameBn: string;
    color?: string | null;
  }[];
  error?: string;
  label?: string;
}

export const CategorySelect = forwardRef<HTMLSelectElement, CategorySelectProps>(
  ({ categories, error, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-bold text-slate-500">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 w-full"
          {...props}
        >
          <option value="">-- Select a Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nameEn} ({cat.nameBn})
            </option>
          ))}
        </select>
        {error && (
          <span className="text-[10px] text-red-500 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

CategorySelect.displayName = "CategorySelect";
