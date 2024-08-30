import React from 'react';
import * as z from 'zod';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { NewProjectSchema } from '@/schemas/validation/new-project-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const ProjectDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof NewProjectSchema>>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const isSubmitting = form.formState.isSubmitting;
  const descriptionLength = form.watch("description").length;

  const handleSubmit = async(values: z.infer<typeof NewProjectSchema>) => {

    try {
      const resp = await axios.post("/api/projects", {
        values: values
      });
      router.push(`/projects/${resp.data.projectId}`);
    } catch (error) {
      
      toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost"> 
            <Plus className="w-8 h-8 text-primary" />
            New Project
            </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] w-full">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter project name" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                    {...field} 
                    placeholder="Provide context and instructions to models. Eg: You are a seasoned data scientist at a Fortune 500 company." 
                    disabled={isSubmitting} 
                    className=" p-6 "
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 1000);
                      field.onChange(value);
                    }}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    {descriptionLength}/1000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              Create Project
              <AiOutlineLoading3Quarters className={cn(!isSubmitting ?  "hidden" : "block animate-spin ml-2")}/>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;