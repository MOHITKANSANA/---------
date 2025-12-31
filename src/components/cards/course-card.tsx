
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function CourseCard({ course }: { course: any }) {
    const router = useRouter();

    const handleDetailsClick = () => {
        router.push(`/courses/${course.id}`);
    };
    
    const handleBuyNowClick = () => {
        if (course.isFree) {
             router.push(`/courses/${course.id}`);
        } else {
             router.push(`/payment?itemId=${course.id}&itemType=course`);
        }
    }

    return (
        <Card className="overflow-hidden">
            <div className="aspect-video relative">
                <Image src={course.thumbnailUrl} alt={course.name} fill className="object-cover" />
            </div>
            <CardContent className="p-3 space-y-3">
                <h3 className="font-semibold text-sm line-clamp-2 h-10">{course.name}</h3>
                <div className="flex items-center gap-2">
                    {course.price > 0 && <p className="text-gray-500 line-through">₹{course.originalPrice || course.price * 1.5}</p>}
                    <p className="font-bold text-lg">₹{course.price}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={handleDetailsClick}>Details</Button>
                    <Button size="sm" className="w-full bg-green-500 hover:bg-green-600" onClick={handleBuyNowClick}>Buy Now</Button>
                </div>
            </CardContent>
        </Card>
    );
}
