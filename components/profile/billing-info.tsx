'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CreditCard, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Plan } from '@/types/plan';
import { formatDate } from '@/utils/date-time-formatter';
import axios from 'axios';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CancelSubscriptionSchema } from '@/schemas/validation/cancel-subscription-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useProModal } from '@/hooks/use-pro-modal';
import { useState } from 'react';

const BillingInfo = ({plan} : {plan: Plan}) => {

  const [activateLoading, setActivateLoading ] = useState(false);

  const form = useForm<z.infer<typeof CancelSubscriptionSchema>>({
    resolver: zodResolver(CancelSubscriptionSchema),
    defaultValues: {
      reason:""
    }
  })
  
  const router = useRouter();
  const proModal = useProModal();

  const isSubmitting = form.formState.isSubmitting;

  const cancelSubscription = async(values : z.infer<typeof CancelSubscriptionSchema>) => {

    try {
      const resp = await axios.post("/api/subscriptions/cancel",{
        reason: values.reason
      })
      toast.success(resp.data.message);
      router.push("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
    }
  }

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
              {plan.status === 'CANCELLED' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold">Subscription Cancelled</p>
            <p>Your plan will end on {formatDate(plan.expiry_date)}. Upgrade plan to continue using our services post date.</p>
          </div>
        )}
            </CardContent>
            <CardFooter>
         {plan.plan !=='FREE' && plan.status !=='CANCELLED' && (
          <Dialog>
          <DialogTrigger asChild>
          <Button variant="destructive" disabled={plan.plan === 'FREE'} >
            Cancel Subscription
          </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[725px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(cancelSubscription)}>
              <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                We're sorry to see you go. Please tell us why you're cancelling your subscription.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid w-full gap-1.5">
              <FormField
              name='reason'
              render={({ field }) => (
                <FormItem >
                      <FormControl>
                        <Textarea 
                          disabled={isSubmitting}
                          placeholder="Please provide your reason for cancelling..."
                          {...field}
                        />
                      </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" variant='destructive' disabled={isSubmitting}>
                Confirm Cancellation
                <AiOutlineLoading3Quarters className={cn(!isSubmitting ?  "hidden" : "block animate-spin ml-2 w-4 h-4")}/>
                </Button>
            </DialogFooter>
              </form>
            </Form>
            
          </DialogContent>
        </Dialog>
        )}

            </CardFooter>
          </Card>
  )
}

export default BillingInfo
