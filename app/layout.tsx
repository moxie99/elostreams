import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elostreams — Hear every stream in your language",
  description:
    "Real-time voice translation for live streams. Viewers hear any streamer in their own language, in the streamer's own voice. No setup. No barriers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0A0E1A] text-white">{children}</body>
    </html>
  );
}
