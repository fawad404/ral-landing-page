import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAL Connect – Demo Portal",
  description:
    "Experience how RAL Connect works. A guided simulation for discharge planners and residential assisted living owners in Arizona.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
