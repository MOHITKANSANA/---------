'use client';

import { useCollection, useMemoFirebase, useFirebase } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, Bell, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const { firestore } = useFirebase();
  const router = useRouter();

  const notificationsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'notifications'), orderBy('createdAt', 'desc'))
        : null,
    [firestore]
  );
  const { data: notifications, isLoading } = useCollection(notificationsQuery);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
        <div className="mb-4 flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
            </Button>
            <div className="flex-1">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className="text-sm text-muted-foreground">Latest updates and announcements</p>
            </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader className="animate-spin" />
          </div>
        ) : notifications && notifications.length > 0 ? (
            <div className="space-y-4">
                {notifications.map(notif => (
                    <Card key={notif.id}>
                        <CardContent className="p-4 flex items-start gap-4">
                            {notif.imageUrl && (
                                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                     <Image src={notif.imageUrl} alt={notif.title} fill className="object-cover" />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-bold">{notif.title}</p>
                                <p className="text-sm text-muted-foreground">{notif.body}</p>
                                {notif.createdAt && (
                                     <p className="text-xs text-muted-foreground mt-2">{format(notif.createdAt.toDate(), 'dd MMM yyyy, HH:mm')}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : (
             <div className="text-center text-muted-foreground p-8 border rounded-lg mt-8">
                <Bell className="mx-auto h-12 w-12" />
                <p className="mt-4 font-semibold">No notifications yet</p>
                <p className="text-sm">Check back later for new updates.</p>
            </div>
        )}
    </div>
  );
}
