
'use client';

import { Card } from "@/components/ui/card";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trophy } from "lucide-react";

export function TopperCard({ topper }: { topper: any }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/toppers/${topper.id}`);
    };

    return (
        <Card className="overflow-hidden cursor-pointer text-center" onClick={handleClick}>
            <div className="relative">
                <Image src={topper.imageUrl} alt={topper.name} width={150} height={150} className="w-full aspect-square object-cover" />
            </div>
            <div className="p-2">
                 <h3 className="font-bold text-sm">{topper.name}</h3>
                 <div className="flex items-center justify-center gap-1 text-xs text-yellow-500">
                    <Trophy className="h-3 w-3" />
                    <p>{topper.achievement}</p>
                 </div>
            </div>
        </Card>
    );
}
