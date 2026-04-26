import type { Metadata } from "next";
import { Play } from "next/font/google";
import "./globals.css";

const playFont = Play({
  weight: ["400", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-play",
});

import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Chess Mastery",
  description: "Elevate your game with world-class coaching, rigorous training, and a global community of passionate players.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playFont.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
