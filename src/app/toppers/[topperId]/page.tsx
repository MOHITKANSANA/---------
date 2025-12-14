
'use client';
import { useParams } from 'next/navigation';
import { useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader, Trophy } from 'lucide-react';
import Image from 'next/image';

export default function TopperDetailsPage() {
    const { topperId } = useParams();
    const { firestore } = useFirebase();

    const topperRef = useMemoFirebase(
        () => (firestore && topperId ? doc(firestore, 'toppers', topperId as string) : null),
        [firestore, topperId]
    );

    const { data: topper, isLoading } = useDoc(topperRef);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader className="animate-spin" /></div>;
    }

    if (!topper) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Topper Not Found</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card className="text-center">
                <CardContent className="p-6">
                     <Image src={topper.imageUrl} alt={topper.name} width={128} height={128} className="mx-auto rounded-full object-cover w-32 h-32 mb-4 border-4 border-yellow-500" />
                    <CardTitle className="text-2xl">{topper.name}</CardTitle>
                    <CardDescription className="text-lg text-yellow-500 flex items-center justify-center gap-2"><Trophy className="h-5 w-5"/>{topper.achievement}</CardDescription>
                </CardContent>
            </Card>
        </div>
    )
}
