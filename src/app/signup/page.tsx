
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page is now redundant as login and signup are handled on the same page.
// We will just redirect to the new login page.
export default function SignupPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/login');
    }, [router]);

    return null; // Render nothing while redirecting
}
