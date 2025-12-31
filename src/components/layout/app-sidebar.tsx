
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, BookCopy, Radio, Download, ClipboardList, Share2, LogOut, LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";
import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  iconColor: string;
};

const navItems: NavItem[] = [
    { href: "/", label: "Home", icon: Home, iconColor: "text-pink-500" },
    { href: "/profile", label: "Profile", icon: User, iconColor: "text-orange-500" },
    { href: "/my-library", label: "My Courses", icon: BookCopy, iconColor: "text-purple-500" },
    { href: "/live-lectures", label: "Live Classes", icon: Radio, iconColor: "text-blue-500" },
    { href: "/downloads", label: "Downloads", icon: Download, iconColor: "text-red-500" },
    { href: "/mcq", label: "MCQ", icon: ClipboardList, iconColor: "text-green-500" },
    { href: "/share", label: "Share App", icon: Share2, iconColor: "text-purple-500" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
      });
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'TM';
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-0 border-0">
         <div className="bg-[#090e23] p-4 flex items-center gap-3">
             <Avatar className="h-14 w-14 border-2 border-white">
                <AvatarImage src="https://i.supaimg.com/292dd0b1-b4e8-4bd9-b83e-2f416d3df54b.jpg" alt="user avatar" />
                <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
             </Avatar>
             <div className="text-white">
                <p className="font-bold text-lg">{user?.displayName || "Teach mania"}</p>
                <p className="text-sm">(Student)</p>
             </div>
         </div>
      </SidebarHeader>
      <SidebarContent className="p-0">
        <SidebarMenu className="gap-0">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href} className="px-2 py-1">
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                onClick={handleLinkClick}
                className="h-11 justify-start data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
              >
                <Link href={item.href}>
                  <item.icon className={item.iconColor} />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
       <SidebarFooter className="p-0">
        <SidebarMenu>
            <SidebarMenuItem className="px-2 py-1">
                <SidebarMenuButton onClick={handleLogout} className="h-11 justify-start">
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
