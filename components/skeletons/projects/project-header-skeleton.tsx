import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const ProjectHeaderSkeleton = () => {
  return (
    <div className="mb-6">
      <div className="mb-2">
        <Skeleton className="h-8 w-3/4 mb-2" />
      </div>
      <div className="relative border rounded-md p-2">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default ProjectHeaderSkeleton;