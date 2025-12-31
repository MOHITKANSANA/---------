
'use client';
import { useUser, useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import {
  BookOpen,
  GraduationCap,
  Library,
  Loader,
  Home,
  Download,
  BookCopy,
  ClipboardList,
  Users,
  Youtube,
  Clapperboard,
  ChevronDown,
  Book,
  FileText,
  Bell,
  Wand2,
  Gift,
  Newspaper,
  User,
  MessageCircle,
  Share2,
  Tv,
  LifeBuoy,
} from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { collection, query, orderBy } from 'firebase/firestore';

const footerItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Library', href: '/my-library', icon: Library },
    { name: 'Feed', href: '/feed', icon: MessageCircle },
    { name: 'Refer', href: '/refer', icon: Share2 },
    { name: 'Profile', href: '/profile', icon: User },
];

const featureCardsConfig = [
      { id: 'courses', title: 'All Courses', href: '/courses', defaultIcon: GraduationCap, gradient: 'from-purple-500 to-indigo-600' },
      { id: 'live_classes', title: 'Live Class', href: '/live-lectures', defaultIcon: Clapperboard, gradient: 'from-orange-500 to-red-600' },
      { id: 'ai_test', title: 'AI Test', href: '/ai-test', defaultIcon: Wand2, gradient: 'from-sky-500 to-cyan-600' },
      { id: 'ebooks', title: 'E-books', href: '/ebooks', defaultIcon: Book, gradient: 'from-teal-500 to-green-600' },
      { id: 'pyqs', title: 'PYQs', href: '/pyqs', defaultIcon: FileText, gradient: 'from-yellow-500 to-amber-600' },
      { id: 'test_series', title: 'Test Series', href: '/test-series', defaultIcon: ClipboardList, gradient: 'from-pink-500 to-rose-600' },
      { id: 'current_affairs', title: 'Current Affairs', href: '/current-affairs', defaultIcon: Newspaper, gradient: 'from-cyan-500 to-blue-600' },
      { id: 'free_courses', title: 'Free Courses', href: '/courses?filter=free', defaultIcon: Gift, gradient: 'from-red-500 to-orange-500' },
      { id: 'youtube', title: 'YouTube', href: '/youtube', defaultIcon: Youtube, gradient: 'from-rose-600 to-red-700' },
];


export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { firestore } = useFirebase();

  const [banners, setBanners] = useState<any[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  const bannersQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'banners'), orderBy('createdAt', 'desc')) : null), [firestore]);
  const { data: bannersData, isLoading: bannersLoading } = useCollection(bannersQuery);

  useEffect(() => {
    if (bannersData) {
        setBanners(bannersData);
    }
    if (!bannersLoading) {
      setIsLoadingContent(false);
    }
  }, [bannersData, bannersLoading]);


  if (isUserLoading || isLoadingContent) {
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
    <div className="bg-[#090e23] min-h-screen text-white">
       <header className="bg-card/80 backdrop-blur-sm p-3 flex justify-between items-center sticky top-0 z-40">
        <SidebarTrigger />
        <Link href="/">
            <Image src="https://i.supaimg.com/292dd0b1-b4e8-4bd9-b83e-2f416d3df54b.jpg" alt="Teach Mania Logo" width={40} height={40} className="rounded-full" />
        </Link>
        <Button asChild variant="ghost" size="icon">
          <Link href="/notifications">
            <Bell />
          </Link>
        </Button>
      </header>

      <div className="p-4 space-y-6 pb-24 md:pb-8">
        
        {banners.length > 0 && (
            <Carousel
              plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
            >
              <CarouselContent>
                {banners.map(banner => (
                    <CarouselItem key={banner.id}>
                        <div className="w-full aspect-[16/7] relative rounded-lg overflow-hidden">
                           <Image src={banner.imageUrl} alt={banner.alt} fill className="object-cover" />
                        </div>
                    </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
        )}
        
        <Card onClick={() => router.push('/ai-trick-generator')} className="cursor-pointer bg-gradient-to-r from-orange-500 to-amber-500 border-orange-500/50 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wand2 className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-base text-white">Teach Mania Trick Generator</h3>
            </div>
        </Card>


        <div className="grid grid-cols-3 gap-4">
          {featureCardsConfig.map((card, index) => {
             const Icon = card.defaultIcon;
             return (
              <Card key={index} onClick={() => handleCardClick(card.href)} className={cn("flex flex-col items-center justify-center p-3 text-center aspect-square transition-transform hover:shadow-md cursor-pointer bg-gradient-to-br", card.gradient)}>
                  <Icon className="h-10 w-10 mb-1 text-white" strokeWidth={1.5} />
                <span className="font-semibold text-xs md:text-sm leading-tight text-white">{card.title}</span>
              </Card>
            )}
          )}
        </div>
        
        <Card onClick={() => router.push('/ai-doubt-solver')} className="cursor-pointer bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-500/50 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wand2 className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-base text-white">Teach Mania Doubt Solver</h3>
            </div>
        </Card>
      </div>

       <footer className="fixed bottom-0 left-0 right-0 bg-[#040815] p-1 flex justify-around md:hidden z-40">
        {footerItems.map(item => {
            const isActive = false; // pathname can't be used here directly, placeholder
            return (
                <Link href={item.href} key={item.name} className={cn("flex flex-col items-center text-xs w-1/5 text-center py-1 rounded-md", isActive ? "text-white" : "text-gray-400")}>
                    <item.icon className="h-5 w-5 mb-0.5"/> 
                    <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
            )
        })}
      </footer>
    </div>
  );
}
