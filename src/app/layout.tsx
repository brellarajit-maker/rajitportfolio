import type { Metadata, Viewport } from "next";
import { Syne, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { person } from "@/data/site";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${person.name} — Website Developer & Designer`,
  description: person.tagline,
  keywords: [
    "Rajit Barella",
    "website developer",
    "designer",
    "frontend developer",
    "New Delhi",
  ],
  authors: [{ name: person.name }],
  openGraph: {
    title: `${person.name} — Website Developer & Designer`,
    description: person.tagline,
    type: "profile",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#06080d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${interTight.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
