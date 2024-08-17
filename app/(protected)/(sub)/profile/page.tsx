'use client'
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, CreditCard, LogOut, Settings} from 'lucide-react';
import ProfileInfoComponent from '@/components/profile/profile-info';
import { getUserClient, getUserPlanClient } from '@/hooks/use-user';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { Plan } from '@/types/plan';
import toast from 'react-hot-toast';
import ProfileInfoSkeleton from '@/components/skeletons/profile/profile-info-skeleton';
import BillingInfo from '@/components/profile/billing-info';

const ProfilePage = () => {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [plan, setPlan ] = useState<Plan | null>(null);
  const [loading, setLoading ] = useState(true);
  const [user,setUser] = useState(null);

  useEffect(() => {
    const getProfileInfo = async() => {

       try {
        const userData = await getUserClient();
        setUser(userData);
        
        const planData = await getUserPlanClient();
        setPlan(planData);
        setLoading(false);
       } catch (error) {
            toast.error(INTERNAL_SERVER_ERROR_MESSAGE)
       }
    }
    getProfileInfo();

},[])


  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {!loading && (<ProfileInfoComponent plan={plan} user={user}/>)}
          {loading && <ProfileInfoSkeleton />}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="email-notifications" />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="marketing-emails" />
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
              </div>
            </CardContent>
          </Card>

          {/* Billing */}
          <BillingInfo plan={plan} />

          {/* Account Actions */}
          {/* <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button variant="outline" className="w-full flex items-center justify-center text-red-600 hover:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" /> Log Out
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500 flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" /> For account deletion, please contact support
              </p>
            </CardFooter>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;