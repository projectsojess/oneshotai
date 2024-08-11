import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PinnedItemsSkeleton = ({ count = 3 }) => {
    return (
      <>
        {Array(count).fill(0).map((_, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="p-4 flex items-start">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="ml-3 flex-grow">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    );
  };