import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonAvailableCredits = () => {
  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-2 space-y-2">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-2 w-full" />
          </div>
          <Skeleton className="h-10 w-full mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SkeletonAvailableCredits;