import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reddit Clone",
  description: "A full-stack Reddit clone built with FastAPI and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 min-h-screen`}
      >
        <AuthProvider>
          <Navbar />
          <div className="flex pt-14">
            <Sidebar />
            <div className="flex-1 lg:ml-60 flex justify-center min-h-[calc(100vh-3.5rem)]">
              <main className="flex-1 max-w-[640px] px-4 pt-6 pb-12">
                {children}
              </main>
              <RightSidebar />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
