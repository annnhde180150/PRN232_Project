"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { ChatProvider } from "../contexts/ChatContext";
import { Header, Footer } from "../components/layout";
import "./globals.css";
import { Toaster } from '@/components/ui/sonner';
import React, { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Remove dark mode state and system preference sync

  // Always apply light mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      html.classList.remove('dark');
    }
  }, []);

  // setDarkMode as a no-op
  const setDarkMode = () => {};

  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <NotificationProvider>
            <ChatProvider>
              <Header darkMode={false} setDarkMode={setDarkMode} />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <Toaster position="top-right" />
            </ChatProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
