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
import { format } from 'date-fns';

const newsSchema = z.object({
    text: z.string().min(5, 'News text must be at least 5 characters long'),
});
type NewsFormValues = z.infer<typeof newsSchema>;

export default function AdminNewsPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const newsQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'news'), orderBy('createdAt', 'desc')) : null), [firestore]);
    const { data: news, isLoading: newsLoading } = useCollection(newsQuery);

    const newsForm = useForm<NewsFormValues>({ resolver: zodResolver(newsSchema), defaultValues: { text: '' } });

    const onNewsSubmit = (values: NewsFormValues) => {
      if (!firestore) return;

      setIsSubmitting(true);
      const docRef = doc(collection(firestore, 'news'));
      const newsData = { 
          ...values, 
          createdAt: serverTimestamp() 
      };

      setDoc(docRef, newsData)
        .then(() => {
          toast({ title: 'Success!', description: 'New news item added.'});
          newsForm.reset();
          setIsDialogOpen(false);
        })
        .catch((error) => {
          const contextualError = new FirestorePermissionError({
            operation: 'create',
            path: docRef.path,
            requestResourceData: newsData
          });
          errorEmitter.emit('permission-error', contextualError);
          toast({ variant: "destructive", title: "Error", description: "Failed to add news item." });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    };

    const handleDeleteNews = async (id: string) => {
      if (!firestore) return;

      try {
        await deleteDoc(doc(firestore, 'news', id));
        toast({ title: "Success", description: "News item has been deleted." });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete news item." });
        console.error("Error deleting news item:", error);
      }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Manage News Ticker</CardTitle>
                    <CardDescription>Add or remove scrolling news for the home page.</CardDescription>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Add New</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>Add News Item</DialogTitle></DialogHeader>
                        <Form {...newsForm}>
                        <form onSubmit={newsForm.handleSubmit(onNewsSubmit)} className="space-y-4">
                            <FormField control={newsForm.control} name="text" render={({ field }) => (<FormItem><FormLabel>News Text</FormLabel><FormControl><Input placeholder="e.g., New batch starting soon!" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : 'Add News'}</Button>
                        </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
             <CardContent>{newsLoading ? <div className="flex justify-center p-8"><Loader className="animate-spin"/></div> : (
             news && news.length > 0 ? (
             <div className="space-y-4">
                {news.map(item => (
                    <Card key={item.id} className="group relative">
                        <CardContent className="p-3 flex items-center justify-between gap-4">
                             <div className="flex-1">
                                <p className="font-medium">{item.text}</p>
                                {item.createdAt?.toDate && <p className="text-xs text-muted-foreground">{format(item.createdAt.toDate(), 'dd MMM yyyy, HH:mm')}</p>}
                             </div>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="shrink-0"><Trash2 className="h-4 w-4" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently delete this news item.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteNews(item.id)}>Delete</AlertDialogAction>
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
                    <p className="mt-4 font-semibold">No News Added</p>
                    <p className="text-sm">Click "Add New" to add the first news item.</p>
                </div>
             )
             )}</CardContent>
        </Card>
    );
}
