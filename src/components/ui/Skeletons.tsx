import { Card } from "./Card";
import { Skeleton } from "./Skeleton";

export const CardSkeleton = () => (
  <Card className="space-y-4">
    <Skeleton className="h-6 w-1/3" />
    <Skeleton className="h-7 w-3/4" />
    <Skeleton className="h-16 w-full" />
    <Skeleton className="h-4 w-1/2" />
  </Card>
);

export const PostSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-[16/10] w-full" />
    <Skeleton className="h-5 w-1/3" />
    <Skeleton className="h-7 w-full" />
    <Skeleton className="h-4 w-4/5" />
  </div>
);
