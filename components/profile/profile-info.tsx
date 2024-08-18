'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User as UserIcon, CreditCard, HardDrive, PlusCircle } from 'lucide-react';
import { Plan } from '@/types/plan';
import { Badge } from '../ui/badge';
import { User } from '@supabase/supabase-js';
import PurchaseCreditsDialog from './purchase-credits-dialog';
interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  showButton: boolean;
  onClick?: () => void;  // Made optional
  plan?: string;
  userId?: string  // Made optional
}

const  ProfileInfoComponent = ({plan, user} : {plan: Plan, user: User}) => {
    

  return (
        <Card className="lg:col-span-2 overflow-hidden border-gray-800">
      <CardHeader className="bg-gray-900 text-gray-100">
        <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
        <CardDescription className="text-gray-400">Manage your profile details and resources</CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-gray-50">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
          <Avatar className="h-24 w-24 ring-4 ring-gray-300 ring-offset-2">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
            <AvatarFallback><UserIcon className="h-12 w-12 text-gray-600" /></AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-semibold text-gray-900">{user?.user_metadata?.username}</h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
            {plan.plan === 'FREE' && (
                <div className="mt-2 inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
                {plan?.plan} Plan
              </div>
            )}
            {plan.plan !=='FREE' && (
                <Badge variant='premium'>
                    {plan.plan} Plan
                </Badge>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResourceCard
            plan={plan.plan} 
            icon={<CreditCard className="h-6 w-6 text-gray-700" />}
            title="Available Credits"
            value={plan.available_credits}
            showButton={true}
            userId={user.id}
          />
          <ResourceCard 
            plan={plan.plan} 
            icon={<HardDrive className="h-6 w-6 text-gray-700" />}
            title="Available Storage"
            value={plan.available_storage}
            showButton={false}
          />
        </div>
      </CardContent>
    </Card>
  )
}

const ResourceCard: React.FC<ResourceCardProps> = ({ icon, title, value, showButton, plan,userId }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-start justify-between border border-gray-200">
      <div className="flex items-center space-x-4 w-full">
        <div className="bg-white p-3 rounded-full shadow-sm">{icon}</div>
        <div className="flex-grow">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
        {showButton && (
          <PurchaseCreditsDialog plan={plan} userId={userId} />
        )}
      </div>
    </div>
  );
}

export default ProfileInfoComponent