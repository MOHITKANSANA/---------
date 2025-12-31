
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
import { Loader, PlusCircle, Trash2, Users } from 'lucide-react';
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

const teamMemberSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
    imageUrl: z.string().url('A valid image URL is required').min(1, 'Image URL is required'),
    description: z.string().optional(),
});
type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

export default function AdminOurTeamPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const teamQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'team'), orderBy('createdAt', 'asc')) : null), [firestore]);
    const { data: team, isLoading: teamLoading } = useCollection(teamQuery);

    const teamForm = useForm<TeamMemberFormValues>({ 
        resolver: zodResolver(teamMemberSchema), 
        defaultValues: { name: '', role: '', imageUrl: '', description: '' } 
    });

    const onMemberSubmit = (values: TeamMemberFormValues) => {
      if (!firestore) return;

      setIsSubmitting(true);
      const docRef = doc(collection(firestore, 'team'));
      const memberData = { 
          ...values, 
          createdAt: serverTimestamp() 
      };

      setDoc(docRef, memberData)
        .then(() => {
          toast({ title: 'Success!', description: 'New team member added.'});
          teamForm.reset();
          setIsDialogOpen(false);
        })
        .catch((error) => {
          const contextualError = new FirestorePermissionError({
            operation: 'create',
            path: docRef.path,
            requestResourceData: memberData
          });
          errorEmitter.emit('permission-error', contextualError);
          toast({ variant: "destructive", title: "Error", description: "Failed to add team member." });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    };

    const handleDeleteMember = async (id: string) => {
      if (!firestore) return;
      try {
        await deleteDoc(doc(firestore, 'team', id));
        toast({ title: "Success", description: "Team member has been deleted." });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete team member." });
        console.error("Error deleting team member:", error);
      }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Manage "Our Team"</CardTitle>
                    <CardDescription>Add or remove members from the "Our Team" section on the home page.</CardDescription>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Add New Member</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader><DialogTitle>Add New Team Member</DialogTitle></DialogHeader>
                        <Form {...teamForm}>
                        <form onSubmit={teamForm.handleSubmit(onMemberSubmit)} className="space-y-4">
                            <FormField control={teamForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={teamForm.control} name="role" render={({ field }) => (<FormItem><FormLabel>Role / Designation</FormLabel><FormControl><Input placeholder="e.g., Lead Developer" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={teamForm.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://example.com/photo.jpg" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={teamForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Short Bio (Optional)</FormLabel><FormControl><Textarea placeholder="A short bio about the team member" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : 'Add Member'}</Button>
                        </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
             <CardContent>{teamLoading ? <div className="flex justify-center p-8"><Loader className="animate-spin"/></div> : (
             team && team.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {team.map(member => (
                    <Card key={member.id} className="group relative text-center">
                        <Image src={member.imageUrl} alt={member.name} width={150} height={150} className="w-full aspect-square object-cover rounded-t-lg" />
                        <div className="p-3">
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" className="absolute top-2 right-2 shrink-0"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently delete {member.name} from the team.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteMember(member.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </Card>
                ))}
             </div>
             ) : (
                <div className="text-center text-muted-foreground p-8 border rounded-lg">
                    <Users className="mx-auto h-12 w-12"/>
                    <p className="mt-4 font-semibold">No Team Members Added</p>
                    <p className="text-sm">Click "Add New Member" to add the first person.</p>
                </div>
             )
             )}</CardContent>
        </Card>
    );
}
