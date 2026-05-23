import * as React from "react";

import { cn } from "@/lib/utils";

type FeedCardProps = {
  /** Anchor id used by the menu overlay to scroll to this card. */
  id?: string;
  /** Small teal eyebrow label, rendered in caps. */
  label: string;
  /** Optional headline. Accepts a node so callers can embed adornments (e.g. a live dot). */
  title?: React.ReactNode;
  /** Override the default headline size/weight (Card 1 uses a larger size). */
  titleClassName?: string;
  /** Optional muted supporting copy. */
  description?: React.ReactNode;
  /** Extra content rendered below the copy (forms, links, etc.). */
  children?: React.ReactNode;
  className?: string;
};

export default function FeedCard({
  id,
  label,
  title,
  titleClassName,
  description,
  children,
  className,
}: FeedCardProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 rounded-lg border border-[#1E3A5F] bg-[#0D1B3E] p-5 transition-colors",
        "hover:border-[#2B4F7E] hover:bg-[#10224C]",
        className
      )}
    >
      <p className="text-xs font-semibold tracking-widest text-[#00C9A7] uppercase">
        {label}
      </p>

      {title ? (
        <h3
          className={cn(
            "mt-3 text-lg leading-snug font-bold text-white",
            titleClassName
          )}
        >
          {title}
        </h3>
      ) : null}

      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {description}
        </p>
      ) : null}

      {children}
    </section>
  );
}
