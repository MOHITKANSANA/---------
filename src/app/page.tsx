
'use client';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  BookOpen,
  GraduationCap,
  Library,
  Newspaper,
  Loader,
  Home,
  Download,
  BookCopy,
  ClipboardList,
  Users,
  Youtube,
  Clapperboard,
  LifeBuoy,
  BrainCircuit,
  ChevronDown,
  Book,
  FileText,
} from 'lucide-react';
import Image from 'next/image';
import { collection, doc, query, orderBy, limit } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { CourseCard } from '@/components/cards/course-card';
import { TeacherCard } from '@/components/cards/teacher-card';
import { TopperCard } from '@/components/cards/topper-card';


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
  
  const coursesQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'courses'), orderBy('createdAt', 'desc'), limit(10)) : null), [firestore]);
  const teachersQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'educators'), limit(10)) : null), [firestore]);
  const toppersQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'toppers'), limit(10)) : null), [firestore]);
  
  const { data: courses, isLoading: coursesLoading } = useCollection(coursesQuery);
  const { data: teachers, isLoading: teachersLoading } = useCollection(teachersQuery);
  const { data: toppers, isLoading: toppersLoading } = useCollection(toppersQuery);


  const featureCards = useMemo(() => [
      { title: 'All Courses', href: '/courses', icon: GraduationCap },
      { title: 'Live Class', href: '/live-lectures', icon: Clapperboard, iconColor: 'text-red-500' },
      { title: 'Notes', href: '/ebooks', icon: FileText, iconColor: 'text-orange-500' },
      { title: 'My Paid Courses', href: '/my-library', icon: Book, iconColor: 'text-blue-500' },
      { title: 'Social Links', href: '/social-links', icon: Users, iconColor: 'text-sky-500' },
      { title: 'Test', href: '/test-series', icon: ClipboardList, iconColor: 'text-indigo-500' },
      { title: 'Free Videos', href: '/youtube', icon: Youtube, iconColor: 'text-red-600' },
      { title: 'Free Test', href: '/test-series?filter=free', icon: ClipboardList, iconColor: 'text-green-500' },
      { title: 'Free Notes', href: '/ebooks?filter=free', icon: Library, iconColor: 'text-yellow-500' },
    ], []);

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
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell-ring"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 2.2 2 3.2 2 4.5v8.5c0 1.1.9 2 2 2h3.5"/><path d="M20 2c1.2 0.2 2 2.5v8.5c0 1.1-.9 2-2 2h-3.5"/></svg>
            <span className="text-xs">Notifications</span>
        </div>
      </header>

      <div className="p-4 space-y-6 pb-24 md:pb-8">
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

        <div className="grid grid-cols-3 gap-3">
          {featureCards.map((card, index) => {
             const Icon = card.icon;
             return (
              <Card key={index} onClick={() => handleCardClick(card.href)} className="flex flex-col items-center justify-center p-3 text-center aspect-square transition-transform hover:scale-105 cursor-pointer">
                <div className="p-3 bg-muted rounded-full mb-2">
                   <Icon className={cn("h-6 w-6", card.iconColor)} strokeWidth={1.5} />
                </div>
                <span className="font-semibold text-xs md:text-sm leading-tight">{card.title}</span>
              </Card>
            )}
          )}
        </div>

        {appSettings?.aiDoubtSolverEnabled && (
           <Card className="bg-blue-950 text-white cursor-pointer" onClick={() => router.push('/ai-doubt-solver')}>
               <CardContent className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                        <Image src="https://i.imgur.com/JGyx2tF.png" alt="AI Icon" width={32} height={32} />
                        <span className="text-xl font-bold">Doubt</span>
                   </div>
               </CardContent>
           </Card>
        )}

        <div>
            <h2 className="text-xl font-bold mb-3">Latest Courses</h2>
            {coursesLoading ? <Loader className="animate-spin" /> : (
            <Carousel opts={{ align: "start", loop: true }}>
                <CarouselContent className="-ml-3">
                    {courses?.map(course => (
                        <CarouselItem key={course.id} className="pl-3 basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                             <CourseCard course={course} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            )}
        </div>

        <div>
            <h2 className="text-xl font-bold mb-3">Top Teachers</h2>
             {teachersLoading ? <Loader className="animate-spin" /> : (
            <Carousel opts={{ align: "start", loop: true }}>
                <CarouselContent className="-ml-3">
                    {teachers?.map(teacher => (
                        <CarouselItem key={teacher.id} className="pl-3 basis-3/5 sm:basis-2/5 md:basis-1/3">
                             <TeacherCard teacher={teacher} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
             )}
        </div>

        <div>
            <h2 className="text-xl font-bold mb-3">TARGET BOARD के TOPPERS</h2>
             {toppersLoading ? <Loader className="animate-spin" /> : (
            <Carousel opts={{ align: "start", loop: true }}>
                <CarouselContent className="-ml-3">
                    {toppers?.map(topper => (
                        <CarouselItem key={topper.id} className="pl-3 basis-3/5 sm:basis-2/5 md:basis-1/3">
                             <TopperCard topper={topper} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            )}
        </div>

      </div>

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
