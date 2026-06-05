import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-8 pb-5 border-b border-slate-100">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#022c22]">{title}</h2>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 mt-4 md:mt-0">{actions}</div>}
    </div>
  );
}
