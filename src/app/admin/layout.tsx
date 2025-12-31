'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Users,
  BookOpen,
  CreditCard,
  UserPlus,
  LayoutDashboard,
  Settings,
  FileText,
  Radio,
  Book,
  FileQuestion,
  Newspaper,
  PlusCircle,
  Palette,
  Youtube,
  Clapperboard,
  MessageSquare,
  TicketPercent,
  Bell,
  ShieldCheck,
  BarChartHorizontal,
  PieChart,
  UserCheck,
  Trophy,
  Wand2,
  Package,
  Home,
  Image as ImageIcon,
} from 'lucide-react';
import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import Image from 'next/image';

const navSections = [
    { 
        title: "Dashboard",
        items: [
            { href: '/admin', label: 'Overview', icon: LayoutDashboard },
            { href: '/admin/revenue', label: 'Revenue', icon: PieChart },
        ]
    },
    {
        title: "Content Management",
        items: [
            { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
            { href: '/admin/courses', label: 'Courses', icon: BookOpen },
            { href: '/admin/content', label: 'Course Content', icon: Palette },
            { href: '/admin/ebooks', label: 'E-books', icon: Book },
            { href: '/admin/pyqs', label: 'PYQs', icon: FileQuestion },
            { href: '/admin/test-series', label: 'Tests', icon: FileText },
            { href: '/admin/current-affairs', label: 'Current Affairs', icon: Newspaper },
            { href: '/admin/posts', label: 'Community Posts', icon: MessageSquare },
            { href: '/admin/youtube', label: 'YouTube Channels', icon: Youtube },
            { href: '/admin/live-content', label: 'Live Content', icon: Radio },
        ]
    },
    {
        title: "User Management",
        items: [
            { href: '/admin/users', label: 'All Users', icon: Users },
            { href: '/admin/enrollments', label: 'Enrollments', icon: CreditCard },
        ]
    },
    {
        title: "Company Presence",
        items: [
            { href: '/admin/our-team', label: 'Our Team', icon: Users },
            { href: '/admin/our-services', label: 'Our Services', icon: Wand2 },
        ]
    },
    {
        title: "App Settings",
        items: [
            { href: '/admin/notifications', label: 'Notifications', icon: Bell },
            { href: '/admin/settings', label: 'Global Settings', icon: Settings },
        ]
    },
     {
        title: "Creation Hub",
        items: [
            { href: '/admin/create-course', label: 'Create Course', icon: PlusCircle },
            { href: '/admin/create-ebook', label: 'Create E-book', icon: PlusCircle },
            { href: '/admin/create-pyq', label: 'Create PYQ', icon: PlusCircle },
            { href: '/admin/create-test', label: 'Create Test', icon: PlusCircle },
            { href: '/admin/create-coupon', label: 'Create Coupon', icon: TicketPercent },
            { href: '/admin/live-lectures', label: 'Add Live Lecture', icon: Clapperboard },
        ]
    }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useLocalStorage('isAdminAuthenticated', false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isUserLoading) {
      if (!isAdminAuthenticated) {
        router.replace('/admin-auth');
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [isAdminAuthenticated, user, isUserLoading, router]);

  if (isUserLoading || isCheckingAuth) {
    return <div className="flex h-screen items-center justify-center bg-blue-50 dark:bg-gray-900"><Loader className="animate-spin text-blue-600" /></div>;
  }
  
  if (!isAdminAuthenticated) {
     router.replace('/admin-auth');
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
        <aside className="hidden w-72 flex-col border-r bg-white/80 backdrop-blur-sm dark:bg-gray-950/80 sm:flex fixed h-full">
            <div className="border-b p-4 flex items-center gap-3 bg-white/50 dark:bg-gray-950/50">
                 <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Image src="https://i.supaimg.com/292dd0b1-b4e8-4bd9-b83e-2f416d3df54b.jpg" alt="Teach Mania Logo" width={32} height={32} />
                    <span className="text-lg text-blue-800 dark:text-blue-300">Teach Mania <span className="font-light text-orange-500">Admin</span></span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                     {navSections.map((section) => (
                        <div key={section.title} className="my-3">
                            <h3 className="px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">{section.title}</h3>
                            {section.items.map(item => {
                                const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
                                return (
                                    <Link key={item.href} href={item.href} className={cn("mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900/50 dark:hover:text-blue-200", isActive && "bg-blue-100 text-blue-800 font-semibold dark:bg-blue-900/50 dark:text-blue-100")}>
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                     ))}
                </nav>
            </div>
        </aside>
        <div className="flex flex-col sm:pl-72 w-full">
             <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {children}
             </main>
        </div>
    </div>
  );
}
