import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { ChatProvider } from "../contexts/ChatContext";
import { Header, Footer } from "../components/layout";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find Helper - Ứng Dụng Tìm Người Giúp Việc",
  description: "Nền tảng kết nối khách hàng với người giúp việc nhà uy tín",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <NotificationProvider>
            <ChatProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <Toaster position="top-right" reverseOrder={false} />
            </ChatProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
