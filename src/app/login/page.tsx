
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { Loader } from 'lucide-react';
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
      // Try to sign in first
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: 'लॉगिन सफल', description: 'आप सफलतापूर्वक लॉगिन हो गए हैं।' });
      // AuthGate will redirect
    } catch (error) {
      if (error instanceof FirebaseError && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
        // If user not found, try to create a new account
        try {
          await createUserWithEmailAndPassword(auth, data.email, data.password);
          toast({ title: 'अकाउंट बन गया', description: 'आपका सफलतापूर्वक साइन अप हो गया है! अब अपनी प्रोफ़ाइल पूरी करें।' });
          // AuthGate will redirect to /complete-profile
        } catch (signupError) {
          if (signupError instanceof FirebaseError) {
              toast({ variant: 'destructive', title: 'साइन अप विफल', description: signupError.message });
          } else {
              toast({ variant: 'destructive', title: 'साइन अप विफल', description: 'एक अप्रत्याशित त्रुटि हुई।' });
          }
        }
      } else if (error instanceof FirebaseError) {
        toast({ variant: 'destructive', title: 'लॉगिन विफल', description: error.message });
      } else {
        toast({ variant: 'destructive', title: 'लॉगिन विफल', description: 'एक अप्रत्याशित त्रुटि हुई।' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'लॉगिन सफल', description: 'आप सफलतापूर्वक लॉगिन हो गए हैं।'});
    } catch (error) {
       if (error instanceof FirebaseError) {
        toast({ variant: 'destructive', title: 'Google लॉगिन विफल', description: error.message });
      } else {
        toast({ variant: 'destructive', title: 'Google लॉगिन विफल', description: 'एक अप्रत्याशित त्रुटि हुई।' });
      }
    }
  };


  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
       <div className="text-center mb-8 flex flex-col items-center gap-4">
         <Image src="https://i.supaimg.com/292dd0b1-b4e8-4bd9-b83e-2f416d3df54b.jpg" alt="Teach mania Logo" width={80} height={80} />
         <h1 className="text-3xl font-bold tracking-tight">Welcome to Teach mania</h1>
       </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login or Signup</CardTitle>
          <CardDescription>
            Enter your details to login, or we'll create an account for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ईमेल</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>पासवर्ड</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Loader className="mr-2 h-4 w-4 animate-spin"/>Please wait...</> : 'Continue with Email'}
              </Button>
            </form>
          </Form>
          <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.1 512 0 401.9 0 265.9 0 129.9 110.1 20 244 20c68.2 0 125 28.4 168.3 71.2l-67.7 67.7C314.1 133.5 283.6 117 244 117c-73.2 0-132.3 59.8-132.3 132.9 0 73.2 59.1 132.9 132.3 132.9 87.2 0 115.4-65.2 118.8-98.2H244v-79.6h236.6c2.5 13.1 3.4 27.4 3.4 42.8z"></path></svg>
             Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
