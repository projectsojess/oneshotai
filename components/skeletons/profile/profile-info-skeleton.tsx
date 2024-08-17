'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
const ProfileInfoSkeleton = () => {
    const [mounted,setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        return () => setMounted(false)
    },[]);

    if(!mounted){
        return null;
    }
  return (
    <Card className="lg:col-span-2 overflow-hidden border-gray-800">
    <CardHeader className="bg-gray-900 text-gray-100">
      <CardTitle className="text-2xl font-bold"><Skeleton className="h-8 w-3/4 bg-gray-700" /></CardTitle>
      <CardDescription><Skeleton className="h-4 w-1/2 bg-gray-700" /></CardDescription>
    </CardHeader>
    <CardContent className="p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-300" />
          <div>
            <Skeleton className="h-4 w-24 mb-2 bg-gray-300" />
            <Skeleton className="h-6 w-32 bg-gray-300" />
          </div>
        </div>
        <Skeleton className="h-4 w-40 bg-gray-300" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <ResourceCardSkeleton key={i} />
        ))}
      </div>
    </CardContent>
  </Card>
  )
}

function ResourceCardSkeleton() {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between border border-gray-200">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
          <div>
            <Skeleton className="h-4 w-24 mb-2 bg-gray-200" />
            <Skeleton className="h-6 w-32 bg-gray-200" />
          </div>
        </div>
        <Skeleton className="h-9 w-28 bg-gray-200" />
      </div>
    );
  }
export default ProfileInfoSkeleton
