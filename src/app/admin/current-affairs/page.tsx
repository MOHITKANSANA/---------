
'use client';
import { useState } from 'react';
import { useCollection, useMemoFirebase, useFirebase } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Loader, PlusCircle, Trash2, Newspaper } from 'lucide-react';
import Image from 'next/image';
import { errorEmitter, FirestorePermissionError } from '@/firebase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CurrentAffair } from '@/lib/types';

const affairSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    imageUrl: z.string().url('A valid image URL is required').min(1, 'Image URL is required'),
    link: z.string().url('A valid URL for the article/video is required').min(1, 'Link is required'),
});
type AffairFormValues = z.infer<typeof affairSchema>;

export default function AdminCurrentAffairsPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const affairsQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'current_affairs'), orderBy('createdAt', 'desc')) : null), [firestore]);
    const { data: affairs, isLoading: affairsLoading } = useCollection<CurrentAffair>(affairsQuery);

    const affairForm = useForm<AffairFormValues>({ resolver: zodResolver(affairSchema), defaultValues: { title: '', imageUrl: '', link: '' } });

    const onAffairSubmit = (values: AffairFormValues) => {
      if (!firestore) return;

      setIsSubmitting(true);
      const docRef = doc(collection(firestore, 'current_affairs'));
      const affairData = { 
          ...values, 
          createdAt: serverTimestamp() 
      };

      setDoc(docRef, affairData)
        .then(() => {
          toast({ title: 'Success!', description: 'New current affair added.'});
          affairForm.reset();
          setIsDialogOpen(false);
        })
        .catch((error) => {
          const contextualError = new FirestorePermissionError({
            operation: 'create',
            path: docRef.path,
            requestResourceData: affairData
          });
          errorEmitter.emit('permission-error', contextualError);
          toast({ variant: "destructive", title: "Error", description: "Failed to add current affair." });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    };

    const handleDeleteAffair = async (id: string) => {
      if (!firestore) return;

      try {
        await deleteDoc(doc(firestore, 'current_affairs', id));
        toast({ title: "Success", description: "Current affair has been deleted." });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete current affair." });
        console.error("Error deleting current affair:", error);
      }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Manage Current Affairs</CardTitle>
                    <CardDescription>Add or remove current affairs links.</CardDescription>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Add New</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>Add New Current Affair</DialogTitle></DialogHeader>
                        <Form {...affairForm}>
                        <form onSubmit={affairForm.handleSubmit(onAffairSubmit)} className="space-y-4">
                            <FormField control={affairForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Latest Space Mission" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={affairForm.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={affairForm.control} name="link" render={({ field }) => (<FormItem><FormLabel>Article/Video Link</FormLabel><FormControl><Input placeholder="https://news-site.com/article" {...field} /></FormControl><FormMessage /></FormItem>)}/>

                            <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : 'Add Current Affair'}</Button>
                        </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
             <CardContent>{affairsLoading ? <div className="flex justify-center p-8"><Loader className="animate-spin"/></div> : (
             affairs && affairs.length > 0 ? (
             <div className="space-y-4">
                {affairs.map(affair => (
                    <Card key={affair.id} className="group relative">
                        <CardContent className="p-3 flex items-center gap-4">
                             <Image src={affair.imageUrl} alt={affair.title} width={100} height={60} className="rounded-md object-cover aspect-video" />
                             <div className="flex-1">
                                <h3 className="font-semibold">{affair.title}</h3>
                                <a href={affair.link} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:underline truncate">{affair.link}</a>
                             </div>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="shrink-0"><Trash2 className="h-4 w-4" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently delete "{affair.title}".</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteAffair(affair.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                ))}
             </div>
             ) : (
                <div className="text-center text-muted-foreground p-8 border rounded-lg">
                    <Newspaper className="mx-auto h-12 w-12"/>
                    <p className="mt-4 font-semibold">No Current Affairs Added</p>
                    <p className="text-sm">Click "Add New" to add the first item.</p>
                </div>
             )
             )}</CardContent>
        </Card>
    );
}
