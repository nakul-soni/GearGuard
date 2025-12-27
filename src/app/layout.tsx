import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClientLayout } from "@/components/layout/client-layout";
<<<<<<< HEAD
=======
import { ThemeProvider } from "@/components/providers/theme-provider";
import { FirebaseAuthProvider } from "@/components/providers/firebase-auth-provider";
import Script from "next/script";
>>>>>>> c66372c (Final Commit)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GearGuard - Maintenance Tracker",
  description: "The Ultimate Equipment and Maintenance Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
=======
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="00f9721c-3793-40bb-91fd-dd4c0feece67"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseAuthProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </FirebaseAuthProvider>
        </ThemeProvider>

>>>>>>> c66372c (Final Commit)
        <Toaster position="top-right" closeButton richColors />
      </body>
    </html>
  );
}
