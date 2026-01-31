import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { DealTag } from "./types";

interface TagBadgeProps {
  tag: DealTag;
  size?: "sm" | "md";
  showTooltip?: boolean;
  onRemove?: () => void;
}

export function TagBadge({ tag, size = "sm", showTooltip = true, onRemove }: TagBadgeProps) {
  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium border cursor-default",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
      )}
      style={{
        backgroundColor: `${tag.color}15`,
        borderColor: `${tag.color}40`,
        color: tag.color,
      }}
    >
      <span
        className={cn("rounded-full", size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2")}
        style={{ backgroundColor: tag.color }}
      />
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:opacity-70"
        >
          ×
        </button>
      )}
    </span>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>{badge}</HoverCardTrigger>
      <HoverCardContent 
        side="top" 
        className="w-auto max-w-[220px] p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: tag.color }}
            />
            <p className="text-sm font-medium">{tag.name}</p>
          </div>
          {tag.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tag.description}
            </p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
