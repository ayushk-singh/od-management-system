// components/ui/expandable-cell.tsx

"use client";

import { useState } from "react";

interface ExpandableCellProps {
  text: string;
  limit?: number;
}

export function ExpandableCell({ text, limit = 50 }: ExpandableCellProps) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return <em>-</em>;

  return (
    <div className="max-w-[200px]">
      <div className={expanded ? "whitespace-normal text-sm" : "truncate text-sm"}>
        {text}
      </div>
      {text.length > limit && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-500 hover:text-blue-700 mt-1 font-medium"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
