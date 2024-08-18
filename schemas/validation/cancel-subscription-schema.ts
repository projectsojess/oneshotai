import * as z from 'zod';

export const CancelSubscriptionSchema = z.object({
    reason: z.string().min(5, {
        message: "Please enter a valid reason"
    }),
});