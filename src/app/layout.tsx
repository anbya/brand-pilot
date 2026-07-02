import type { Metadata } from "next";
import { TopNav } from "@/components/brandpilot";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandPilot AI",
  description:
    "MVP shell untuk AI Social Media Manager yang mengubah brand profile menjadi campaign 30 hari lengkap dengan caption, image, video, approval, dan download.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <TopNav />
        {children}
      </body>
    </html>
  );
}
