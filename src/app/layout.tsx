import type { Metadata } from "next";
import "./globals.css";


import { Inter, Roboto_Mono } from "next/font/google";

const geistSans = Inter({ subsets: ["latin"] });
const geistMono = Roboto_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistemas Tienda",
  description: "Producto de prueba para la tienda",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
  <head>
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="/icons/icono-192x192.jpg" />
    <meta name="theme-color" content="#00bfff" />
  </head>
  <body
    className={`${geistSans.style} ${geistMono.style} antialiased`}
  >
    {children}
  </body>
</html>

  );
}
