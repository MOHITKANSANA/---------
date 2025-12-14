
'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader, Newspaper } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CurrentAffair } from '@/lib/types';
import { format } from 'date-fns';

export default function CurrentAffairsPage() {
    const firestore = useFirestore();
    const affairsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'current_affairs'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: affairs, isLoading } = useCollection<CurrentAffair>(affairsQuery);

    return (
        <div className="container mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center">
                    <Newspaper className="mr-3 h-8 w-8" />
                    Current Affairs
                </h1>
                <p className="text-muted-foreground">
                    Stay updated with the latest news and events.
                </p>
            </div>
            
            {isLoading && (
                <div className="flex h-64 items-center justify-center">
                    <Loader className="animate-spin" />
                </div>
            )}
            
            {!isLoading && affairs && affairs.length === 0 && (
                <div className="text-center text-muted-foreground mt-16">
                    <Newspaper className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4">No current affairs articles available right now.</p>
                </div>
            )}
            
            {!isLoading && affairs && affairs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {affairs.map(affair => (
                        <Link href={affair.link} key={affair.id} target="_blank" rel="noopener noreferrer" className="block">
                            <Card className="overflow-hidden transition-shadow hover:shadow-lg group">
                                <div className="relative w-full aspect-video">
                                    <Image 
                                        src={affair.imageUrl} 
                                        alt={affair.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-base line-clamp-2 h-12 group-hover:text-primary">{affair.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <p className="text-xs text-muted-foreground">
                                        {affair.createdAt ? format(affair.createdAt.toDate(), 'MMMM d, yyyy') : ''}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
