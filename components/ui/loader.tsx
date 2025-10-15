import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 8, columns = 5 }) {
  return (
    <div className="w-full animate-pulse">
      {/* Skeleton table header */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 border-b border-gray-200 p-2">
        {Array.from({ length: columns }).map((_, idx) => (
          <Skeleton key={idx} className="h-6 w-full rounded" />
        ))}
      </div>
      {/* Skeleton table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 border-b border-gray-100 p-2 ${
            rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
          }`}
        >
          {Array.from({ length: columns }).map((__, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}
