
'use client';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function NewsTicker() {
    const firestore = useFirestore();
    const [newsItems, setNewsItems] = useState<any[]>([]);

    const newsQuery = useMemoFirebase(() => (
        firestore ? query(collection(firestore, 'news'), orderBy('createdAt', 'desc'), limit(5)) : null
    ), [firestore]);

    const { data: fetchedNews, isLoading } = useCollection(newsQuery);

    useEffect(() => {
        if (fetchedNews) {
            setNewsItems(fetchedNews);
        }
    }, [fetchedNews]);

    if (isLoading || newsItems.length === 0) {
        return null; // Hide component if loading or no news
    }

    const allNewsText = newsItems.map(item => item.text).join(' ••• ');

    return (
        <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 overflow-hidden flex items-center">
            <Volume2 className="h-5 w-5 mx-3 shrink-0" />
            <div className="relative flex overflow-x-hidden">
                <p className="animate-marquee whitespace-nowrap text-sm font-medium">
                    {allNewsText}
                </p>
                 <p className="absolute top-0 animate-marquee2 whitespace-nowrap text-sm font-medium">
                    {allNewsText}
                </p>
            </div>
        </div>
    );
}

// Ensure you add the animation to tailwind.config.ts
/*
// tailwind.config.ts
...
theme: {
    extend: {
        animation: {
            marquee: 'marquee 25s linear infinite',
            marquee2: 'marquee2 25s linear infinite',
        },
        keyframes: {
            marquee: {
                '0%': { transform: 'translateX(0%)' },
                '100%': { transform: 'translateX(-100%)' },
            },
            marquee2: {
                '0%': { transform: 'translateX(100%)' },
                '100%': { transform: 'translateX(0%)' },
            },
        },
    },
},
...
*/
