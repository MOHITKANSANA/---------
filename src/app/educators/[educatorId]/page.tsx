
'use client';
import { useParams } from 'next/navigation';
import { useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader, User } from 'lucide-react';
import Image from 'next/image';

export default function EducatorDetailsPage() {
    const { educatorId } = useParams();
    const { firestore } = useFirebase();

    const educatorRef = useMemoFirebase(
        () => (firestore && educatorId ? doc(firestore, 'educators', educatorId as string) : null),
        [firestore, educatorId]
    );

    const { data: educator, isLoading } = useDoc(educatorRef);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader className="animate-spin" /></div>;
    }

    if (!educator) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Educator Not Found</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card className="text-center">
                <CardContent className="p-6">
                     <Image src={educator.imageUrl} alt={educator.name} width={128} height={128} className="mx-auto rounded-full object-cover w-32 h-32 mb-4 border-4 border-primary" />
                    <CardTitle className="text-2xl">{educator.name}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">{educator.experience}</CardDescription>
                </CardContent>
            </Card>
        </div>
    )
}
