import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<string, string> = {
  frontend: "bg-info/10 text-info border-info/40",
  backend: "bg-success/10 text-success border-success/40",
  fullstack: "bg-primary/10 text-primary border-primary/40",
  mobile: "bg-warning/10 text-warning border-warning/40",
};

export function ProjectTypeBadge({ type, className }: { type: string; className?: string }) {
  const style = TYPE_STYLES[type] ?? "bg-surface text-muted-foreground border-border";
  return (
    <span
      className={cn(
        "inline-flex items-center border-2 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] shadow-[2px_2px_0px_0px_currentColor]",
        style,
        className,
      )}
    >
      {type}
    </span>
  );
}
