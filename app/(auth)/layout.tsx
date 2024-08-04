import TestimonialComponent from "@/components/auth/testimonial-component";

const AuthLayout = ({ 
    children
 } : {
    children: React.ReactNode
}) => {
    return (
        <div className="h-screen flex items-center justify-center">
        <div className="w-full md:w-[40%] p-4 md:p-8 lg:p-12 flex items-center justify-center">
            {children}
        </div>
        <div className="hidden md:block md:w-[60%]">
    <TestimonialComponent />
  </div>
    </div>
    );
}

export default AuthLayout;