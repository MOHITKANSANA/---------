
'use client';
import { useState } from 'react';
import { useCollection, useMemoFirebase, useFirebase } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Loader, PlusCircle, Trash2, Wand2 } from 'lucide-react';
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

const serviceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    iconUrl: z.string().url('A valid icon URL is required').min(1, 'Icon URL is required'),
    leftButtonText: z.string().min(1, 'Left button text is required'),
    rightButtonText: z.string().min(1, 'Right button text is required'),
    order: z.coerce.number().default(0),
});
type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function AdminOurServicesPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const servicesQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'services'), orderBy('order', 'asc')) : null), [firestore]);
    const { data: services, isLoading: servicesLoading } = useCollection(servicesQuery);

    const serviceForm = useForm<ServiceFormValues>({ 
        resolver: zodResolver(serviceSchema), 
        defaultValues: { name: '', description: '', iconUrl: '', leftButtonText: 'Other App', rightButtonText: 'Our App', order: 0 } 
    });
    
    const iconUrlValue = serviceForm.watch('iconUrl');

    const onServiceSubmit = (values: ServiceFormValues) => {
      if (!firestore) return;

      setIsSubmitting(true);
      const docRef = doc(collection(firestore, 'services'));
      const serviceData = { 
          ...values, 
          createdAt: serverTimestamp() 
      };

      setDoc(docRef, serviceData)
        .then(() => {
          toast({ title: 'Success!', description: 'New service added.'});
          serviceForm.reset();
          setIsDialogOpen(false);
        })
        .catch((error) => {
          const contextualError = new FirestorePermissionError({
            operation: 'create',
            path: docRef.path,
            requestResourceData: serviceData
          });
          errorEmitter.emit('permission-error', contextualError);
          toast({ variant: "destructive", title: "Error", description: "Failed to add service." });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    };

    const handleDeleteService = async (id: string) => {
      if (!firestore) return;

      try {
        await deleteDoc(doc(firestore, 'services', id));
        toast({ title: "Success", description: "Service has been deleted." });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete service." });
        console.error("Error deleting service:", error);
      }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Manage "Our Services"</CardTitle>
                    <CardDescription>Add or remove services displayed on the home page.</CardDescription>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Add New</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader><DialogTitle>Add New Service</DialogTitle></DialogHeader>
                        <Form {...serviceForm}>
                        <form onSubmit={serviceForm.handleSubmit(onServiceSubmit)} className="space-y-4">
                            <FormField control={serviceForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Service Name</FormLabel><FormControl><Input placeholder="e.g., Live Doubt Solving" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                             <FormField control={serviceForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the service" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={serviceForm.control} name="iconUrl" render={({ field }) => (<FormItem><FormLabel>Icon URL</FormLabel><FormControl><Input placeholder="https://example.com/icon.png" {...field} /></FormControl>
                            {iconUrlValue && <Image src={iconUrlValue} alt="Icon Preview" width={40} height={40} className="mt-2 rounded-md object-cover" />}
                            <FormMessage /></FormItem>)}/>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={serviceForm.control} name="leftButtonText" render={({ field }) => (<FormItem><FormLabel>Left Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={serviceForm.control} name="rightButtonText" render={({ field }) => (<FormItem><FormLabel>Right Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                            <FormField control={serviceForm.control} name="order" render={({ field }) => (<FormItem><FormLabel>Display Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>

                            <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : 'Add Service'}</Button>
                        </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
             <CardContent>{servicesLoading ? <div className="flex justify-center p-8"><Loader className="animate-spin"/></div> : (
             services && services.length > 0 ? (
             <div className="space-y-4">
                {services.map(service => (
                    <Card key={service.id} className="group relative">
                        <CardContent className="p-3 flex items-center gap-4">
                             <Image src={service.iconUrl} alt={service.name} width={40} height={40} className="rounded-md object-cover" />
                             <div className="flex-1">
                                <h3 className="font-semibold">{service.name}</h3>
                                <p className="text-xs text-muted-foreground">{service.description}</p>
                             </div>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="shrink-0"><Trash2 className="h-4 w-4" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently delete the "{service.name}" service.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteService(service.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                ))}
             </div>
             ) : (
                <div className="text-center text-muted-foreground p-8 border rounded-lg">
                    <Wand2 className="mx-auto h-12 w-12"/>
                    <p className="mt-4 font-semibold">No Services Added</p>
                    <p className="text-sm">Click "Add New" to add the first service.</p>
                </div>
             )
             )}</CardContent>
        </Card>
    );
}
