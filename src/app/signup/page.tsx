
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { Loader, Mail, Lock, User, Phone, MapPin, Building } from 'lucide-react';
import Image from 'next/image';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  mobile: z.string().length(10, 'Mobile number must be 10 digits'),
  email: z.string().email('Please enter a valid email address.'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { auth } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      mobile: '',
      email: '',
      state: '',
      city: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    if (!auth) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'Could not connect to authentication service.' });
        return;
    }
    setIsLoading(true);
    try {
      // We are creating the user here, but the profile completion will happen on the next page
      // We pass the form data via state or query params if needed, or just let the user re-enter on complete-profile
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      toast({ title: 'Account Created', description: 'You have been successfully signed up! Now complete your profile.' });
      
      // AuthGate will detect the user and the incomplete profile and redirect to /complete-profile
      // We pass the data to pre-fill the complete-profile page
      const query = new URLSearchParams({
        name: data.name,
        mobile: data.mobile,
        state: data.state,
        city: data.city,
      }).toString();
      
      // router.push(`/complete-profile?${query}`);

    } catch (error) {
       if (error instanceof FirebaseError) {
          if(error.code === 'auth/email-already-in-use') {
            toast({ variant: 'destructive', title: 'Signup Failed', description: 'This email is already in use. Please login instead.' });
          } else {
            toast({ variant: 'destructive', title: 'Signup Failed', description: error.message });
          }
      } else {
          toast({ variant: 'destructive', title: 'Signup Failed', description: 'An unexpected error occurred.' });
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen w-full bg-[#f5a623] flex flex-col items-center">
        <header className="w-full bg-blue-600 text-white text-center py-3 text-xl font-semibold shadow-md">
            Register
        </header>

        <div className="flex-1 flex flex-col items-center justify-start w-full max-w-sm text-center p-4">
            <Image 
                src="https://i.supaimg.com/292dd0b1-b4e8-4bd9-b83e-2f416d3df54b.jpg"
                alt="Teach mania Logo"
                width={120}
                height={120}
                className="rounded-full border-4 border-white shadow-lg mt-6"
            />
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 mt-8">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormControl><Input placeholder="Name" {...field} className="h-12 bg-white text-black" /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="mobile" render={({ field }) => (
                        <FormItem><FormControl><Input type="tel" placeholder="Mobile Number" {...field} className="h-12 bg-white text-black" /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormControl><Input type="email" placeholder="Email" {...field} className="h-12 bg-white text-black" /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem><FormControl><Input placeholder="State" {...field} className="h-12 bg-white text-black" /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormControl><Input placeholder="City" {...field} className="h-12 bg-white text-black" /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem><FormControl><Input type="password" placeholder="Password" {...field} className="h-12 bg-white text-black"/></FormControl><FormMessage /></FormItem>
                    )}/>

                    <Button type="submit" className="w-full h-12 text-base bg-[#090e23] text-white hover:bg-[#090e23]/90" disabled={isLoading}>
                        {isLoading ? <Loader className="animate-spin" /> : 'REGISTER'}
                    </Button>
                </form>
            </Form>

             <p className="text-sm text-[#090e23]/80 mt-6">
                Already have an account?{" "}
                <Link href="/login" className="font-bold hover:underline text-blue-800">
                    Login here
                </Link>
            </p>
        </div>
    </div>
  );
}

