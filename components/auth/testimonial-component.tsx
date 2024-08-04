import React from 'react';
import { Zap } from 'lucide-react';
import { appData } from '@/constants/app-data';

const TestimonialComponent = () => {
  return (
    <div className=" h-screen bg-foreground text-background flex items-center justify-center p-6 lg:p-12">
      <div className="max-w-3xl text-center">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Zap className="w-12 h-12" />
          <h2 className="text-4xl font-bold">{appData.appName}</h2>
        </div>
        
        <blockquote className="text-2xl lg:text-3xl font-light mb-8">
          "This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before."
        </blockquote>
        
      </div>
    </div>
  );
};

export default TestimonialComponent;