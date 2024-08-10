import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const MessageListSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* User message skeleton */}
      <Card className="flex justify-start">
        <CardContent className="flex items-start max-w-[80%] p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="ml-4 space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </CardContent>
      </Card>

      {/* System message skeleton */}
      <Card className="flex justify-end">
        <CardContent className="flex items-start flex-row-reverse max-w-[80%] p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="mr-4 space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageListSkeleton;