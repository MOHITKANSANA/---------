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
} from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
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
  const { pathname } = router;
  const { firestore } = useFirebase();

  const [homeIcons, setHomeIcons] = useState<Record<string, string>>({});
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  const homeSettingsQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'settings') : null), [firestore]);
  const bannersQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'banners'), orderBy('createdAt', 'desc')) : null), [firestore]);

  const { data: settingsDocs, isLoading: settingsLoading } = useCollection(homeSettingsQuery);
  const { data: bannersData, isLoading: bannersLoading } = useCollection(bannersQuery);

  useMemo(() => {
    if (settingsDocs) {
      const homeScreenSettings = settingsDocs.find(d => d.id === 'homeScreen');
      if (homeScreenSettings) {
        setHomeIcons(homeScreenSettings.featureIcons || {});
      }
    }
    if (bannersData) {
        setBanners(bannersData);
    }
    if (!settingsLoading && !bannersLoading) {
      setIsLoadingContent(false);
    }
  }, [settingsDocs, bannersData, settingsLoading, bannersLoading]);


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
       <header className="bg-[#090e23] p-3 flex justify-between items-center sticky top-0 z-40">
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
        
        <Card onClick={() => router.push('/ai-trick-generator')} className="cursor-pointer bg-gradient-to-r from-orange-500/10 via-black to-black border-orange-500/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wand2 className="h-6 w-6 text-orange-400" />
              <h3 className="font-semibold text-lg">Quickly Study Trick Generator</h3>
            </div>
        </Card>
        
        {banners.length > 0 && (
            <Carousel
              plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
            >
              <CarouselContent>
                {banners.map(banner => (
                    <CarouselItem key={banner.id}>
                        <div className="w-full aspect-video relative rounded-lg overflow-hidden">
                           <Image src={banner.imageUrl} alt={banner.alt} fill className="object-cover" />
                        </div>
                    </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
        )}


        <div className="grid grid-cols-3 gap-4">
          {featureCardsConfig.map((card, index) => {
             const Icon = card.defaultIcon;
             const customIconUrl = homeIcons[card.id];
             return (
              <Card key={index} onClick={() => handleCardClick(card.href)} className={cn("flex flex-col items-center justify-center p-3 text-center aspect-square transition-transform hover:shadow-md cursor-pointer bg-gradient-to-br", card.gradient)}>
                 {customIconUrl ? 
                    <Image src={customIconUrl} alt={card.title} width={48} height={48} className="h-12 w-12 object-contain mb-1" /> : 
                    <Icon className="h-12 w-12 mb-1" strokeWidth={1.5} />
                 }
                <span className="font-semibold text-xs md:text-sm leading-tight">{card.title}</span>
              </Card>
            )}
          )}
        </div>
        
        <Card onClick={() => router.push('/ai-doubt-solver')} className="cursor-pointer bg-gradient-to-r from-purple-500/10 via-black to-black border-purple-500/50 p-4 flex flex-col items-center">
            <div className="flex items-center gap-3">
              <Wand2 className="h-6 w-6 text-purple-400" />
              <h3 className="font-semibold text-lg">Quickly Study Doubt Solver</h3>
            </div>
            <Button className="mt-3 w-full bg-gray-800 text-white hover:bg-gray-700">Ask a Doubt</Button>
        </Card>
      </div>

       <footer className="fixed bottom-0 left-0 right-0 bg-[#040815] p-1 flex justify-around md:hidden z-40">
        {footerItems.map(item => {
            const isActive = pathname === item.href;
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
