import { Skeleton } from "../ui/skeleton";

export const AllChatsSkeleton = () => (
    <div className="mb-4">
        <div className="flex items-center mb-2">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-2 ml-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-24" />
                </div>
            ))}
        </div>
        <div className="flex items-center mb-2 mt-4">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-2 ml-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-24" />
                </div>
            ))}
        </div>
    </div>
);