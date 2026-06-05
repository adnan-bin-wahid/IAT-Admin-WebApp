import * as Icons from "lucide-react";

interface DynamicIconProps {
  name?: string;
  className?: string;
}

export function DynamicIcon({ name, className }: DynamicIconProps) {
  if (!name) return null;
  
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!IconComponent) {
    // Return standard fallback
    return <Icons.HelpCircle className={className} />;
  }
  
  return <IconComponent className={className} />;
}
