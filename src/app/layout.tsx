import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { FirebaseClientProvider } from '@/firebase';
import { AuthGate } from '@/components/layout/auth-gate';
import { Suspense } from 'react';


const APP_NAME = "Teach Mania";
const APP_DEFAULT_TITLE = "Teach Mania";
const APP_TITLE_TEMPLATE = "%s - Teach Mania";
const APP_DESCRIPTION = "The quickest way to study.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: 'https://i.supaimg.com/292dd0b1-b4e8-4bd9-b83e-2f416d3df54b.jpg',
    apple: 'https://i.supaimg.com/292dd0b1-b4e8-4bd9-b83e-2f416d3df54b.jpg',
  },
  other: {
    "google-site-verification": "tpxyguMPSOqv1W6Aj42I4lhHQB-Ky5tA2SjqoP66LtI"
  }
};

export const viewport: Viewport = {
  themeColor: '#090e23',
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <Suspense>
              <AuthGate>
                {children}
              </AuthGate>
            </Suspense>
          </FirebaseClientProvider>
          <Toaster />
          <div id="recaptcha-container"></div>
        </ThemeProvider>
      </body>
    </html>
  );
}
