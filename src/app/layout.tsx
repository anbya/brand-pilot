import type { Metadata } from "next";
import { ConditionalTopNav } from "@/components/conditional-top-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Marketing OS | BrandPilot AI",
  description:
    "AI Marketing OS untuk merencanakan, membuat, dan menerbitkan campaign marketing modern dari satu workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ConditionalTopNav />
        {children}
      </body>
    </html>
  );
}
