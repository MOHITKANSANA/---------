
'use client';
import { useState, useEffect } from 'react';
import { useCollection, useDoc, useMemoFirebase, useFirebase } from '@/firebase';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader, Home } from 'lucide-react';
import Image from 'next/image';

const featureCardsConfig = [
    { id: 'all_courses', title: 'All Courses' },
    { id: 'live_class', title: 'Live Class' },
    { id: 'notes', title: 'Notes' },
    { id: 'my_paid_courses', title: 'My Paid Courses' },
    { id: 'social_links', title: 'Social Links' },
    { id: 'test', title: 'Test' },
    { id: 'free_videos', title: 'Free Videos' },
    { id: 'free_test', title: 'Free Test' },
    { id: 'free_notes', title: 'Free Notes' },
];

export default function AdminHomeScreenPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'homeScreen') : null, [firestore]);
    const { data: homeScreenSettings, isLoading: settingsLoading } = useDoc(settingsRef);

    const [iconUrls, setIconUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        if (homeScreenSettings?.featureIcons) {
            setIconUrls(homeScreenSettings.featureIcons);
        }
    }, [homeScreenSettings]);

    const handleUrlChange = (id: string, url: string) => {
        setIconUrls(prev => ({ ...prev, [id]: url }));
    };

    const handleSaveChanges = async () => {
        if (!firestore || !settingsRef) return;
        setIsLoading(true);
        try {
            await setDoc(settingsRef, { featureIcons: iconUrls }, { merge: true });
            toast({ title: 'Success!', description: 'Home screen icons have been updated.' });
        } catch (error) {
            console.error("Error updating home screen settings:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save changes.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Home className="mr-2"/>Home Screen Management</CardTitle>
                <CardDescription>Customize the icons for the feature grid on the home screen.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {featureCardsConfig.map(card => (
                        <div key={card.id} className="space-y-2 border p-4 rounded-lg">
                            <Label htmlFor={card.id} className="font-semibold">{card.title}</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id={card.id}
                                    placeholder="Paste image URL here"
                                    value={iconUrls[card.id] || ''}
                                    onChange={(e) => handleUrlChange(card.id, e.target.value)}
                                />
                                {iconUrls[card.id] && (
                                    <Image src={iconUrls[card.id]!} alt={`${card.title} icon`} width={40} height={40} className="rounded-md object-cover" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <Button onClick={handleSaveChanges} disabled={isLoading || settingsLoading}>
                    {isLoading ? <Loader className="animate-spin mr-2"/> : null}
                    Save Changes
                </Button>
            </CardContent>
        </Card>
    );
}
