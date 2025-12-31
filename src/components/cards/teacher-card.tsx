
'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCheck } from "lucide-react";

export function TeacherCard({ teacher }: { teacher: any }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/educators/${teacher.id}`);
    };

    return (
        <Card className="overflow-hidden cursor-pointer" onClick={handleClick}>
             <div className="relative">
                <Image src={teacher.imageUrl} alt={teacher.name} width={200} height={150} className="object-cover w-full aspect-[4/3]" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <div className="flex items-center gap-1">
                        <h3 className="font-bold">{teacher.name}</h3>
                        <CheckCheck className="h-4 w-4 text-blue-400" />
                    </div>
                    <p className="text-xs">{teacher.experience}</p>
                </div>
            </div>
        </Card>
    );
}
