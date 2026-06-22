import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { UserProvider } from "@/context/UserContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  weight: ["400", "500", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "intrst | Find Your People",
  description: "Verified college students platform. Find your actual people.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${dmSans.variable} 
          ${jetbrains.variable} 
          font-dmsans 
          bg-background 
          text-foreground 
          antialiased 
          selection:bg-orange-500/30
        `}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}