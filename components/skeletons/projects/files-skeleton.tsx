import { Skeleton } from "@/components/ui/skeleton";
export const FileAttachmentSkeleton = ({ count = 3 }) => {
    return (
       <>
        {Array(count).fill(0).map((_, index) => (
            <div className="mb-4 p-4 rounded-lg border border-indigo-200 flex items-center shadow-sm hover:shadow-md transition-shadow duration-200">
            <Skeleton className="w-16 h-16 rounded" />
            <div className="flex-grow ml-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
       </>
    );
  };