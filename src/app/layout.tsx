"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { ChatProvider } from "../contexts/ChatContext";
import { DesignSystemProvider } from "../contexts/ThemeContext";
import { Header, Footer } from "../components/layout";
import { ChatBox } from "../components/chat";
import "./globals.css";
import { Toaster } from '@/components/ui/sonner';
import { Toaster as HotToaster } from 'react-hot-toast';
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Remove dark mode state and system preference sync

  // Always apply light mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      html.classList.remove('dark');
    }
  }, []);

  // setDarkMode as a no-op
  const setDarkMode = () => { };

  // Check if current page is an admin page or should exclude chat
  const shouldShowChatBox = () => {
    if (!pathname) return false;

    // Admin pages to exclude
    const adminRoutes = [
      '/admin-reports',
      '/profile-management',
      '/helper-applications'
    ];

    // Auth pages to exclude
    const authRoutes = [
      '/login',
      '/register'
    ];

    // Check if current path starts with any admin route
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    return !isAdminRoute && !isAuthRoute;
  };

  return (
    <html lang="vi">
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col`}
      >
        <DesignSystemProvider>
          <AuthProvider>
            <NotificationProvider>
              <ChatProvider>
                <Header darkMode={false} setDarkMode={setDarkMode} />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />

                {/* Chat Box - Show on all pages except admin and auth pages */}
                {shouldShowChatBox() && <ChatBox position="fixed" />}

                <Toaster position="top-right" />
                <HotToaster position="top-right" />
              </ChatProvider>
            </NotificationProvider>
          </AuthProvider>
        </DesignSystemProvider>
      </body>
    </html>
  );
}
