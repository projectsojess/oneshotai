'use client'
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, CreditCard, LogOut, Settings, User } from 'lucide-react';

const ProfilePage = () => {
  const [email, setEmail] = useState('johndoe@example.com');
  const [isSubscribed, setIsSubscribed] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/api/placeholder/150/150" alt="Profile" />
                  <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button className="bg-gray-900 text-white hover:bg-gray-800">
                Update Email
              </Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Reset Password
              </Button>
            </CardContent>
          </Card>

          {/* Billing */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Manage your subscription and billing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Current Plan</p>
                  <p className="text-sm text-gray-500">Pro Plan</p>
                </div>
                <CreditCard className="text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="subscription"
                  checked={isSubscribed}
                  onCheckedChange={setIsSubscribed}
                />
                <Label htmlFor="subscription">Active Subscription</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" disabled={!isSubscribed}>
                Cancel Subscription
              </Button>
            </CardFooter>
          </Card>

          {/* Notifications */}
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

          {/* Account Actions */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Settings className="mr-2 h-4 w-4" /> 
                </Button>
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;