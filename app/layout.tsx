import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_CONFIG } from "@/src/lib/config";

const mangoGrotesque = localFont({
  src: [
    {
      path: "../public/fonts/MangoGrotesque-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-mango",
});

const clashDisplay = localFont({
  src: [
    {
      path: "../public/fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash",
});

export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mangoGrotesque.variable} ${clashDisplay.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
