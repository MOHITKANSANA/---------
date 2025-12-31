
'use client';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
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
} from 'lucide-react';
import Image from 'next/image';
import { collection, doc, query, orderBy, limit } from 'firebase/firestore';
import { useMemo } from 'react';
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
import { NewsTicker } from '@/components/layout/news-ticker';


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

  const bannersQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'banners'), orderBy('createdAt', 'desc')) : null), [firestore]);
  const coursesQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'courses'), orderBy('createdAt', 'desc'), limit(10)) : null), [firestore]);
  const teamQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'team'), limit(10)) : null), [firestore]);
  const servicesQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'services'), orderBy('order', 'asc')) : null), [firestore]);

  const { data: banners, isLoading: bannersLoading } = useCollection(bannersQuery);
  const { data: courses, isLoading: coursesLoading } = useCollection(coursesQuery);
  const { data: team, isLoading: teamLoading } = useCollection(teamQuery);
  const { data: services, isLoading: servicesLoading } = useCollection(servicesQuery);


  const featureCards = useMemo(() => [
      { title: 'All Courses', href: '/courses', icon: GraduationCap, iconColor: 'text-orange-500' },
      { title: 'Live Class', href: '/live-lectures', icon: Clapperboard, iconColor: 'text-red-500' },
      { title: 'Notes', href: '/ebooks', icon: FileText, iconColor: 'text-blue-500' },
      { title: 'My Paid Courses', href: '/my-library', icon: Book, iconColor: 'text-purple-500' },
      { title: 'Social Links', href: '/social-links', icon: Users, iconColor: 'text-sky-500' },
      { title: 'Test', href: '/test-series', icon: ClipboardList, iconColor: 'text-indigo-500' },
      { title: 'Free Videos', href: '/youtube', icon: Youtube, iconColor: 'text-red-600' },
      { title: 'Free Test', href: '/test-series?filter=free', icon: ClipboardList, iconColor: 'text-green-500' },
      { title: 'Free Notes', href: '/ebooks?filter=free', icon: Library, iconColor: 'text-yellow-500' },
    ], []);


  if (isUserLoading) {
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
    <div className="bg-background min-h-screen">
      <header className="bg-background p-3 flex justify-between items-center shadow-sm sticky top-0 z-40">
        <SidebarTrigger />
        <div className="flex-1 flex justify-center">
             <Button variant="outline" className="h-10 border-gray-300">
                <p className="text-sm font-semibold">Class - 9 | Bihar Board</p>
                <ChevronDown className="ml-2 h-4 w-4" />
             </Button>
        </div>
        <Button variant="ghost" size="icon">
          <Bell />
        </Button>
      </header>

      <NewsTicker />

      <div className="p-4 space-y-6 pb-24 md:pb-8">
        {!bannersLoading && banners && banners.length > 0 && (
          <Carousel 
             plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
             opts={{ loop: true }}
             className="w-full"
          >
            <CarouselContent>
              {banners.map((banner: any) => (
                <CarouselItem key={banner.id}>
                  <div className="aspect-[16/7] relative">
                    <Image src={banner.imageUrl} alt={banner.alt || 'Promotional Banner'} fill className="rounded-lg object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

        <div className="grid grid-cols-3 gap-3">
          {featureCards.map((card, index) => {
             const Icon = card.icon;
             return (
              <Card key={index} onClick={() => handleCardClick(card.href)} className="flex flex-col items-center justify-center p-3 text-center aspect-square transition-transform hover:shadow-md cursor-pointer">
                <div className={cn("p-3 bg-muted rounded-full mb-2", card.iconColor)}>
                   <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <span className="font-semibold text-xs md:text-sm leading-tight">{card.title}</span>
              </Card>
            )}
          )}
        </div>
        
        {!servicesLoading && services && services.length > 0 && (
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                <h2 className="text-xl font-bold">Our Services</h2>
                <p className="text-sm opacity-90 mb-4">Admin Panel से जोड़ी गई सभी Services</p>
                 <div className="space-y-4">
                    {services.map((service: any) => (
                        <Card key={service.id} className="bg-white/10 border-white/20 text-white">
                            <CardContent className="p-4">
                                <div className="flex gap-4 items-center">
                                    <Image src={service.iconUrl} alt={service.name} width={40} height={40} className="rounded-md" />
                                    <div>
                                        <h3 className="font-bold">{service.name}</h3>
                                        <p className="text-xs opacity-80 line-clamp-2">{service.description}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <Button variant="secondary" size="sm">{service.leftButtonText || 'Other App'}</Button>
                                    <Button size="sm" className="bg-yellow-400 text-black hover:bg-yellow-500">{service.rightButtonText || 'Our App'}</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
                 <p className="text-xs text-center mt-4 opacity-80">यहां Admin Panel से जोड़ी गई वे सभी सुविधाएं दिखाई जाएंगी जो Teach Mania को अन्य ऐप्स से बेहतर बनाती हैं।</p>
            </div>
        )}

        {!coursesLoading && courses && courses.length > 0 && (
          <div>
              <h2 className="text-xl font-bold mb-3">Available Courses</h2>
              <Carousel opts={{ align: "start", loop: false }}>
                  <CarouselContent className="-ml-3">
                      {courses.map(course => (
                          <CarouselItem key={course.id} className="pl-3 basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                               <CourseCard course={course} />
                          </CarouselItem>
                      ))}
                  </CarouselContent>
              </Carousel>
          </div>
        )}

        {!teamLoading && team && team.length > 0 && (
          <div>
              <h2 className="text-xl font-bold mb-3">Our Team – Teach Mania</h2>
               <Carousel opts={{ align: "start", loop: false }}>
                  <CarouselContent className="-ml-3">
                      {team.map(member => (
                          <CarouselItem key={member.id} className="pl-3 basis-3/5 sm:basis-2/5 md:basis-1/3">
                               <TeacherCard teacher={member} />
                          </CarouselItem>
                      ))}
                  </CarouselContent>
              </Carousel>
          </div>
        )}

      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-[#090e23] p-1 flex justify-around md:hidden z-40">
        {footerItems.map(item => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            return (
                <Link href={item.href} key={item.name} className={cn("flex flex-col items-center text-xs w-1/4 text-center py-1 rounded-md", isActive ? "text-white" : "text-gray-400")}>
                    <Icon className="h-5 w-5 mb-0.5"/> 
                    <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
            )
        })}
      </footer>
    </div>
  );
}
