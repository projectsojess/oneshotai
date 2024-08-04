import * as z from 'zod';

/**
 * Please remove line no from 8 to 12 if you dont want strong password validation
 */
export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string()
})
.refine( (data) => {

    if(data.password !== data.confirmPassword){
        return false;
    }
    return true;
}, {message:"Password and confirm password should be same.",path: ['confirmPassword']});
