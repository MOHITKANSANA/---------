
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
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { Loader, Mail, Lock } from 'lucide-react';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email('कृपया एक मान्य ईमेल पता दर्ज करें।'),
  password: z.string().min(6, 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { auth } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!auth) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'Could not connect to authentication service.' });
        return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: 'लॉगिन सफल', description: 'आप सफलतापूर्वक लॉगिन हो गए हैं।' });
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
             toast({ variant: 'destructive', title: 'लॉगिन विफल', description: 'गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।' });
        } else {
            toast({ variant: 'destructive', title: 'लॉगिन विफल', description: error.message });
        }
      } else {
        toast({ variant: 'destructive', title: 'लॉगिन विफल', description: 'एक अप्रत्याशित त्रुटि हुई।' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'लॉगिन सफल', description: 'आप सफलतापूर्वक गूगल से लॉगिन हो गए हैं।'});
    } catch (error) {
       if (error instanceof FirebaseError) {
        toast({ variant: 'destructive', title: 'Google लॉगिन विफल', description: error.message });
      } else {
        toast({ variant: 'destructive', title: 'Google लॉगिन विफल', description: 'एक अप्रत्याशित त्रुटि हुई।' });
      }
    } finally {
      setIsGoogleLoading(false);
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
            <p className="text-[#090e23]/80 mb-8">Sign in to your account</p>

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
                    <Button type="submit" className="w-full h-12 text-base bg-[#090e23] text-white hover:bg-[#090e23]/90" disabled={isLoading || isGoogleLoading}>
                        {isLoading ? <Loader className="animate-spin" /> : 'LOGIN'}
                    </Button>
                </form>
            </Form>

            <div className="flex w-full items-center gap-4 mt-4">
                 <Button variant="outline" className="w-full h-12 text-base border-gray-300 text-[#090e23] bg-white" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
                    {isGoogleLoading ? <Loader className="animate-spin" /> : <>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.1 512 0 401.9 0 265.9 0 129.9 110.1 20 244 20c68.2 0 125 28.4 168.3 71.2l-67.7 67.7C314.1 133.5 283.6 117 244 117c-73.2 0-132.3 59.8-132.3 132.9 0 73.2 59.1 132.9 132.3 132.9 87.2 0 115.4-65.2 118.8-98.2H244v-79.6h236.6c2.5 13.1 3.4 27.4 3.4 42.8z"></path></svg>
                        Google
                    </>}
                 </Button>
                 <Button asChild variant="outline" className="w-full h-12 text-base border-gray-300 text-[#090e23] bg-white">
                    <Link href="/signup">NEW USER</Link>
                 </Button>
            </div>
            <p className="px-8 text-center text-xs text-[#090e23]/70 mt-6">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
                </Link>
                .
            </p>
        </div>
    </div>
  );
}
