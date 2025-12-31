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
import { Loader, Mail, Lock } from 'lucide-react';
import Image from 'next/image';

const signupSchema = z.object({
  email: z.string().email('कृपया एक मान्य ईमेल पता दर्ज करें।'),
  password: z.string().min(6, 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'),
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
      email: '',
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
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: 'अकाउंट बन गया', description: 'आपका सफलतापूर्वक साइन अप हो गया है! अब अपनी प्रोफ़ाइल पूरी करें।' });
      // AuthGate will handle the redirect to /complete-profile
    } catch (error) {
       if (error instanceof FirebaseError) {
          toast({ variant: 'destructive', title: 'साइन अप विफल', description: error.message });
      } else {
          toast({ variant: 'destructive', title: 'साइन अप विफल', description: 'एक अप्रत्याशित त्रुटि हुई।' });
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen w-full bg-[#f5a623] flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-48 bg-[#090e23] rounded-bl-full rounded-br-full transform -skew-y-6 -translate-y-16"></div>
        <div className="absolute top-0 left-0 w-48 h-48 bg-[#f5a623] rounded-full -translate-x-16 -translate-y-16 opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm text-center">
            <Image 
                src="https://i.supaimg.com/292dd0b1-b4e8-4bd9-b83e-2f416d3df54b.jpg"
                alt="Teach mania Logo"
                width={96}
                height={96}
                className="rounded-full border-4 border-white shadow-lg"
            />
            <h1 className="text-4xl font-bold text-[#090e23] mt-4">Teach mania</h1>
            <p className="text-[#090e23]/80 mb-8">Create a new account</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <FormControl>
                            <Input type="email" placeholder="Email" {...field} className="pl-10 h-12 bg-white text-black" />
                            </FormControl>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <FormControl>
                            <Input type="password" placeholder="Password" {...field} className="pl-10 h-12 bg-white text-black"/>
                            </FormControl>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full h-12 text-base bg-[#090e23] text-white hover:bg-[#090e23]/90" disabled={isLoading}>
                        {isLoading ? <Loader className="animate-spin" /> : 'CREATE ACCOUNT'}
                    </Button>
                </form>
            </Form>
            <p className="text-sm text-[#090e23]/80 mt-4">
                Already have an account?{" "}
                <Link href="/login" className="font-bold hover:underline">
                    Login
                </Link>
            </p>
        </div>
    </div>
  );
}
