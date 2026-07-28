import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RAL Connect – Keep Your Beds Full With the RIGHT Residents",
  description:
    "RAL Connect connects your assisted living home with qualified families in Phoenix — no high placement fees, no wasted time, no bad-fit move-ins.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#0F172A]">
        {children}
      </body>
    </html>
  );
}
