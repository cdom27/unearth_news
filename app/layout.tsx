import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MobileNav from "./_components/navigation/mobile-nav";

const archivo = localFont({
  src: [
    {
      path: "./_assets/fonts/Archivo-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./_assets/fonts/Archivo-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./_assets/fonts/Archivo-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-archivo",
  display: "swap",
});

const besleyCondensed = localFont({
  src: [
    {
      path: "./_assets/fonts/BesleyCondensed-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./_assets/fonts/BesleyCondensed-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-besley-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "unearth.news",
  description: "A civic intelligence tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${besleyCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main>{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}
