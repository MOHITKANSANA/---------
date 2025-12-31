
'use client';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  Gift,
  GraduationCap,
  Library,
  Newspaper,
  Loader,
  Star,
  Home,
  Bell,
  Rss,
  ClipboardList,
  Users,
  Download,
  Book as EbookIcon,
  FileQuestion,
  Youtube,
  BarChartHorizontal,
  Clapperboard,
  UserCheck,
  LifeBuoy,
  MessageCircle,
  Wand2,
  Trophy,
  BrainCircuit,
  ChevronDown,
  BookCopy,
} from 'lucide-react';
import Image from 'next/image';
import { collection, doc } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"


const footerItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'My Courses', href: '/my-library', icon: BookCopy },
    { name: 'Downloads', href: '/downloads', icon: Download },
    { name: 'Notice Board', href: '/notice-board', icon: ClipboardList },
];

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const appSettingsRef = useMemoFirebase(() => (firestore ? doc(firestore, 'settings', 'app') : null), [firestore]);
  const { data: appSettings, isLoading: settingsLoading } = useDoc(appSettingsRef);
  
  const featureCards = useMemo(() => {
    let cards = [
      { title: 'All Courses', href: '/courses', icon: GraduationCap },
      { title: 'Live Class', href: '/live-lectures', icon: Clapperboard },
      { title: 'Notes', href: '/ebooks', icon: BookOpen },
      { title: 'My Paid Courses', href: '/my-library', icon: Library },
      { title: 'Social Links', href: '/social-links', icon: Users },
      { title: 'Test', href: '/test-series', icon: ClipboardList },
      { title: 'Free Videos', href: '/youtube', icon: Youtube },
      { title: 'Free Test', href: '/test-series?filter=free', icon: EbookIcon },
      { title: 'Free Notes', href: '/ebooks?filter=free', icon: FileQuestion },
    ];
    return cards;
  }, []);

  const banners = [
    { id: 'banner-1', imageUrl: 'https://i.imgur.com/IT22J6b.png', alt: 'Navratri Offer' },
    { id: 'banner-2', imageUrl: 'https://i.imgur.com/2QY6x9K.png', alt: 'Udaan Batch' },
  ];

  if (isUserLoading || settingsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  const handleCardClick = (path: string) => {
    router.push(path);
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="bg-background p-3 flex justify-between items-center shadow-md sticky top-0 z-40">
        <SidebarTrigger />
        <div className="flex-1 flex justify-center">
             <Button variant="outline" className="h-10">
                <Image src="https://i.supaimg.com/292dd0b1-b4e8-4bd9-b83e-2f416d3df54b.jpg" alt="Logo" width={24} height={24} className="mr-2 rounded-full" />
                <div className="text-left">
                    <p className="text-sm font-semibold">Class - 9</p>
                    <p className="text-xs text-muted-foreground">बिहार बोर्ड</p>
                </div>
                <ChevronDown className="ml-2 h-4 w-4" />
             </Button>
        </div>
        <div className="flex flex-col items-center">
            <Bell className="h-6 w-6"/>
            <span className="text-xs">Notifications</span>
        </div>
      </header>

      <div className="p-4 space-y-4 pb-24 md:pb-8">
        {/* Banners */}
        <Carousel 
           plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
           opts={{ loop: true }}
           className="w-full"
        >
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="aspect-[16/7] relative">
                  <Image src={banner.imageUrl} alt={banner.alt} fill className="rounded-lg object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Feature Grid */}
        <div className="grid grid-cols-3 gap-3">
          {featureCards.map((card, index) => {
             const Icon = card.icon;
             return (
              <Card key={index} onClick={() => handleCardClick(card.href)} className="flex flex-col items-center justify-center p-3 text-center aspect-square transition-transform hover:scale-105 cursor-pointer">
                <Icon className="mb-2 h-8 w-8 text-primary" strokeWidth={1.5} />
                <span className="font-semibold text-xs md:text-sm leading-tight">{card.title}</span>
              </Card>
            )}
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t p-1 flex justify-around md:hidden z-40">
        {footerItems.map(item => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            return (
                <Link href={item.href} key={item.name} className={cn("flex flex-col items-center text-xs w-1/4 text-center py-1 rounded-md", isActive ? "text-primary" : "text-muted-foreground")}>
                    <Icon className="h-5 w-5 mb-0.5"/> 
                    <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
            )
        })}
      </footer>
    </div>
  );
}
