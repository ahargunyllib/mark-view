import { Skeleton } from "@/components/ui/skeleton";

export function FileListSkeleton() {
  return (
    <div className="space-y-4 pr-4">
      {[1, 2, 3].map((group) => (
        <div className="space-y-2" key={group}>
          <Skeleton className="h-4 w-24" />
          <div className="space-y-1">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton className="h-8 w-full" key={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="space-y-2 pt-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="pt-4">
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export function TOCSkeleton() {
  return (
    <div className="space-y-2 pr-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="ml-2 h-4 w-5/6" />
      <Skeleton className="ml-4 h-4 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="ml-2 h-4 w-3/4" />
      <Skeleton className="ml-2 h-4 w-2/3" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
