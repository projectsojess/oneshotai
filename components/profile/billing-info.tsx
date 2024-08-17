import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Plan } from '@/types/plan';
const BillingInfo = ({plan} : {plan: Plan}) => {
  return (
    <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Manage your subscription and billing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Current Plan</p>
                  <p className="text-sm text-gray-500">{plan.plan} Plan</p>
                </div>
                <CreditCard className="text-gray-400" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" disabled={plan.plan === 'FREE'}>
                Cancel Subscription
              </Button>
            </CardFooter>
          </Card>
  )
}

export default BillingInfo
