
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

const managementSections = [
    { 
        title: "मुख्य",
        items: [
            { href: '/admin', label: 'अवलोकन', icon: LayoutDashboard },
            { href: '/admin/revenue', label: 'Revenue', icon: PieChart },
        ]
    },
    {
        title: "Content",
        items: [
            { href: '/admin/home-screen', label: 'Home Screen Icons', icon: Home },
            { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
            { href: '/admin/news', label: 'News Ticker', icon: Newspaper },
            { href: '/admin/courses', label: 'Manage Courses', icon: BookOpen },
            { href: '/admin/content', label: 'Manage Content', icon: Palette },
            { href: '/admin/current-affairs', label: 'Current Affairs', icon: Newspaper },
            { href: '/admin/ebooks', label: 'Manage E-books', icon: Book },
            { href: '/admin/pyqs', label: 'Manage PYQs', icon: FileQuestion },
            { href: '/admin/test-series', label: 'Manage Tests', icon: Newspaper },
            { href: '/admin/posts', label: 'Manage Posts', icon: MessageSquare },
            { href: '/admin/youtube', label: 'YouTube Channels', icon: Youtube },
            { href: '/admin/live-content', label: 'Live Content', icon: Radio },
        ]
    },
    {
        title: "Users",
        items: [
            { href: '/admin/users', label: 'यूज़र्स', icon: Users },
            { href: '/admin/enrollments', label: 'एनरोलमेंट्स', icon: CreditCard },
            { href: '/admin/educators', label: 'एजुकेटर्स', icon: UserPlus },
            { href: '/admin/toppers', label: 'Manage Toppers', icon: Trophy },
            { href: '/admin/results', label: 'Submitted Results', icon: UserCheck },
        ]
    },
    {
        title: "E-commerce",
        items: [
             { href: '/admin/book-orders', label: 'Book Orders', icon: Package },
             { href: '/admin/books', label: 'Manage Books', icon: Book },
             { href: '/admin/coupons', label: 'Manage Coupons', icon: TicketPercent },
        ]
    },
     {
        title: "Our Company",
        items: [
            { href: '/admin/our-team', label: 'Our Team', icon: Users },
            { href: '/admin/our-services', label: 'Our Services', icon: Wand2 },
        ]
    },
    {
        title: "Settings",
        items: [
            { href: '/admin/notifications', label: 'Notifications', icon: Bell },
            { href: '/admin/settings', label: 'सेटिंग्स', icon: Settings },
        ]
    }
];

const creationNavItems = [
    { href: '/admin/create-course', label: 'नया कोर्स', icon: PlusCircle },
    { href: '/admin/create-ebook', label: 'Add E-book', icon: PlusCircle },
    { href: '/admin/create-pyq', label: 'Add PYQ', icon: PlusCircle },
    { href: '/admin/create-test', label: 'Add Test', icon: PlusCircle },
    { href: '/admin/create-book', label: 'Add Book', icon: PlusCircle },
    { href: '/admin/create-coupon', label: 'Add Coupon', icon: TicketPercent },
    { href: '/admin/live-lectures', label: 'Add Live Lecture', icon: Clapperboard },
    { href: '/admin/create-notification', label: 'Send Notification', icon: Bell },
]

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
    return <div className="flex h-screen items-center justify-center"><Loader className="animate-spin" /></div>;
  }
  
  if (!isAdminAuthenticated) {
     router.replace('/admin-auth');
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
        <aside className="hidden w-64 flex-col border-r bg-background sm:flex fixed h-full">
            <div className="border-b p-4">
                 <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Image src="https://i.supaimg.com/292dd0b1-b4e8-4bd9-b83e-2f416d3df54b.jpg" alt="Teach mania Logo" width={32} height={32} />
                    <span>Teach mania</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                     {managementSections.map((section) => (
                        <div key={section.title} className="my-2">
                            <h3 className="px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">{section.title}</h3>
                            {section.items.map(item => {
                                const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
                                return (
                                    <Link key={item.href} href={item.href} className={cn("mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", isActive && "bg-muted text-primary")}>
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
        <div className="flex flex-col sm:pl-64 w-full">
             <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <h1 className="text-xl font-semibold">एडमिन डैशबोर्ड</h1>
             </header>
             <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-3 lg:grid-cols-4">
                 <div className="grid auto-rows-max items-start gap-4 lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            {creationNavItems.map(item => (
                                <Button key={item.href} asChild variant={pathname === item.href ? 'secondary' : 'outline'} className="justify-start">
                                    <Link href={item.href}>
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.label}
                                    </Link>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                 </div>
                 <div className="lg:col-span-3">
                    {children}
                 </div>
             </main>
        </div>
    </div>
  );
}
