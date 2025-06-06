// components/SkeletonTable.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonTable() {
  return (
    <div className="space-y-4">
      {/* Search input skeleton */}
      <Skeleton className="h-10 max-w-sm rounded-md bg-secondary dark:bg-secondary" />

      {/* Table skeleton */}
      <div className="overflow-x-auto border rounded-md border-secondary dark:border-secondary">
        <table className="w-full">
          <thead className="bg-secondary dark:bg-secondary">
            <tr>
              {[...Array(5)].map((_, i) => (
                <th key={i} className="p-3">
                  <Skeleton className="h-6 w-24 rounded bg-secondary dark:bg-secondary" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-t border-secondary dark:border-secondary">
                {[...Array(5)].map((_, j) => (
                  <td key={j} className="p-3">
                    <Skeleton className="h-6 w-full rounded bg-secondary dark:bg-secondary" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
