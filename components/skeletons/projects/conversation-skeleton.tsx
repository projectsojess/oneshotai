import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ChevronRight } from 'lucide-react';

const ConversationCardSkeleton = () => (
  <Card className="mb-4 hover:shadow-md transition-all duration-200 cursor-pointer">
    <CardHeader>
      <CardTitle>
        <Skeleton className="h-6 w-3/4" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
    <CardFooter className="flex justify-between items-center text-xs text-gray-400">
      <span className="flex items-center">
        <Calendar className="w-4 h-4 mr-1" />
        <Skeleton className="h-3 w-20" />
      </span>
      <ChevronRight className="w-4 h-4" />
    </CardFooter>
  </Card>
);

export default ConversationCardSkeleton;