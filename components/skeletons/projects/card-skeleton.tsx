import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CardSkeleton = () => {
  return (
    <Card className="w-[200px] h-[120px]">
      <CardHeader>
        <Skeleton className="h-5 w-[140px] mb-2" />
        <Skeleton className="h-4 w-[180px]" />
      </CardHeader>
    </Card>
  );
};

export default CardSkeleton;