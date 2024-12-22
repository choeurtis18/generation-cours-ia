import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IA Tools for teachers",
  description: "UNE APPLICATION POUR GENERER DES COURS ET DES FICHES DE REVISION ET DES QCM VIA IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">

<Navbar />
<div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
        {children} </div>
        </div>
      </body>
    </html>
  );
}
