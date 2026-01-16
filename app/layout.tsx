import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MCPBlitz - Connect Your AI in 5 Minutes",
  description: "The fastest way to connect AI to your business tools. No code, no config files, just magic.",
  openGraph: {
    title: "MCPBlitz - Connect Your AI in 5 Minutes",
    description: "The fastest way to connect AI to your business tools.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-radial min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
