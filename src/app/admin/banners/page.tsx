
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
import { Loader, PlusCircle, Trash2, ImageIcon } from 'lucide-react';
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

const bannerSchema = z.object({
    imageUrl: z.string().url('A valid image URL is required').min(1, 'Image URL is required'),
    alt: z.string().min(1, 'Alt text is required'),
    link: z.string().url('A valid URL is required').optional().or(z.literal('')),
});
type BannerFormValues = z.infer<typeof bannerSchema>;

export default function AdminBannersPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const bannersQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'banners'), orderBy('createdAt', 'desc')) : null), [firestore]);
    const { data: banners, isLoading: bannersLoading } = useCollection(bannersQuery);

    const bannerForm = useForm<BannerFormValues>({ resolver: zodResolver(bannerSchema), defaultValues: { imageUrl: '', alt: '', link: '' } });
    
    const imageUrlValue = bannerForm.watch('imageUrl');

    const onBannerSubmit = (values: BannerFormValues) => {
      if (!firestore) return;

      setIsSubmitting(true);
      const docRef = doc(collection(firestore, 'banners'));
      const bannerData = { 
          ...values, 
          createdAt: serverTimestamp() 
      };

      setDoc(docRef, bannerData)
        .then(() => {
          toast({ title: 'Success!', description: 'New banner added.'});
          bannerForm.reset();
          setIsDialogOpen(false);
        })
        .catch((error) => {
          const contextualError = new FirestorePermissionError({
            operation: 'create',
            path: docRef.path,
            requestResourceData: bannerData
          });
          errorEmitter.emit('permission-error', contextualError);
          toast({ variant: "destructive", title: "Error", description: "Failed to add banner." });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    };

    const handleDeleteBanner = async (id: string) => {
      if (!firestore) return;

      try {
        await deleteDoc(doc(firestore, 'banners', id));
        toast({ title: "Success", description: "Banner has been deleted." });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete banner." });
        console.error("Error deleting banner:", error);
      }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Manage Banners</CardTitle>
                    <CardDescription>Add or remove promotional banners for the home page slider.</CardDescription>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Add New</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>Add New Banner</DialogTitle></DialogHeader>
                        <Form {...bannerForm}>
                        <form onSubmit={bannerForm.handleSubmit(onBannerSubmit)} className="space-y-4">
                            <FormField control={bannerForm.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://example.com/banner.jpg" {...field} /></FormControl>
                            {imageUrlValue && <Image src={imageUrlValue} alt="Banner Preview" width={200} height={100} className="mt-2 rounded-md object-contain mx-auto" />}
                            <FormMessage /></FormItem>)}/>
                            <FormField control={bannerForm.control} name="alt" render={({ field }) => (<FormItem><FormLabel>Alt Text</FormLabel><FormControl><Input placeholder="Description of the banner" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={bannerForm.control} name="link" render={({ field }) => (<FormItem><FormLabel>Link URL (Optional)</FormLabel><FormControl><Input placeholder="https://app.com/target-page" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : 'Add Banner'}</Button>
                        </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
             <CardContent>{bannersLoading ? <div className="flex justify-center p-8"><Loader className="animate-spin"/></div> : (
             banners && banners.length > 0 ? (
             <div className="space-y-4">
                {banners.map(banner => (
                    <Card key={banner.id} className="group relative">
                        <CardContent className="p-3 flex items-center gap-4">
                             <Image src={banner.imageUrl} alt={banner.alt} width={150} height={75} className="rounded-md object-cover aspect-video" />
                             <div className="flex-1">
                                <h3 className="font-semibold">{banner.alt}</h3>
                                {banner.link && <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:underline truncate">{banner.link}</a>}
                             </div>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="shrink-0"><Trash2 className="h-4 w-4" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently delete this banner.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteBanner(banner.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                ))}
             </div>
             ) : (
                <div className="text-center text-muted-foreground p-8 border rounded-lg">
                    <ImageIcon className="mx-auto h-12 w-12"/>
                    <p className="mt-4 font-semibold">No Banners Added</p>
                    <p className="text-sm">Click "Add New" to add the first banner.</p>
                </div>
             )
             )}</CardContent>
        </Card>
    );
}
