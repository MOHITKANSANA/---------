'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function OurTeamPage() {
    const firestore = useFirestore();
    const teamQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'team'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: team, isLoading } = useCollection(teamQuery);

    return (
        <div className="container mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center">
                    <Users className="mr-3 h-8 w-8" />
                    Our Team
                </h1>
                <p className="text-muted-foreground">
                    Meet the dedicated professionals behind Teach Mania.
                </p>
            </div>
            
            {isLoading && (
                <div className="flex h-64 items-center justify-center">
                    <Loader className="animate-spin" />
                </div>
            )}
            
            {!isLoading && team && team.length === 0 && (
                <div className="text-center text-muted-foreground mt-16">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4">Our team information is not available right now.</p>
                </div>
            )}
            
            {!isLoading && team && team.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.map(member => (
                        <Card key={member.id} className="overflow-hidden transition-shadow hover:shadow-lg group">
                            <div className="relative w-full aspect-square">
                                <Image 
                                    src={member.imageUrl} 
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg">{member.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <p className="text-base text-muted-foreground">{member.role}</p>
                                 {member.description && <p className="text-sm mt-2">{member.description}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
